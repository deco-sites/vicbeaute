import type { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import Alert from "../../components/header/Alert.tsx";
import Bag from "../../components/header/Bag.tsx";
import Menu from "../../components/header/Menu.tsx";
import NavItem from "../../components/header/NavItem.tsx";
import Searchbar, { type SearchbarProps } from "../../components/search/Searchbar/Form.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Drawer from "../../components/ui/Drawer.tsx";
import { HEADER_HEIGHT_DESKTOP, HEADER_HEIGHT_MOBILE, NAVBAR_HEIGHT_MOBILE, SIDEMENU_CONTAINER_ID, SIDEMENU_DRAWER_ID } from "../../constants.ts";
import { useDevice } from "@deco/deco/hooks";
import { type LoadingFallbackProps } from "@deco/deco";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export interface Logo {
  desktop: { src: ImageWidget; alt: string; width?: number; height?: number };
  mobile: { src: ImageWidget; alt: string; width?: number; height?: number };
}

export interface SectionProps {
  alerts?: HTMLWidget[];
  navItems?: SiteNavigationElement[] | null;
  searchbar: SearchbarProps;
  logo: Logo;
  loading?: "eager" | "lazy";
}

type Props = Omit<SectionProps, "alert">;

const AccountDropdown = () => (
  <div class="absolute top-full right-0 mt-2 bg-white border shadow-lg rounded-md w-48 z-50">
    <ul class="flex flex-col">
      <li>
        <a href="/account" class="block px-4 py-2 hover:bg-gray-100">
          Minha Conta
        </a>
      </li>
      <li>
        <a href="/order" class="block px-4 py-2 hover:bg-gray-100">
          Meus Pedidos
        </a>
      </li>
      <li>
        <button
          class="block w-full text-left px-4 py-2 hover:bg-gray-100"
          onClick={() => {
            fetch("/logout", { method: "POST" }).then(() => window.location.href = "/");
          }}
        >
          Sair
        </button>
      </li>
    </ul>
  </div>
);

const Desktop = ({ navItems, logo, searchbar, loading }: Props) => {
  const open = useSignal(false);
  const isLoggedIn = useSignal(false);

  useEffect(() => {
    isLoggedIn.value = document.cookie.includes("VtexIdclientAutCookie");
  }, []);

  return (
    <div class="container lg:max-w-[1440px] lg:h-vc-20">
      <div class="flex items-center justify-between h-vc-19">
        <div data-cy="logo-desktop" class="flex-shrink-0 max-w-[223px] w-full mx-auto">
          <a href="/" aria-label="Store logo">
            <Image
              src={logo.desktop.src}
              alt={logo.desktop.alt}
              width={logo.desktop.width || 100}
              height={logo.desktop.height || 23}
            />
          </a>
        </div>

        <nav class="flex justify-center max-w-[697px] w-full mx-auto">
          <ul class="flex gap-6">
            {navItems?.slice(0, 10).map((item) => <NavItem item={item} />)}
          </ul>
        </nav>
        <Searchbar data-cy="searchbar-desktop" {...searchbar} />

        <div class="flex items-center gap-8 relative max-w-[102px] w-full mx-auto">
          {isLoggedIn.value ? (
            <div class="relative">
              <button
                data-cy="login-button-desktop"
                aria-label="login"
                onClick={() => open.value = !open.value}
                class="p-2"
              >
                <Icon id="user" width={17} height={20} />
              </button>
              {open.value && <AccountDropdown />}
            </div>
          ) : (
            <a href="/login" aria-label="login">
              <Icon id="user" width={17} height={20} />
            </a>
          )}
          <Bag data-cy="minicart-button-desktop" />
        </div>
      </div>
    </div>
  );
};

const Mobile = ({ logo, searchbar, navItems, loading }: Props) => {
  const open = useSignal(false);
  const isLoggedIn = useSignal(false);

  useEffect(() => {
    isLoggedIn.value = document.cookie.includes("VtexIdclientAutCookie");
  }, []);

  return (
    <>
      <Drawer
        data-cy="drawer-menu"
        id={SIDEMENU_DRAWER_ID}
        aside={
          <Drawer.Aside title="" logo={logo} drawer={SIDEMENU_DRAWER_ID}>
            {loading === "lazy" ? (
              <div
                id={SIDEMENU_CONTAINER_ID}
                class="h-full flex items-center justify-center"
                style={{ minWidth: "100vw" }}
              >
                <span class="loading loading-spinner" />
              </div>
            ) : <Menu navItems={navItems ?? []} />}
          </Drawer.Aside>
        }
      />

      <div
        class="grid place-items-center w-screen px-5 gap-4"
        style={{
          height: NAVBAR_HEIGHT_MOBILE,
          gridTemplateColumns: "min-content min-content auto min-content min-content",
        }}
      >
        <label
          for={SIDEMENU_DRAWER_ID}
          class="btn btn-square btn-sm btn-ghost"
          aria-label="open menu"
        >
          <Icon id="menu_mobile" />
        </label>

        <div class="relative">
          {isLoggedIn.value ? (
            <>
              <button
                data-cy="user-mobile"
                aria-label="login"
                onClick={() => open.value = !open.value}
                class="p-2"
              >
                <Icon id="user" width={17} height={20} />
              </button>
              {open.value && <AccountDropdown />}
            </>
          ) : (
            <a href="/login" aria-label="login">
              <Icon id="user" width={17} height={20} />
            </a>
          )}
        </div>

        {logo && (
          <a
            data-cy="logo-mobile"
            href="/"
            class="flex items-center justify-center"
            style={{ minHeight: NAVBAR_HEIGHT_MOBILE }}
            aria-label="Store logo"
          >
            <Image
              src={logo.mobile.src}
              alt={logo.mobile.alt}
              width={logo.mobile.width || 100}
              height={logo.mobile.height || 13}
            />
          </a>
        )}

        <div data-cy="searchbar-mobile">
          <input type="checkbox" id="search-toggle" class="hidden peer" />
          <label
            for="search-toggle"
            class="btn btn-square btn-sm btn-ghost"
            aria-label="search icon button"
          >
            <Icon id="search" />
          </label>
          <div class="absolute top-0 left-0 w-screen bg-base-100 border-t border-gray-300 shadow-md max-h-0 overflow-hidden transition-all duration-300 peer-checked:max-h-[565px] peer-checked:min-h-[70px] peer-checked:overflow-auto z-10 flex items-center">
            {loading === "lazy" ? (
              <div class="flex justify-center items-center p-4">
                <span class="loading loading-spinner" />
              </div>
            ) : <Searchbar {...searchbar} />}
          </div>
        </div>

        <Bag data-cy="minicart-button-mobile" />
      </div>
    </>
  );
};

function Header({ alerts = [], logo, ...props }: Props) {
  return (
    <header class="border-none">
      <div class="bg-base-100 fixed w-full z-40 xl:left-0 drop-shadow-lg">
        {alerts.length > 0 && <Alert alerts={alerts} />}
        <div class="hidden xl:block">
          <Desktop logo={logo} {...props} />
        </div>
        <div class="xl:hidden">
          <Mobile logo={logo} {...props} />
        </div>
      </div>
    </header>
  );
}

export const LoadingFallback = (props: LoadingFallbackProps<Props>) => (
  <Header {...(props as any)} loading="lazy" />
);

export default Header;