import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "../ui/Icon.tsx";

export interface NavItemLink {
  label: string;
  url: string;
  /** @title Destaque (Negrito e sublinhado) */
  bold?: boolean;
}

export interface NavItemColumn {
  /** @title Título da Coluna (Opcional - ex: PRODUTOS) */
  title?: string;
  /** @title Links da Coluna */
  links?: NavItemLink[];
}

export interface NavItemCard {
  /** @title Imagem do Card */
  image: ImageWidget;
  /** @title Título do Card */
  title: string;
  /** @title Descrição (Opcional) */
  description?: string;
  /** @title Texto do Botão (Ex: Explorar) */
  buttonText?: string;
  /** @title Link do Botão/Conteúdo */
  url: string;
}

export interface CustomNavItem {
  /** @title Texto do Menu (Ex: BOCA) */
  name: string;
  /** @title Link do Menu raiz */
  url: string;
  /** @title Destaque (Fundo Laranja) */
  highlight?: boolean;
  /** @title Colunas do Submenu */
  columns?: NavItemColumn[];
  /** @title Cards Laterais (Aparecem à direita no Desktop) */
  cards?: NavItemCard[];
}

function NavItem({ item }: { item: CustomNavItem }) {
  const { url, name, columns, cards, highlight } = item;

  const hasColumns = columns && columns.length > 0;
  const hasCards = cards && cards.length > 0;
  const hasDropdown = hasColumns || hasCards;

  return (
    <li
      class="group flex items-center lg:pr-0 pr-5 hover:bg-transparent"
      data-cy={`menu-${name}`}
    >
      <a
        href={url}
        class={`flex items-center gap-1.5 group-hover:opacity-80 transition-opacity font-medium lg:text-[15px] font-HankenGrotesk leading-tight text-[#FFFFFF] tracking-wide uppercase ${
          highlight ? "bg-[#EF781C] text-white px-2 py-1 rounded" : ""
        }`}
      >
        {name}
        {hasDropdown && <Icon id="arrow-down-white" width={20} height={20} />}
      </a>

      {hasDropdown && (
        <div class="absolute left-0 top-[100%] w-full bg-[#FFFFFF] hidden group-hover:flex justify-center border-t border-gray-100 z-50 shadow-[0_15px_30px_rgba(0,0,0,0.05)] cursor-default before:content-[''] before:absolute before:-top-5 before:left-0 before:w-full before:h-5 pb-12 pt-8">
          <div class="w-full max-w-[1440px] px-20 flex gap-12 xl:gap-20 justify-start">
            {/* Colunas */}
            {columns &&
              columns.map((col, idx) => (
                <div key={idx} class="flex flex-col gap-5 min-w-[150px]">
                  {/* Título da Coluna */}
                  {col.title && col.title.trim() !== "" && (
                    <span class="block text-[15px] font-medium uppercase tracking-widest text-[#2D2D2C] mb-1 font-HankenGrotesk">
                      {col.title}
                    </span>
                  )}

                  {col.links && col.links.length > 0 && (
                    <ul class="flex flex-col gap-4">
                      {col.links.map((link, subIdx) => (
                        <li key={subIdx}>
                          <a
                            href={link.url}
                            class={`block text-[15px] text-[#2D2D2C] hover:text-[#c17f67] hover:underline transition-colors w-max font-HankenGrotesk ${
                              link.bold ? "font-semibold underline" : ""
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

            {/* Cards */}
            {cards &&
              cards.map((card, idx) => (
                <div key={idx} class="flex flex-col gap-5 min-w-[150px]">
                  <a
                    href={card.url}
                    class="flex flex-col gap-3 group/banner max-w-[280px]"
                  >
                    {card.image && (
                      <Image
                        src={card.image}
                        alt={card.title}
                        width={280}
                        height={200}
                        class="w-full h-[200px] object-cover rounded shadow-sm"
                      />
                    )}
                    <div class="flex flex-col gap-1 mt-2">
                      <span class="text-[#c17f67] text-[22px] font-Queens font-normal leading-none mb-1">
                        {card.title}
                      </span>

                      {card.description && (
                        <span class="text-[14px] text-[#2D2D2C] line-clamp-3 leading-snug font-HankenGrotesk opacity-80 mb-2">
                          {card.description}
                        </span>
                      )}

                      <span class="bg-[#5c6b56] text-white px-6 py-2 w-max text-sm hover:bg-[#434e3e] transition-colors font-HankenGrotesk rounded-[2px]">
                        {card.buttonText || "Explorar"}
                      </span>
                    </div>
                  </a>
                </div>
              ))}
          </div>
        </div>
      )}
    </li>
  );
}

export default NavItem;
