import { useEffect, useMemo, useState } from "react";

const CART_STORAGE_KEY = "aoe-merch-cart-v1";

function loadSavedCart() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored.filter(item => item && item.variantId && Number(item.quantity) > 0) : [];
  } catch {
    return [];
  }
}

// Product categories are assigned through Shopify Collections, not edited in website code.
// Create these collections in Shopify (Products > Collections). The matching
// Shopify handle is normally generated automatically from each collection title.
const SHOP_CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "merch", label: "AOE Merchandise", handles: ["aoe-merchandise", "merchandise", "merch"], names: ["aoe merchandise", "merchandise", "merch"] },
  { id: "stickers", label: "Stickers", handles: ["stickers", "aoe-stickers"], names: ["stickers", "aoe stickers"] },
  { id: "winches", label: "Winches & Recovery", handles: ["winches-recovery", "winches-and-recovery"], names: ["winches & recovery", "winches and recovery"] },
  { id: "welders", label: "Welders & Fabrication", handles: ["welders-fabrication", "welders-and-fabrication"], names: ["welders & fabrication", "welders and fabrication"] },
  { id: "alaska", label: "Alaska-Made Products", handles: ["alaska-made-products", "alaska-made", "alaska-made-goods"], names: ["alaska-made products", "alaska made products", "alaska-made goods"] },
];

function hasMatchingCollection(product, category) {
  const collections = product.collections?.edges || [];
  return collections.some(({ node }) =>
    category.handles.includes(String(node.handle || "").toLowerCase()) ||
    category.names.includes(String(node.title || "").toLowerCase().trim())
  );
}

function belongsToCategory(product, category) {
  if (category.id === "all") return true;
  // A sticker should never appear under general AOE Merchandise, even if
  // Shopify still lists it in both collections during the transition.
  if (category.id === "merch" && hasMatchingCollection(product, SHOP_CATEGORIES.find((c) => c.id === "stickers"))) {
    return false;
  }
  return hasMatchingCollection(product, category);
}

// Featured shop sections use photos from published Shopify products.
// No extra image maintenance is needed when merchandise changes.
const FEATURED_SHOP = [
  { id: "welders", title: "Karnage Welders", subtitle: "Welding & fabrication", keywords: ["karnage", "carnage", "welder", "welding"] },
  { id: "winches", title: "Carbon Offroad Winches", subtitle: "Winches & recovery equipment", keywords: ["carbon", "winch", "recovery"] },
  { id: "merch", title: "AOE Merchandise", subtitle: "Wear your Alaska adventure", keywords: ["hoodie", "shirt", "hat", "apparel"] },
];

function featuredProductImage(products, featured) {
  const category = SHOP_CATEGORIES.find((item) => item.id === featured.id);
  const matches = products.filter((product) => belongsToCategory(product, category));
  const preferred = matches.find((product) => featured.keywords.some((word) => product.title.toLowerCase().includes(word)) && product.featuredImage?.url);
  return (preferred || matches.find((product) => product.featuredImage?.url))?.featuredImage || null;
}

const SHOPIFY_DOMAIN = "26e0dd.myshopify.com";
const STOREFRONT_TOKEN = "e1bdd61da97053ba0f106a420f798e71";

async function shopifyFetch(query, variables = {}) {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) throw new Error(`Shopify request failed (${res.status}).`);
  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  return json.data;
}

export default function Merch() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [detailsProduct, setDetailsProduct] = useState(null);
  const chooseCategory = (id) => {
    setActiveCategory(id);
    setSearchTerm("");
    // Wait until React applies the filter, then focus the product grid.
    window.requestAnimationFrame(() => {
      document.getElementById("shop-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  const filteredProducts = useMemo(() => {
    const category = SHOP_CATEGORIES.find((c) => c.id === activeCategory) || SHOP_CATEGORIES[0];
    const query = searchTerm.trim().toLowerCase();
    return products.filter((product) => belongsToCategory(product, category) &&
      (!query || `${product.title} ${product.description || ""}`.toLowerCase().includes(query)));
  }, [products, activeCategory, searchTerm]);
  const [cart, setCart] = useState(loadSavedCart);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent("aoe-merch-cart-updated", {
        detail: { count: cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0) }
      }));
    } catch (error) {
      console.warn("Merch cart could not be saved:", error);
    }
  }, [cart]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        // Fetch every product published to the Storefront sales channel.
        // Shopify returns products in pages, not as a single unbounded result.
        const query = `
          query GetAllStoreProducts($cursor: String) {
            products(first: 100, after: $cursor) {
              pageInfo { hasNextPage endCursor }
              edges {
                node {
                  id
                  title
                  description
                  handle
                  availableForSale
                  collections(first: 50) {
                    edges { node { handle title } }
                  }
                  featuredImage { url altText }
                  images(first: 30) { edges { node { url altText } } }
                  variants(first: 100) {
                    edges {
                      node {
                        id
                        title
                        availableForSale
                        image { url altText }
                        price { amount currencyCode }
                        selectedOptions { name value }
                      }
                    }
                  }
                }
              }
            }
          }
        `;
        const allProducts = [];
        let cursor = null;
        let hasNextPage = true;
        const seenCursors = new Set();
        while (hasNextPage) {
          const data = await shopifyFetch(query, { cursor });
          const connection = data?.products;
          if (!connection) throw new Error("Shopify did not return products.");
          allProducts.push(...connection.edges.map((edge) => edge.node));
          hasNextPage = Boolean(connection.pageInfo?.hasNextPage);
          const nextCursor = connection.pageInfo?.endCursor;
          if (hasNextPage && (!nextCursor || seenCursors.has(nextCursor))) {
            throw new Error("Shopify product pagination stopped unexpectedly.");
          }
          if (nextCursor) seenCursors.add(nextCursor);
          cursor = nextCursor;
        }
        setProducts(allProducts);
      } catch (err) {
        console.error("Shopify product load error:", err);
        setError("Could not load shop products right now.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const addToCart = (product, variant, quantity) => {
    if (!variant || !variant.availableForSale) return;

    setCart((current) => {
      const existing = current.find((item) => item.variantId === variant.id);

      if (existing) {
        return current.map((item) =>
          item.variantId === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...current,
        {
          productTitle: product.title,
          variantTitle: variant.title,
          variantId: variant.id,
          image: product.featuredImage?.url,
          price: Number(variant.price.amount),
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (variantId) => {
    setCart((current) => current.filter((item) => item.variantId !== variantId));
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const checkout = async () => {
    if (!cart.length) return;

    try {
      setCheckoutLoading(true);

      const data = await shopifyFetch(
        `
        mutation CreateCart($lines: [CartLineInput!]!) {
          cartCreate(input: { lines: $lines }) {
            cart {
              checkoutUrl
            }
            userErrors {
              field
              message
            }
          }
        }
        `,
        {
          lines: cart.map((item) => ({
            merchandiseId: item.variantId,
            quantity: item.quantity,
          })),
        }
      );

      const errors = data.cartCreate?.userErrors || [];
      if (errors.length) {
        throw new Error(errors.map((e) => e.message).join(", "));
      }

      window.location.href = data.cartCreate.cart.checkoutUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong starting checkout.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <section id="shop-products" className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:pb-16 sm:pt-8">
      {/* Store banner: one concise heading, using the site's existing theme. */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-400/30 bg-gradient-to-br from-neutral-900 via-neutral-950 to-orange-950/40 px-5 py-12 text-center shadow-xl sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/70 to-transparent" />
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-orange-400">Alaska Off-Road Expedition</p>
        <h1 className="mt-3 text-3xl font-black uppercase tracking-wide text-white sm:text-5xl lg:text-6xl">The Shop</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-neutral-300 sm:text-base">
          Off-road equipment, expedition gear, and authentic Alaska-made products.
        </p>
      </div>

      {/* Feature category cards. Photos always come from actual Shopify listings. */}
      <div className="mt-10 sm:mt-12">
        <h2 className="text-center text-xl font-extrabold uppercase tracking-wide text-white sm:text-2xl">Featured Collections</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {FEATURED_SHOP.map((featured) => {
            const photo = featuredProductImage(products, featured);
            return (
              <button
                key={featured.id}
                type="button"
                onClick={() => chooseCategory(featured.id)}
                className="group relative flex min-h-48 flex-col justify-end overflow-hidden rounded-2xl border border-white/15 bg-neutral-900 p-5 text-left shadow-lg transition hover:border-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400 sm:min-h-64"
                aria-label={`Shop ${featured.title}`}
              >
                {photo ? (
                  <img src={photo.url} alt={photo.altText || featured.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                ) : (
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-orange-950/50" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
                <span className="relative text-xl font-extrabold text-white sm:text-2xl">{featured.title}</span>
                <span className="relative mt-1 text-sm text-neutral-200">{featured.subtitle}</span>
                <span className="relative mt-3 text-sm font-bold text-orange-300 group-hover:text-orange-200">Shop collection →</span>
              </button>
            );
          })}
        </div>
      </div>

      <div id="shop-catalog" className="mt-12 scroll-mt-28 sm:mt-14">
        <h2 className="text-center text-xl font-extrabold uppercase tracking-wide text-white sm:text-2xl">Browse All Products</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-neutral-400">Select a category to find exactly what you're looking for.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="mb-7 mt-6 space-y-4">
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter shop by category">
          {SHOP_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => chooseCategory(category.id)}
              aria-pressed={activeCategory === category.id}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400 ${activeCategory === category.id
                ? "border-orange-400 bg-orange-500 text-white"
                : "border-white/20 bg-neutral-900 text-neutral-200 hover:border-orange-400/60 hover:text-white"}`}
            >
              {category.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <label className="w-full sm:max-w-sm">
            <span className="sr-only">Search shop products</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-white/20 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-500 focus:border-orange-400 focus:outline-none"
            />
          </label>
          {!loading && <p className="text-sm text-neutral-400" aria-live="polite">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          </p>}
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-neutral-900/40 p-8 text-center text-neutral-300">
          Loading products...
        </div>
      ) : (
        <>
          {filteredProducts.length ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onViewDetails={() => setDetailsProduct(product)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-8 text-center text-neutral-300">
              <p className="font-semibold text-white">No matching products yet.</p>
              <p className="mt-2 text-sm">Products appear here when assigned to this Shopify collection and published to the online storefront.</p>
              <button type="button" className="mt-4 text-orange-400 hover:text-orange-300" onClick={() => { setActiveCategory("all"); setSearchTerm(""); }}>
                View all products
              </button>
            </div>
          )}

          <div id="merch-cart" className="mt-10 scroll-mt-32 rounded-3xl border border-white/10 bg-neutral-900/60 p-6">
            <h3 className="text-2xl font-bold">Cart</h3>

            {!cart.length ? (
              <p className="mt-3 text-neutral-400">Your cart is empty.</p>
            ) : (
              <div className="mt-5 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex items-center justify-between gap-4 rounded-xl bg-neutral-800/70 p-4"
                  >
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.productTitle}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      )}

                      <div>
                        <div className="font-semibold">{item.productTitle}</div>
                        <div className="text-sm text-neutral-400">
                          {item.variantTitle && item.variantTitle !== "Default Title" ? `${item.variantTitle} × ${item.quantity}` : `Qty: ${item.quantity}`}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-orange-400">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="mt-1 text-xs text-neutral-400 hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex flex-col gap-4 border-t border-white/10 pt-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm text-neutral-400">Subtotal</div>
                    <div className="text-2xl font-extrabold text-white">
                      ${cartSubtotal.toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={checkout}
                    disabled={checkoutLoading}
                    className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-400 disabled:opacity-60"
                  >
                    {checkoutLoading ? "Starting checkout..." : "Checkout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {detailsProduct && (
        <ProductDetailsModal
          key={detailsProduct.id}
          product={detailsProduct}
          onAddToCart={addToCart}
          onClose={() => setDetailsProduct(null)}
        />
      )}
    </section>
  );
}

function ProductCard({ product, onAddToCart, onViewDetails }) {
  const variants = product.variants.edges.map((edge) => edge.node);
  // Shopify assigns a hidden Default Title variant to products with no options.
  // Only show a selector when the customer has a meaningful choice.
  const hasRealVariants = variants.length > 1 &&
    !variants.every((variant) => variant.title?.trim().toLowerCase() === "default title");
  const firstAvailable =
    variants.find((variant) => variant.availableForSale) || variants[0];

  const [selectedVariantId, setSelectedVariantId] = useState(firstAvailable?.id);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ||
    firstAvailable;

  // A selected Shopify variant can have its own photo (for example, a color).
  // Fall back to the product photo when Shopify has no variant-specific image.
  const selectedImage = selectedVariant?.image || product.featuredImage || product.images?.edges?.[0]?.node;
  const image = selectedImage?.url || "";

  const price = selectedVariant?.price?.amount
    ? Number(selectedVariant.price.amount).toFixed(2)
    : "0.00";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50">
      <button type="button" onClick={onViewDetails} className="block aspect-[4/3] w-full overflow-hidden bg-neutral-800 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400" aria-label={`View details for ${product.title}`}>
        {image ? (
          <img
            src={image}
            alt={selectedImage?.altText || `${product.title} product photo`}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span className="grid h-full place-items-center text-neutral-500">No image</span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="min-h-[40px] text-sm font-bold leading-tight text-white sm:text-base">
          <button type="button" onClick={onViewDetails} className="line-clamp-2 text-left hover:text-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400">{product.title}</button>
        </h3>
        <div className="mt-2 text-lg font-extrabold text-orange-400">
          ${price}
        </div>

        <div className="mt-4 space-y-3">
          {hasRealVariants && (
          <div>
            <label className="text-xs text-neutral-400">Option</label>
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-neutral-800 px-3 text-white"
            >
              {variants.map((variant) => (
                <option
                  key={variant.id}
                  value={variant.id}
                  disabled={!variant.availableForSale}
                >
                  {variant.title}
                  {!variant.availableForSale ? " - Sold Out" : ""}
                </option>
              ))}
            </select>
          </div>
          )}

          <div>
            <label className="text-xs text-neutral-400">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number(e.target.value || 1)))
              }
              className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-neutral-800 px-3 text-white"
            />
          </div>
        </div>

        <button
          onClick={() => onAddToCart(product, selectedVariant, quantity)}
          disabled={!selectedVariant?.availableForSale}
          className="mt-4 rounded-lg bg-orange-500 px-2 py-2.5 text-xs font-bold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-3 sm:text-base"
        >
          {selectedVariant?.availableForSale ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}

function ProductDetailsModal({ product, onAddToCart, onClose }) {
  const variants = product.variants?.edges?.map(({ node }) => node) || [];
  const firstAvailable = variants.find((variant) => variant.availableForSale) || variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState(firstAvailable?.id || "");
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId) || firstAvailable;
  const hasRealVariants = variants.length > 1 && !variants.every((variant) => variant.title?.trim().toLowerCase() === "default title");

  const photos = [];
  const seen = new Set();
  for (const photo of [product.featuredImage, ...(product.images?.edges || []).map(({ node }) => node), ...variants.map((variant) => variant.image)]) {
    if (photo?.url && !seen.has(photo.url)) {
      seen.add(photo.url);
      photos.push(photo);
    }
  }
  const activeImage = photos[imageIndex];

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && photos.length > 1) setImageIndex((index) => (index + 1) % photos.length);
      if (event.key === "ArrowLeft" && photos.length > 1) setImageIndex((index) => (index - 1 + photos.length) % photos.length);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, photos.length]);

  const chooseVariant = (variantId) => {
    setSelectedVariantId(variantId);
    const image = variants.find((variant) => variant.id === variantId)?.image;
    const index = image?.url ? photos.findIndex((photo) => photo.url === image.url) : -1;
    if (index >= 0) setImageIndex(index);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="shop-product-details-title" className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-y-auto rounded-2xl border border-orange-400/30 bg-neutral-950 shadow-2xl">
        <button type="button" onClick={onClose} aria-label="Close product details" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/80 text-2xl text-white hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400">×</button>
        <div className="grid gap-0 md:grid-cols-2">
          <div className="bg-neutral-900 p-4 sm:p-6">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-neutral-800">
              {activeImage ? (
                <img src={activeImage.url} alt={activeImage.altText || `${product.title} image ${imageIndex + 1}`} className="h-full w-full object-contain" />
              ) : (
                <span className="text-neutral-400">No product photo</span>
              )}
              {photos.length > 1 && (
                <>
                  <button type="button" onClick={() => setImageIndex((index) => (index - 1 + photos.length) % photos.length)} aria-label="Previous photo" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/75 px-3 py-2 text-xl text-white hover:bg-orange-600">‹</button>
                  <button type="button" onClick={() => setImageIndex((index) => (index + 1) % photos.length)} aria-label="Next photo" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/75 px-3 py-2 text-xl text-white hover:bg-orange-600">›</button>
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/75 px-3 py-1 text-xs text-white">{imageIndex + 1} / {photos.length}</span>
                </>
              )}
            </div>
            {photos.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Product photo thumbnails">
                {photos.map((photo, index) => (
                  <button key={photo.url} type="button" onClick={() => setImageIndex(index)} aria-label={`View photo ${index + 1}`} aria-pressed={index === imageIndex} className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${index === imageIndex ? "border-orange-400" : "border-white/10"}`}>
                    <img src={photo.url} alt={photo.altText || `Thumbnail ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col p-5 pt-14 sm:p-8 sm:pt-14 md:pt-8">
            <h2 id="shop-product-details-title" className="pr-6 text-2xl font-extrabold text-white sm:text-3xl">{product.title}</h2>
            <p className="mt-3 text-2xl font-extrabold text-orange-400">{selectedVariant?.price ? `$${Number(selectedVariant.price.amount).toFixed(2)}` : "Price unavailable"}</p>
            <p className="mt-2 text-sm text-neutral-400">{selectedVariant?.availableForSale ? "Available to order" : "Currently sold out"}</p>
            <div className="my-5 border-t border-white/15" />
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-orange-400">Product Details</h3>
            <div className="mt-3 max-h-72 overflow-y-auto whitespace-pre-line text-sm leading-7 text-neutral-200 sm:text-base">
              {product.description || "Additional product details are not available yet."}
            </div>
            <div className="mt-6 space-y-4 border-t border-white/15 pt-5">
              {hasRealVariants && (
                <label className="block text-sm text-neutral-300">Option
                  <select value={selectedVariantId} onChange={(event) => chooseVariant(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/20 bg-neutral-800 px-3 text-white">
                    {variants.map((variant) => <option key={variant.id} value={variant.id} disabled={!variant.availableForSale}>{variant.title}{!variant.availableForSale ? " - Sold Out" : ""}</option>)}
                  </select>
                </label>
              )}
              <label className="block text-sm text-neutral-300">Quantity
                <input type="number" min="1" max="100" value={quantity} onChange={(event) => setQuantity(Math.min(100, Math.max(1, Math.floor(Number(event.target.value) || 1))))} className="mt-2 h-12 w-28 rounded-xl border border-white/20 bg-neutral-800 px-3 text-white" />
              </label>
              <button type="button" disabled={!selectedVariant?.availableForSale} onClick={() => { onAddToCart(product, selectedVariant, quantity); onClose(); }} className="w-full rounded-xl bg-orange-500 px-5 py-3 text-base font-bold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50">
                {selectedVariant?.availableForSale ? "Add to Cart" : "Sold Out"}
              </button>
              <p className="text-xs text-neutral-400">Shipping and taxes are calculated through Shopify checkout.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
