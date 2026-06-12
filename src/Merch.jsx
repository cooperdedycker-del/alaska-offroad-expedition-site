import { useEffect, useRef } from "react";

export default function Merch() {
  const shopifyRef = useRef(null);

  useEffect(() => {
    if (!shopifyRef.current) return;

    if (shopifyRef.current.dataset.loaded === "true") return;
shopifyRef.current.dataset.loaded = "true";
shopifyRef.current.innerHTML = "";
    const scriptURL =
      "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

    function ShopifyBuyInit() {
      const client = window.ShopifyBuy.buildClient({
        domain: "26e0dd.myshopify.com",
        storefrontAccessToken: "e1bdd61da97053ba0f106a420f798e71",
      });

      window.ShopifyBuy.UI.onReady(client).then((ui) => {
        ui.createComponent("collection", {
          id: "632194662511",
          node: shopifyRef.current,
          moneyFormat: "%24%7B%7Bamount%7D%7D",
          options: {
            product: {
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "calc(25% - 20px)",
                    "margin-left": "20px",
                    "margin-bottom": "50px",
                    width: "calc(25% - 20px)",
                  },
                  img: {
                    height: "calc(100% - 15px)",
                    position: "absolute",
                    left: "0",
                    right: "0",
                    top: "0",
                  },
                  imgWrapper: {
                    "padding-top": "calc(75% + 15px)",
                    position: "relative",
                    height: "0",
                  },
                },
                button: {
                  "background-color": "#f97316",
                  "border-radius": "12px",
                  "font-weight": "700",
                  ":hover": {
                    "background-color": "#ea580c",
                  },
                  ":focus": {
                    "background-color": "#ea580c",
                  },
                },
              },
              text: {
                button: "Add to cart",
              },
            },
            productSet: {
              styles: {
                products: {
                  "@media (min-width: 601px)": {
                    "margin-left": "-20px",
                  },
                },
              },
            },
            modalProduct: {
              contents: {
                img: false,
                imgWithCarousel: true,
                button: false,
                buttonWithQuantity: true,
              },
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "100%",
                    "margin-left": "0px",
                    "margin-bottom": "0px",
                  },
                },
                button: {
                  "background-color": "#f97316",
                  "border-radius": "12px",
                  "font-weight": "700",
                  ":hover": {
                    "background-color": "#ea580c",
                  },
                  ":focus": {
                    "background-color": "#ea580c",
                  },
                },
              },
              text: {
                button: "Add to cart",
              },
            },
            cart: {
              styles: {
                button: {
                  "background-color": "#f97316",
                  "border-radius": "12px",
                  "font-weight": "700",
                  ":hover": {
                    "background-color": "#ea580c",
                  },
                  ":focus": {
                    "background-color": "#ea580c",
                  },
                },
              },
              text: {
                total: "Subtotal",
                button: "Checkout",
              },
            },
            toggle: {
              styles: {
                toggle: {
                  "background-color": "#f97316",
                  ":hover": {
                    "background-color": "#ea580c",
                  },
                  ":focus": {
                    "background-color": "#ea580c",
                  },
                },
              },
            },
          },
        });
      });
    }

    if (window.ShopifyBuy) {
      if (window.ShopifyBuy.UI) {
        ShopifyBuyInit();
      } else {
        const script = document.createElement("script");
        script.async = true;
        script.src = scriptURL;
        script.onload = ShopifyBuyInit;
        document.head.appendChild(script);
      }
    } else {
      const script = document.createElement("script");
      script.async = true;
      script.src = scriptURL;
      script.onload = ShopifyBuyInit;
      document.head.appendChild(script);
    }
  }, []);

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

      <div className="rounded-3xl border border-white/10 bg-neutral-900/40 p-6">
        <div ref={shopifyRef} />
      </div>
    </section>
  );
}