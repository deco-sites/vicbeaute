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

function NavItem(
  { item, transparent }: { item: CustomNavItem; transparent?: boolean },
) {
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
        class={`flex items-center gap-1.5 group-hover:opacity-80 transition-opacity font-medium lg:text-[15px] font-Hanken-Grotesk leading-tight tracking-wide uppercase ${
          transparent ? "text-[#FFFFFF]" : "text-[#363931]"
        } ${highlight ? "bg-[#EF781C] !text-white px-2 py-1 rounded" : ""}`}
      >
        {name}
        {hasDropdown && (
          <Icon
            id={transparent ? "arrow-down-white" : "arrowdown"}
            width={20}
            height={20}
          />
        )}
      </a>

      {hasDropdown && (
        <div class="absolute left-0 top-[100%] w-full bg-[#FFFFFF] hidden group-hover:flex justify-center border-t border-gray-100 z-50 shadow-[0_15px_30px_rgba(0,0,0,0.05)] cursor-default before:content-[''] before:absolute before:-top-5 before:left-0 before:w-full before:h-5 pb-12 pt-8">
          <div class="w-full px-20 flex gap-12 xl:gap-[30px] justify-between">
            {/* Colunas */}
            {columns &&
              columns.map((col, idx) => (
                <div
                  key={idx}
                  class="flex flex-col gap-5 xl:gap-[30px] min-w-[150px] xl:min-w-[200px]"
                >
                  {/* Título da Coluna */}
                  {col.title && col.title.trim() !== "" && (
                    <span class="block text-[15px] font-medium uppercase tracking-widest mb-1 font-Hanken-Grotesk xl:font-light xl:text-xl text-black-5 xl:tracking-normal">
                      {col.title}
                    </span>
                  )}

                  {col.links && col.links.length > 0 && (
                    <ul class="flex flex-col gap-4 xl:gap-[30px]">
                      {col.links.map((link, subIdx) => (
                        <li key={subIdx}>
                          <a
                            href={link.url}
                            class={`block xl:text-base text-[15px] text-black-10 hover:text-[#c17f67] hover:underline transition-colors w-max font-Hanken-Grotesk ${
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
                    class="flex flex-col gap-[10px] group/banner max-w-[280px]"
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
                    <div class="flex flex-col gap-[10px]">
                      <span class="text-pink-5 text-[22px] xl:text-xl font-Hanken-Grotesk font-normal leading-none">
                        {card.title}
                      </span>

                      {card.description && (
                        <span class="text-sm text-black-10 line-clamp-3 leading-snug font-Hanken-Grotesk">
                          {card.description}
                        </span>
                      )}

                      <span class="bg-green-10 text-[#ffffff] px-5 py-[6px] w-max text-sm font-Hanken-Grotesk rounded-[3px]">
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
