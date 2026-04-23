import type { CustomNavItem } from "./NavItem.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { Section } from "@deco/deco/blocks";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface MobileMenuBanner {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}

export interface Props {
  navItems?: CustomNavItem[];
  mobileMenuCategories?: Section;
  mobileMenuBanner?: MobileMenuBanner;
}

function MenuItem({ item }: { item: CustomNavItem }) {
  const hasColumns = item.columns && item.columns.length > 0;

  return (
    <div class={`collapse ${hasColumns ? "collapse-plus" : ""}`}>
      {hasColumns && <input type="checkbox" />}

      {hasColumns
        ? (
          <div class="collapse-title font-Hanken-Grotesk text-[22px] text-[#2c2c2c] font-normal leading-none">
            {item.name}
          </div>
        )
        : (
          <a
            href={item.url}
            class="collapse-title block w-full font-Hanken-Grotesk text-[22px] text-[#2c2c2c] font-normal leading-none"
          >
            {item.name}
          </a>
        )}

      {hasColumns && (
        <div class="collapse-content">
          <div class="flex flex-col gap-6 pt-2 pb-4">
            {item.columns!.map((col, idx) => (
              <div key={idx} class="flex flex-col gap-2">
                {col.title && col.title.trim() !== "" && (
                  <span class="font-bold text-[#2d2d2c] uppercase text-[15px] font-Hanken-Grotesk">
                    {col.title}
                  </span>
                )}
                {col.links && col.links.length > 0 && (
                  <ul class="flex flex-col gap-3 ml-2">
                    {col.links.map((link, subIdx) => (
                      <li key={subIdx}>
                        <a
                          href={link.url}
                          class={`text-[#2d2d2c] text-[15px] ${
                            link.bold ? "font-bold underline" : ""
                          }`}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Menu(
  { navItems = [], mobileMenuCategories, mobileMenuBanner }: Props,
) {
  return (
    <div
      class="flex flex-col h-full overflow-y-auto"
      style={{ minWidth: "100vw" }}
    >
      {/* Fake Search Bar Trigger */}
      <div class="px-5 pt-5 pb-2">
        <label
          for="search-drawer"
          class="flex items-center justify-between bg-[#f4f4f4] rounded-md px-4 py-3 cursor-pointer"
          onClick={() => {
            const sidemenu = document.getElementById("sidemenu-drawer") as
              | HTMLInputElement
              | null;
            if (sidemenu) sidemenu.checked = false;
          }}
        >
          <span class="text-[#727272] text-[15px]">O que você procura?</span>
          <Icon id="search" size={20} class="text-[#515150]" />
        </label>
      </div>

      {/* TABS STATE E SCRIPT DE RESET */}
      <input
        type="radio"
        id="tab-categories"
        name="menu-tabs"
        class="peer/categories hidden"
        defaultChecked
      />
      <input
        type="radio"
        id="tab-account"
        name="menu-tabs"
        class="peer/account hidden"
      />

      {/* Script para voltar para a aba Categorias sempre que abrir o hamburguinho, e CSS para pintar as labels filhas */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
         #tab-categories:checked ~ .menu-tabs-header label[for="tab-categories"],
         #tab-account:checked ~ .menu-tabs-header label[for="tab-account"] {
            color: #CE9680 !important;
            border-bottom-color: #CE9680 !important;
         }
         #tab-account:checked ~ .menu-tabs-header label[for="tab-account"] .icon-inactive {
            display: none !important;
         }
         #tab-account:checked ~ .menu-tabs-header label[for="tab-account"] .icon-active {
            display: block !important;
         }
      `,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
         document.getElementById('sidemenu-drawer')?.addEventListener('change', function(e) {
            if (e.target.checked) {
              const tabCat = document.getElementById('tab-categories');
              if (tabCat) tabCat.checked = true;
            }
         });
      `,
        }}
      />

      {/* TABS HEADER */}
      <div class="menu-tabs-header flex border-b border-[#E8E8E8] mx-5 mb-2 gap-6 pb-1">
        <label
          for="tab-categories"
          class="text-[20px] outline-none font-wix pb-1 cursor-pointer border-b-2 border-transparent text-[#2d2d2c] transition-colors"
        >
          Categorias
        </label>
        <label
          for="tab-account"
          class="text-[20px] outline-none font-wix pb-1 cursor-pointer border-b-2 border-transparent text-[#4e5545] flex items-center gap-2 transition-colors"
        >
          <span class="flex items-center justify-center">
            <Icon id="user-dark" size={24} class="icon-inactive block" />
            <Icon id="user-orange" size={24} class="icon-active hidden" />
          </span>
          Conta
        </label>
      </div>

      {/* CATEGORIES CONTENT */}
      <div class="hidden peer-checked/categories:flex flex-col flex-grow">
        {mobileMenuCategories && (
          <div class="w-full">
            <mobileMenuCategories.Component {...mobileMenuCategories.props} />
          </div>
        )}

        {mobileMenuBanner && mobileMenuBanner.src && (
          <div class="w-full px-4 mb-4">
            <Image
              src={mobileMenuBanner.src}
              alt={mobileMenuBanner.alt || "Banner promocional"}
              width={mobileMenuBanner.width || 342}
              height={mobileMenuBanner.height || 120}
              class="w-full h-auto rounded-lg object-cover"
              loading="lazy"
            />
          </div>
        )}

        <ul
          id="accordion-items"
          class="px-6 flex-grow flex flex-col overflow-y-auto pt-5"
        >
          {navItems.map((item) => (
            <li>
              <MenuItem data-cy="menu-mobile-item-group" item={item} />
            </li>
          ))}
        </ul>
      </div>

      {/* ACCOUNT CONTENT */}
      <div class="hidden peer-checked/account:flex flex-col flex-grow w-full px-5">
        <ul class="flex flex-col">
          <li>
            <a
              href="/_secure/account#/profile"
              class="flex items-center justify-between py-4 text-[22px] text-[#2c2c2c] font-normal font-Hanken-Grotesk leading-none"
            >
              Minha conta
              <Icon id="chevron-right" size={24} class="text-[#2d2d2c]" />
            </a>
          </li>
          <li>
            <a
              href="/_secure/account#/orders"
              class="flex items-center justify-between py-4 text-[22px] text-[#2c2c2c] font-normal font-Hanken-Grotesk leading-none"
            >
              Consultar pedidos
              <Icon id="chevron-right" size={24} class="text-[#2d2d2c]" />
            </a>
          </li>
          <li>
            <a
              href="/_secure/account#/orders"
              class="flex items-center justify-between py-4 text-[22px] text-[#2c2c2c] font-normal font-Hanken-Grotesk leading-none"
            >
              Minhas compras
              <Icon id="chevron-right" size={24} class="text-[#2d2d2c]" />
            </a>
          </li>
          <li>
            <a
              href="/_secure/account#/wishlist"
              class="flex items-center justify-between py-4 text-[22px] text-[#2c2c2c] font-normal font-Hanken-Grotesk leading-none"
            >
              Meus queridos
              <Icon id="chevron-right" size={24} class="text-[#2d2d2c]" />
            </a>
          </li>
          <li>
            <a
              href="/vb-plus"
              class="flex items-center justify-between py-4 text-[22px] text-[#2c2c2c] font-normal font-Hanken-Grotesk leading-none"
            >
              Programa de Benefícios VB+
              <Icon id="chevron-right" size={24} class="text-[#2d2d2c]" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Menu;
