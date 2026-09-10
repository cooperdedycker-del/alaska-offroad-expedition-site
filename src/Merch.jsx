import { useEffect, useState } from "react";

const SHOPIFY_DOMAIN = "26e0dd.myshopify.com";
const STOREFRONT_TOKEN = "e1bdd61da97053ba0f106a420f798e71";
const COLLECTION_ID = "gid://shopify/Collection/632194662511";

async function shopifyFetch(query, variables = {}) {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  return json.data;
}

export default function Merch() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await shopifyFetch(
          `
          query GetCollection($id: ID!) {
            collection(id: $id) {
              title
              products(first: 50) {
                edges {
                  node {
                    id
                    title
                    description
                    handle
                    availableForSale
                    featuredImage {
                      url
                      altText
                    }
                    images(first: 5) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                    variants(first: 50) {
                      edges {
                        node {
                          id
                          title
                          availableForSale
                          price {
                            amount
                            currencyCode
                          }
                          selectedOptions {
                            name
                            value
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          `,
          { id: COLLECTION_ID }
        );

        const loadedProducts =
          data.collection?.products?.edges?.map((edge) => edge.node) || [];

        setProducts(loadedProducts);
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-neutral-900/60 p-6">
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

  const image =
    product.featuredImage?.url ||
    product.images?.edges?.[0]?.node?.url ||
    "";

  const price = selectedVariant?.price?.amount
    ? Number(selectedVariant.price.amount).toFixed(2)
    : "0.00";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50">
      <div className="aspect-square bg-neutral-800">
        {image ? (
          <img
            src={image}
            alt={product.featuredImage?.altText || product.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full place-items-center text-neutral-500">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="min-h-[44px] font-bold text-white">{product.title}</h3>

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
          className="mt-5 rounded-xl bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {selectedVariant?.availableForSale ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}