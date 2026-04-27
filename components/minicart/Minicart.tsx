import { AppContext } from "../../apps/site.ts";
import { MINICART_DRAWER_ID, MINICART_FORM_ID } from "../../constants.ts";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useComponent } from "../../sections/Component.tsx";
import Coupon from "./Coupon.tsx";
import FreeShippingProgressBar from "./FreeShippingProgressBar.tsx";
import CartItem, { Item } from "./Item.tsx";
import { useScript } from "@deco/deco/hooks";
export interface Minicart {
  /** Cart from the ecommerce platform */
  platformCart: Record<string, unknown>;
  /** Cart from storefront. This can be changed at your will */
  storefront: {
    items: Item[];
    total: number;
    subtotal: number;
    discounts: number;
    coupon?: string;
    locale: string;
    currency: string;
    enableCoupon?: boolean;
    freeShippingTarget: number;
    checkoutHref: string;
  };
}
const onLoad = (formID: string, empty: boolean) => {
  const form = document.getElementById(formID) as HTMLFormElement;

  // Move minicart shelf from Header if it exists
  const shelfSource = document.getElementById("minicart-shelf-source");
  const shelfTarget = document.getElementById("minicart-shelf-target");
  if (shelfSource && shelfTarget && shelfTarget.children.length === 0) {
    while (shelfSource.firstChild) {
      shelfTarget.appendChild(shelfSource.firstChild);
    }
  }

  // Toggle shelf visibility
  if (shelfTarget) {
    shelfTarget.style.display = empty ? "block" : "none";
  }

  window.STOREFRONT.CART.dispatch(form);
  // view_cart event
  if (typeof IntersectionObserver !== "undefined") {
    new IntersectionObserver((items, observer) => {
      for (const item of items) {
        if (item.isIntersecting && item.target === form) {
          window.DECO.events.dispatch({
            name: "view_cart",
            params: window.STOREFRONT.CART.getCart(),
          });
          observer?.unobserve(item.target);
        }
      }
    }).observe(form);
  }
  // Disable form interactivity while cart is being submitted
  document.body.addEventListener(
    "htmx:before-send", // deno-lint-ignore no-explicit-any
    ({ detail: { elt } }: any) => {
      if (elt !== form) {
        return;
      }
      // Disable addToCart button interactivity
      document.querySelectorAll("div[data-cart-item]").forEach((container) => {
        container?.querySelectorAll("button")
          .forEach((node) => node.disabled = true);
        container?.querySelectorAll("input")
          .forEach((node) => node.disabled = true);
      });
    },
  );
};
const sendBeginCheckoutEvent = () => {
  window.DECO.events.dispatch({
    name: "being_checkout",
    params: window.STOREFRONT.CART.getCart(),
  });
};
export const action = async (_props: unknown, req: Request, ctx: AppContext) =>
  req.method === "PATCH"
    ? ({ cart: await ctx.invoke("site/loaders/minicart.ts") }) // error fallback
    : ({ cart: await ctx.invoke("site/actions/minicart/submit.ts") });
export function ErrorFallback() {
  return (
    <div class="flex flex-col flex-grow justify-center items-center overflow-hidden w-full gap-2">
      <div class="flex flex-col gap-1 p-6 justify-center items-center">
        <span class="font-semibold">
          Error while updating cart
        </span>
        <span class="text-sm text-center">
          Click in the button below to retry or refresh the page
        </span>
      </div>

      <button
        class="btn btn-primary"
        hx-patch={useComponent(import.meta.url)}
        hx-swap="outerHTML"
        hx-target="closest div"
      >
        Retry
      </button>
    </div>
  );
}
export default function Cart(
  {
    cart: {
      platformCart,
      storefront: {
        items,
        total,
        subtotal,
        coupon,
        discounts,
        locale,
        currency,
        enableCoupon = true,
        freeShippingTarget,
        checkoutHref,
      },
    },
  }: {
    cart: Minicart;
  },
) {
  const count = items.length;
  return (
    <>
      <form
        class="contents"
        id={MINICART_FORM_ID}
        hx-sync="this:replace"
        hx-trigger="submit, change delay:300ms"
        hx-target="this"
        hx-indicator="this"
        hx-disabled-elt="this"
        hx-post={useComponent(import.meta.url)}
        hx-swap="outerHTML"
      >
        {/* Button to submit the form */}
        <button hidden autofocus />

        {/* Add to cart controllers */}
        <input name="add-to-cart" type="hidden" />
        <button hidden name="action" value="add-to-cart" />

        {/* This contains the STOREFRONT cart. */}
        <input
          type="hidden"
          name="storefront-cart"
          value={encodeURIComponent(
            JSON.stringify({ coupon, currency, value: total, items }),
          )}
        />

        {/* This contains the platformCart cart from the commerce platform. Integrations usually use this value, like GTM, pixels etc */}
        <input
          type="hidden"
          name="platform-cart"
          value={encodeURIComponent(JSON.stringify(platformCart))}
        />

        <div
          class={clx(
            "flex flex-col flex-grow w-full justify-start items-start ",
            "[.htmx-request_&]:pointer-events-none [.htmx-request_&]:opacity-60 [.htmx-request_&]:cursor-wait transition-opacity duration-300",
            count === 0 ? "overflow-y-auto" : "overflow-hidden",
          )}
        >
          {count === 0
            ? (
              <div class="flex flex-col pb-4 w-full">
                {/* Free Shipping Bar */}
                <div class="px-5 pt-[10px] pb-[30px] w-full">
                  <FreeShippingProgressBar
                    total={total}
                    locale={locale}
                    currency={currency}
                    target={freeShippingTarget}
                  />
                </div>
                <div class="flex flex-col items-center justify-center px-4">
                  <span class="font-Roboto font-medium text-vc-22 text-center text-green-10 pb-1">
                    Sua sacola está vazia.
                  </span>
                  <span class="font-Roboto text-green-10 text-center">
                    Para continuar comprando, navegue pelas categorias ou faça
                    uma busca por produtos.
                  </span>
                </div>
              </div>
            )
            : (
              <>
                <div class="pt-[10px] pb-[10px] w-full xl:px-5">
                  <FreeShippingProgressBar
                    total={total}
                    locale={locale}
                    currency={currency}
                    target={freeShippingTarget}
                  />
                </div>

                {/* Cart Items */}
                <ul
                  role="list"
                  class="flex-grow overflow-y-auto flex flex-col w-full xl:px-5 pt-3"
                >
                  {items.map((item, index) => (
                    <li data-cy="minicart-list">
                      <CartItem
                        data-cy="item-minicart"
                        item={item}
                        index={index}
                        locale={locale}
                        currency={currency}
                      />
                    </li>
                  ))}
                </ul>

                {/* Cart Footer */}
                <footer class="w-full">
                  <div class="flex flex-col gap-2 relative xl:px-4">
                    {/* Divider that sits above subtotal, mimicking border-t */}
                    <hr class="absolute top-[-24px] left-[-20px] w-[calc(100%+40px)] border-t border-[#E1E1E1]" />

                    {/* Subtotal */}
                    <div
                      data-cy="subtotal"
                      class="flex justify-between items-end pb-3 w-full"
                    >
                      <span class="font-Queens text-[28px] text-[#0A3F40] leading-none">
                        Subtotal
                      </span>
                      <div class="flex flex-col items-end">
                        <output
                          form={MINICART_FORM_ID}
                          class="font-Inter font-semibold text-[20px] text-[#0A3F40] leading-none"
                        >
                          {formatPrice(subtotal, currency, locale)}
                        </output>
                        {/* Installment Rule - Dynamic division */}
                        <span class="font-Inter text-[#363931] text-[12px] opacity-90 mt-[6px]">
                          ou {formatPrice(subtotal / 10, currency, locale)}{" "}
                          em até 10x sem juros
                        </span>
                      </div>
                    </div>

                    {/* Cupom (Condicional, será preservado) */}
                    {enableCoupon && <Coupon coupon={coupon} />}

                    {/* Divider below Subtotal */}
                    <hr class="w-full border-t border-[#E1E1E1] mb-2" />

                    {/* Botão Finalizar compra */}
                    <a
                      data-cy="minicart-go-to-checkout"
                      class="bg-[#4D5D49] hover:bg-[#3D4C3A] hover:bg-opacity-95 text-[#ffffff] text-[16px] font-medium py-[14px] rounded-[5px] w-full text-center transition-colors"
                      href={checkoutHref}
                      hx-on:click={useScript(sendBeginCheckoutEvent)}
                    >
                      Finalizar compra
                    </a>

                    {/* Botão Continuar comprando */}
                    <label
                      data-cy="minicart-start-buying"
                      for={MINICART_DRAWER_ID}
                      class="text-[#4D5D49] font-medium text-[16px] text-center mt-3 cursor-pointer"
                    >
                      Continuar comprando
                    </label>

                    {/* Texto final */}
                    <p
                      data-cy="text-minicart"
                      class="text-[11px] text-[#363931] text-center font-light mt-4 leading-relaxed mx-auto opacity-80"
                    >
                      O preço exibido no{" "}
                      <strong class="font-semibold text-black">checkout</strong>
                      {" "}
                      é o
                      <strong class="font-semibold text-black">
                        valor válido
                      </strong>{" "}
                      para a compra do<br />
                      produto.{" "}
                      <strong class="font-semibold text-black">
                        Taxas e frete
                      </strong>{" "}
                      serão calculados no{" "}
                      <strong class="font-semibold text-black">checkout</strong>
                    </p>
                  </div>
                </footer>
              </>
            )}

          {/* Minicart Shelf Target ALWAYS exists so HTMX preserves it */}
          <div
            id="minicart-shelf-target"
            hx-preserve="true"
            class="w-full pb-6"
            style={{ display: count === 0 ? "block" : "none" }}
          />

          {count === 0 && (
            <div class="w-full px-4 pb-5 flex justify-center">
              <label
                data-cy="add-products"
                for={MINICART_DRAWER_ID}
                class="btn btn-outline no-animation w-full max-w-[125px] rounded"
              >
                Voltar a loja
              </label>
            </div>
          )}
        </div>
      </form>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(onLoad, MINICART_FORM_ID, count === 0),
        }}
      />
    </>
  );
}
