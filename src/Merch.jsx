import { useEffect, useState } from "react";

const CART_STORAGE_KEY = "aoe-merch-cart-v1";

function loadSavedCart() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored.filter(item => item && item.variantId && Number(item.quantity) > 0) : [];
  } catch {
    return [];
  }
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
                  featuredImage { url altText }
                  images(first: 5) { edges { node { url altText } } }
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
        setError("Could not load merch right now.");
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
    <section id="merch" className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Alaska Offroad Expedition Merch
        </h2>

        <p className="mt-3 text-neutral-300 max-w-3xl mx-auto">
  Grab official Alaska Offroad Expedition apparel and gear before your
  next adventure.
</p>


      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-neutral-900/40 p-8 text-center text-neutral-300">
          Loading merch...
        </div>
      ) : (
        <>
         <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>

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
                          {item.variantTitle} × {item.quantity}
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
    </section>
  );
}

function ProductCard({ product, onAddToCart }) {
  const variants = product.variants.edges.map((edge) => edge.node);
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
      <div className="aspect-[4/3] overflow-hidden bg-neutral-800">
        {image ? (
          <img
            src={image}
            alt={selectedImage?.altText || `${product.title} — ${selectedVariant?.title || "Product photo"}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full place-items-center text-neutral-500">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold leading-tight text-white sm:text-base">
  {product.title}
</h3>
        <div className="mt-2 text-lg font-extrabold text-orange-400">
          ${price}
        </div>

        <div className="mt-4 space-y-3">
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