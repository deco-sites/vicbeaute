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
import { Section } from "@deco/deco/blocks";

export interface Logo {
  desktop: { src: ImageWidget; alt: string; width?: number; height?: number };
  mobile: { src: ImageWidget; alt: string; width?: number; height?: number };
}

export interface AlertItem {
  text: string;
  imageSrc?: {
    src: ImageWidget;
    alt?: string;
  };
}

export interface SectionProps {
  alerts?: AlertItem[];

  /**
   * @title Autoplay do alerta
   * @description Tempo em segundos entre os alertas (0 desativa)
   */
  alertInterval?: number;

  navItems?: SiteNavigationElement[] | null;
  searchbar: SearchbarProps;
  logo: Logo;
  /** @title Vitrine do Drawer */
  /** @description Esta vitrine aparecerá no rodapé da busca e do minicart */
  drawerShelf?: Section;
  loading?: "eager" | "lazy";
}


type Props = Omit<SectionProps, "alert">;

const SEARCH_DRAWER_ID = "search-drawer";

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
                <Icon id="user" size= {24} />
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

const Mobile = ({ logo, searchbar, navItems, loading, drawerShelf }: Props) => {
  const open = useSignal(false);
  const isLoggedIn = useSignal(false);

  useEffect(() => {
    isLoggedIn.value = document.cookie.includes("VtexIdclientAutCookie");
  }, []);

  return (
    <>
      {/* 1. Drawer do Menu Lateral */}
      <Drawer
        id={SIDEMENU_DRAWER_ID}
        aside={
          <Drawer.Aside title="" logo={logo} drawer={SIDEMENU_DRAWER_ID}>
            {loading === "lazy" ? (
              <div id={SIDEMENU_CONTAINER_ID} class="h-full flex items-center justify-center w-screen">
                <span class="loading loading-spinner" />
              </div>
            ) : <Menu navItems={navItems ?? []} />}
          </Drawer.Aside>
        }
      />

      {/* 2. NOVO: Drawer da Busca (Full Screen) */}
      <Drawer
        id="search-drawer"
        aside={
          <Drawer.Aside 
            title="Buscar" 
            drawer="search-drawer"
            footer={drawerShelf} // Passa a vitrine aqui!
          >
            <Searchbar {...searchbar} />
          </Drawer.Aside>
        }
      />

      {/* 3. Header Visível */}
      <div
        class="grid place-items-center w-screen px-5 gap-3 bg-white"
        style={{
          height: NAVBAR_HEIGHT_MOBILE,
          gridTemplateColumns: "min-content min-content auto min-content min-content",
        }}
      >
        {/* Ícone Menu */}
        <label for={SIDEMENU_DRAWER_ID} class="btn btn-square btn-sm btn-ghost" aria-label="open menu">
          <Icon id="menu_mobile" />
        </label>

        {/* Bonequinho de Login (Restaurado) */}
        <div class="relative">
          {isLoggedIn.value ? (
            <>
              <button
                data-cy="user-mobile"
                aria-label="login"
                onClick={() => open.value = !open.value}
                class="p-2"
              >
                <Icon id="user" size={24} />
              </button>
              {open.value && <AccountDropdown />}
            </>
          ) : (
            <a href="/login" aria-label="login">
              <Icon id="user" size={24} />
            </a>
          )}
        </div>

        {/* Logo Central (Restaurado) */}
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

        {/* Ícone de Busca (Abre o Drawer) */}
        <div data-cy="searchbar-mobile">
          <label
            for="search-drawer"
            class="btn btn-square btn-sm btn-ghost h-8"
            aria-label="search icon button"
          >
            <Icon id="search" size={24} />
          </label>
        </div>

        {/* Sacola/Bag */}
        <Bag data-cy="minicart-button-mobile" />
      </div>
    </>
  );
};

function Header({ 
  alerts = [], 
  alertInterval = 5, // Valor default aqui
  logo, 
  ...props 
}: Props) {
  return (
    <header class="border-none">
      <div class="bg-transparent fixed w-full z-40 xl:left-0 drop-shadow-lg">
        {alerts.length > 0 && (
          <Alert 
            alerts={alerts} 
            interval={alertInterval > 0 ? alertInterval : 5} 
          />
        )}

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