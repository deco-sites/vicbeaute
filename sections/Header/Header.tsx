import type { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import Alert from "../../components/header/Alert.tsx";
import Bag from "../../components/header/Bag.tsx";
import Menu from "../../components/header/Menu.tsx";
import NavItem from "../../components/header/NavItem.tsx";
import Searchbar, {
  type SearchbarProps,
} from "../../components/search/Searchbar/Form.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Drawer from "../../components/ui/Drawer.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_MOBILE,
  NAVBAR_HEIGHT_MOBILE,
  SIDEMENU_CONTAINER_ID,
  SIDEMENU_DRAWER_ID,
} from "../../constants.ts";
import { useDevice } from "@deco/deco/hooks";
import { type LoadingFallbackProps } from "@deco/deco";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import ScrollHeader from "../../islands/ScrollHeader.tsx";
import { Section } from "@deco/deco/blocks";

export interface Logo {
  /** @title Logo Desktop (Versão Transparente) */
  desktop: { src: ImageWidget; alt: string; width?: number; height?: number };
  /** @title Logo Desktop (Versão Branca) */
  desktopDark?: { src: ImageWidget; alt: string; width?: number; height?: number };
  /** @title Logo Mobile (Versão Transparente) */
  mobile: { src: ImageWidget; alt: string; width?: number; height?: number };
  /** @title Logo Mobile (Versão Branca) */
  mobileDark?: { src: ImageWidget; alt: string; width?: number; height?: number };
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
  /** @description Esta vitrine aparecerá no rodapé da busca */
  drawerShelf?: Section;
  /** @title Categorias do Minicart (Vazio) */
  /** @description Slider de categorias que aparece no minicart quando vazio */
  minicartCategories?: Section;
  /** @title Vitrine do Minicart (Vazio) */
  /** @description Esta vitrine aparecerá no minicart caso esteja vazio */
  minicartShelf?: Section;
  /** @title Categorias do Menu Mobile */
  /** @description Slider de categorias que aparece no menu hamburguinho */
  mobileMenuCategories?: Section;
  /** @title Banner do Menu Mobile */
  /** @description Imagem que aparece no menu hamburguinho, abaixo das categorias */
  mobileMenuBanner?: {
    src: ImageWidget;
    alt: string;
    width?: number;
    height?: number;
  };
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
            fetch("/logout", { method: "POST" }).then(() =>
              window.location.href = "/"
            );
          }}
        >
          Sair
        </button>
      </li>
    </ul>
  </div>
);

const Desktop = ({ navItems, logo, searchbar, loading, transparent }: Props & { transparent?: boolean }) => {
  const open = useSignal(false);
  const isLoggedIn = useSignal(false);

  useEffect(() => {
    isLoggedIn.value = document.cookie.includes("VtexIdclientAutCookie");
  }, []);

  return (
    <div class="container lg:max-w-[1440px] lg:h-vc-20">
      <div class="flex items-center justify-between h-vc-19">
        <div
          data-cy="logo-desktop"
          class="flex-shrink-0 max-w-[223px] w-full mx-auto"
        >
          <a href="/" aria-label="Store logo">
            <Image
              src={transparent ? logo.desktop.src : (logo.desktopDark?.src || logo.desktop.src)}
              alt={transparent ? logo.desktop.alt : (logo.desktopDark?.alt || logo.desktop.alt)}
              width={transparent ? (logo.desktop.width || 100) : (logo.desktopDark?.width || logo.desktop.width || 100)}
              height={transparent ? (logo.desktop.height || 23) : (logo.desktopDark?.height || logo.desktop.height || 23)}
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
          {isLoggedIn.value
            ? (
              <div class="relative">
                <button
                  data-cy="login-button-desktop"
                  aria-label="login"
                  onClick={() => open.value = !open.value}
                  class="p-2"
                >
                  <Icon id="user" size={24} />
                </button>
                {open.value && <AccountDropdown />}
              </div>
            )
            : (
              <a href="/login" aria-label="login">
                <Icon id="user" width={17} height={20} />
              </a>
            )}
          <Bag data-cy="minicart-button-desktop" transparent={transparent} />
        </div>
      </div>
    </div>
  );
};

const Mobile = (
  { logo, searchbar, navItems, loading, drawerShelf, mobileMenuCategories, mobileMenuBanner, transparent }: Props & { transparent?: boolean },
) => {
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
            {loading === "lazy"
              ? (
                <div
                  id={SIDEMENU_CONTAINER_ID}
                  class="h-full flex items-center justify-center w-screen"
                >
                  <span class="loading loading-spinner" />
                </div>
              )
              : <Menu navItems={navItems ?? []} mobileMenuCategories={mobileMenuCategories} mobileMenuBanner={mobileMenuBanner} />}
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
        class={`grid place-items-center w-screen px-5 gap-3 header-mobile-visible ${transparent ? "bg-transparent text-white" : "bg-white text-black"}`}
        style={{
          height: NAVBAR_HEIGHT_MOBILE,
          gridTemplateColumns:
            "min-content min-content auto min-content min-content",
        }}
      >
        {/* Ícone Menu */}
        <label
          for={SIDEMENU_DRAWER_ID}
          class="btn btn-square btn-sm btn-ghost"
          aria-label="open menu"
        >
          <Icon id={transparent ? "menu_mobile" : "menu-mobile-dark"} class="menu-icon-hamburger" />
          <Icon id="close" size={20} class="menu-icon-close" />
        </label>

        {/* Bonequinho de Login (Restaurado) */}
        <div class="relative transition-opacity" data-cy="account-mobile">
          {isLoggedIn.value
            ? (
              <>
                <button
                  data-cy="user-mobile"
                  aria-label="login"
                  onClick={() => open.value = !open.value}
                  class="p-2"
                >
                  <Icon id={transparent ? "user" : "user-dark"} size={24} />
                </button>
                {open.value && <AccountDropdown />}
              </>
            )
            : (
              <a href="/login" aria-label="login">
                <Icon id={transparent ? "user" : "user-dark"} size={24} />
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
              src={transparent ? logo.mobile.src : (logo.mobileDark?.src || logo.mobile.src)}
              alt={transparent ? logo.mobile.alt : (logo.mobileDark?.alt || logo.mobile.alt)}
              width={transparent ? (logo.mobile.width || 100) : (logo.mobileDark?.width || logo.mobile.width || 100)}
              height={transparent ? (logo.mobile.height || 13) : (logo.mobileDark?.height || logo.mobile.height || 13)}
            />
          </a>
        )}

        {/* Ícone de Busca (Abre o Drawer) */}
        <div data-cy="searchbar-mobile" class="transition-opacity">
          <style
            dangerouslySetInnerHTML={{
              __html: `
               .header-mobile-visible { position: relative; z-index: 50; }
               body:has(#search-drawer:checked) .header-mobile-visible,
               body:has(#minicart-drawer:checked) .header-mobile-visible { z-index: 30 !important; }
               
               body:has(#${SIDEMENU_DRAWER_ID}:checked) [data-cy="searchbar-mobile"],
               body:has(#${SIDEMENU_DRAWER_ID}:checked) [data-cy="account-mobile"] { opacity: 0; pointer-events: none; }
               body:has(#${SIDEMENU_DRAWER_ID}:checked) .menu-icon-hamburger { display: none !important; }
               body:not(:has(#${SIDEMENU_DRAWER_ID}:checked)) .menu-icon-close { display: none !important; }
               
               #${SIDEMENU_DRAWER_ID} ~ .drawer-side { top: 93px !important; height: calc(100% - ${NAVBAR_HEIGHT_MOBILE}) !important; }
               #${SIDEMENU_DRAWER_ID} ~ .drawer-side .drawer-fake-header { display: none !important; }
             `,
            }}
          />
          <label
            for="search-drawer"
            class="btn btn-square btn-sm btn-ghost h-8"
            aria-label="search icon button"
          >
            <Icon id={transparent ? "search" : "lupa-dark"} size={24} />
          </label>
        </div>

        {/* Sacola/Bag */}
        <Bag data-cy="minicart-button-mobile" transparent={transparent} />
      </div>
    </>
  );
};

function Header({
  alerts = [],
  alertInterval = 5,
  logo,
  minicartCategories,
  minicartShelf,
  ...props
}: Props) {
  const device = useDevice();

  return (
    <header class="relative w-full">
      {/* 1. HEADER ESTÁTICO (O que sobe com a página) */}
      <div class="w-full bg-transparent absolute top-0 lg:static z-50">
        {alerts.length > 0 && (
          <Alert
            alerts={alerts}
            interval={alertInterval > 0 ? alertInterval : 5}
          />
        )}
        <div class="hidden xl:block bg-transparent">
          <Desktop logo={logo} {...props} transparent={true} />
        </div>
        <div class="xl:hidden bg-transparent">
          <Mobile logo={logo} {...props} transparent={true} />
        </div>
      </div>

      {/* 2. HEADER FLUTUANTE (O que "nasce" fixo após o scroll) */}
      {/* Note as classes que o ScrollHeader.tsx procura */}
      <div class="floating-desktop-header-container floating-mobile-header-container fixed top-0 left-0 w-full z-50 shadow-lg opacity-0 -z-10 transition-opacity duration-300 pointer-events-none [&.opacity-100]:pointer-events-auto">
        <div class="hidden xl:block">
          <Desktop logo={logo} {...props} />
        </div>
        <div class="xl:hidden">
          <Mobile logo={logo} {...props} />
        </div>
      </div>

      {/* 3. O ISLAND QUE CONTROLA A LÓGICA */}
      <ScrollHeader />

      {/* 4. Portal DOM para o Minicart Shelf */}
      <div id="minicart-shelf-source" class="hidden">
        {minicartCategories && (
          <minicartCategories.Component {...minicartCategories.props} />
        )}
        {minicartShelf && <minicartShelf.Component {...minicartShelf.props} />}
      </div>
    </header>
  );
}

export const LoadingFallback = (props: LoadingFallbackProps<Props>) => (
  <Header {...(props as any)} loading="lazy" />
);

export default Header;
