import { type ComponentChildren } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "./Icon.tsx";
import { useScript } from "@deco/deco/hooks";

export interface Props {
  open?: boolean;
  class?: string;
  children?: ComponentChildren;
  aside: ComponentChildren;
  id?: string;
}
const script = (id: string) => {
  const handler = (e: KeyboardEvent) => {
    if (e.key !== "Escape" && e.keyCode !== 27) {
      return;
    }
    const input = document.getElementById(id) as HTMLInputElement | null;
    if (!input) 
      return;
    input.checked = false;
  };
  addEventListener("keydown", handler);

  const itemsNumber = document.querySelector(".items-number");
  if (!itemsNumber) return;

  const updateCartCount = () => {
    const cart = window.STOREFRONT.CART.getCart();
    const count = cart?.items.length ?? 0;
    itemsNumber.innerHTML = `(${count} Itens)`;
  };

  updateCartCount();

  window.STOREFRONT.CART.subscribe(() => {
    updateCartCount();
  });
};
function Drawer(
  { children, aside, open, class: _class = "", id = useId() }: Props,
) {

  return (
    <>
      <div class={clx("drawer", _class)}>
        <input
          id={id}
          name={id}
          checked={open}
          type="checkbox"
          class="drawer-toggle"
          aria-label={open ? "open drawer" : "closed drawer"}
        />

        <div class="drawer-content">
          {children}
        </div>

        <aside
          data-aside
          class={clx(
            "drawer-side h-[100vh] z-40 overflow-hidden",
            "[[data-aside]&_section]:contents",
          )}
        >
          <label for={id} class="drawer-overlay" />
          {aside}
        </aside>
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(script, id) }}
      />
    </>
  );
}
function Aside({
  logo,
  title,
  drawer,
  children,
}: {
  title: string;
  drawer: string;
  children: ComponentChildren;
  logo?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
}) {

  return (
    <div
      data-aside
      id={drawer === "minicart-drawer" ? "minicartdrawer" : undefined}
      class="bg-base-100 grid grid-rows-[auto_1fr] h-[100vh] w-full"
      style={{ maxWidth: "100vw" }}
    >
      <div class="flex justify-between items-center h-14 ml-2 w-full">
        <span class="order-3">
          <span
            class="font-bold text-2xl"
            id={drawer === "minicart-drawer" ? "minicarttitle" : undefined}
          >
            {drawer === "minicart-drawer"
              ? (
                <div class="flex items-center gap-2">
                  <span class="font-bold text-2xl">
                    Minha Sacola
                  </span>
                  <span class="items-number font-normal text-sm">
                    {/* inserted by script */}
                  </span>
                </div>
              )
              : title}
          </span>
        </span>
        {logo && (
          <a
            href="/"
            aria-label="Store logo"
            class="mx-auto max-w-[134px] order-2"
          >
            <img
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 100}
              height={logo.height || 23}
            />
          </a>
        )}
        <label
          for={drawer}
          aria-label="X"
          id={drawer === "minicart-drawer" ? "closeminicart" : undefined}
          class="btn btn-ghost order-1 absolute left-7 p-0 max-h-5 hover:bg-transparent top-1"
        >
          <Icon
            id={drawer === "minicart-drawer" ? "closeminicartbutton" : "close"}
            width={drawer === "minicart-drawer" ? 13 : 20}
            height={drawer === "minicart-drawer" ? 13 : 20}
          />
        </label>
      </div>
      {children}
    </div>
  );
}
Drawer.Aside = Aside;
export default Drawer;
