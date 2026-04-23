import type { Product } from "apps/commerce/types.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
import { useId } from "../../sdk/useId.ts";
import ShopTheLookModal from "../../islands/ShopTheLookModal.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { useScript } from "@deco/deco/hooks";

export interface Look {
  /** @description Imagem Desktop (Vertical: 308x638 | Quadrado: 312x312) */
  imageDesk: ImageWidget;
  /** @description Imagem Mobile (Vertical: 170x348 | Quadrado: 170x170) */
  imageMobile: ImageWidget;
  imageAlt?: string;
  /** @description Imagem exibida dentro do modal/drawer ao abrir o look (Desktop). Se não preenchida, usa a imagem desktop do card. */
  modalImage?: ImageWidget;
  /** @description Imagem exibida dentro do modal/drawer no Mobile (335x280). */
  modalImageMobile?: ImageWidget;
  /** @description Define se ele estica verticalmente por 2 blocos ou se é o quadrado base */
  cardType: "Vertical" | "Quadrado";
  /** @description Título base que aparece no Modal */
  title: string;
  /** @description Subtitulo do autor do look (Ex: @vicceridono) */
  subtitle: string;
  /** @description Coleção exata de produtos desta foto */
  products: Product[] | null;
}

export interface Props {
  /** @description Título da seção (acima do titulo coral) */
  title?: string;
  /** @description Titulo grande de destaque da Seção */
  highlightTitle?: string;
  /** @description Paragrafo descritivo */
  description?: string;
  /** @description Quantos looks mostrar inicialmente no Celular */
  initialCountMobile?: number;
  /** @description Quantos looks mostrar inicialmente no Computador (Recomenda-se múltiplos de 4) */
  initialCountDesktop?: number;
  /** @description A lista configurada de fotos/looks */
  looks?: Look[];
}

export default function ShopTheLook({
  title = "Shop the look",
  highlightTitle = "Inspire-se",
  description =
    "Descubra os produtos práticos e multifuncionais para recriar desde clássicos do dia a dia até looks icônicos!",
  initialCountMobile = 4,
  initialCountDesktop = 4,
  looks = [],
}: Props) {
  const rootId = useId();

  if (!looks || looks.length === 0) return null;

  return (
    <div
      id={rootId}
      class="w-full bg-[#F4F4F4] py-16 flex flex-col items-center"
    >
      {/* Header */}
      <div class="px-5 text-center mb-[10px] lg:mb-12 xl:max-w-[970px] max-w-[650px] mx-auto flex flex-col items-center">
        {title && (
          <span class="xl:text-[#333333] text-[14px] xl:text-[16px] tracking-wide xl:font-regular xl:font-hanken-grotesk font-medium text-[#363931] mb-0 xl:mb-[5px]">
            {title}
          </span>
        )}
        {highlightTitle && (
          <h2 class="text-[44px] lg:text-[32px] font-Queens text-[#CE9680] leading-[1.0] mb-[10px]">
            {highlightTitle}
          </h2>
        )}
        {description && (
          <p class="text-[14px] xl:text-[20px] xl:font-hanken-grotesk text-[#2c2c2c] font-inter leading-snug lg:whitespace-nowrap">
            {description}
          </p>
        )}
      </div>

      {/* Grid Masonry usando CSS Columns para evitar falhas de altura com items verticais/quadrados */}
      <div
        class="w-full xl:max-w-[1280px] max-w-[1440px] xl:px-[30px] xl2:px-0 px-5 lg:px-20 mx-auto"
        id={`${rootId}-grid-container`}
      >
        <div
          class="columns-2 lg:columns-4 gap-2 lg:gap-[14px] relative"
          id={`${rootId}-grid`}
        >
          {looks.map((look, index) => {
            const isVertical = look.cardType === "Vertical";

            return (
              <div
                key={index}
                data-look-item={index}
                class={`relative group overflow-hidden bg-gray-200 rounded-sm cursor-pointer look-item break-inside-avoid mb-2 lg:mb-4 w-full
                       ${
                  isVertical
                    ? "aspect-[170/348] lg:aspect-[308/638]"
                    : "aspect-square lg:aspect-[312/312]"
                }
                    `}
                style={{ display: "none" }}
              >
                <picture>
                  <source
                    media="(max-width: 1023px)"
                    srcSet={look.imageMobile}
                  />
                  <source media="(min-width: 1024px)" srcSet={look.imageDesk} />
                  <img
                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    src={look.imageDesk}
                    alt={look.imageAlt || look.title}
                  />
                </picture>

                {/* Botão overlay Plus */}
                <div class="absolute bottom-3 right-3 lg:bottom-4 lg:right-4 w-9 h-9 lg:w-10 lg:h-10 bg-[#D99477] hover:bg-[#b07d68] transition-colors rounded-sm flex items-center justify-center text-white z-10 opacity-90 shadow-sm">
                  <Icon id="pluswhite" size={24} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Load More Button */}
      <div class="mt-8 lg:mt-12 px-5">
        <button
          id={`${rootId}-btn`}
          class="hidden bg-[#556b50] font-Hanken-Grotesk hover:bg-[#455C42] transition-colors text-[#ffffff] text-[14px] tracking-wide px-[52px] py-[16px] rounded-md font-regular ring-1 ring-transparent focus:ring-offset-2"
        >
          Ver mais looks
        </button>
      </div>

      {/* Script de Logica (Esconde acima do inicial + dispara o modal ao clicar nas imgs) */}
      <script
        dangerouslySetInnerHTML={{
          __html: useScript(
            (id: string, initialMb: number, initialDk: number) => {
              const init = () => {
                const grid = document.getElementById(`${id}-grid`);
                const btn = document.getElementById(`${id}-btn`);
                if (!grid || !btn) return;

                let currentVisible = window.innerWidth >= 1024
                  ? initialDk
                  : initialMb;
                const items = grid.querySelectorAll<HTMLElement>(".look-item");
                const total = items.length;

                const renderState = () => {
                  items.forEach((item, idx) => {
                    if (idx < currentVisible) {
                      item.style.display = "block";
                    } else {
                      item.style.display = "none";
                    }
                  });

                  if (currentVisible >= total) {
                    btn.style.display = "none";
                  } else {
                    btn.style.display = "inline-block";
                  }
                };

                items.forEach((item) => {
                  // Clean up previous listenners safely
                  item.removeEventListener("click", (item as any).opener);
                  const opener = () => {
                    const idx = item.getAttribute("data-look-item");
                    if (idx !== null) {
                      window.dispatchEvent(
                        new CustomEvent("open-look-modal", {
                          detail: { index: parseInt(idx, 10) },
                        }),
                      );
                    }
                  };
                  (item as any).opener = opener;
                  item.addEventListener("click", opener);
                });

                btn.onclick = () => {
                  const step = window.innerWidth >= 1024
                    ? initialDk
                    : initialMb;
                  currentVisible += step;
                  renderState();
                };

                renderState();
              };

              if (document.readyState === "complete") init();
              else window.addEventListener("load", init);
            },
            rootId,
            initialCountMobile,
            initialCountDesktop,
          ),
        }}
      />

      {/* Island do Modal com filtro restrito de chaves para evitar crash de JSON Circular (VTEX) */}
      <ShopTheLookModal
        looks={looks.map((l) => ({
          imageDesk: l.imageDesk,
          imageMobile: l.imageMobile,
          imageAlt: l.imageAlt,
          modalImage: l.modalImage,
          modalImageMobile: l.modalImageMobile,
          title: l.title,
          subtitle: l.subtitle,
          products: (l.products || []).map((p) => ({
            productID: p.productID,
            name: p.name,
            offers: p.offers?.offers
              ? {
                // @ts-ignore safe-strip
                offers: [{
                  price: p.offers.offers[0]?.price,
                  seller: p.offers.offers[0]?.seller,
                }],
              }
              : undefined,
            additionalProperty: p.additionalProperty?.map((a) => ({
              name: a.name,
              value: a.value,
            })),
            // @ts-ignore safe-strip
            image: p.image?.length ? [{ url: p.image[0]?.url }] : undefined,
            // @ts-ignore safe-strip
            isVariantOf: p.isVariantOf
              ? { productGroupID: p.isVariantOf.productGroupID }
              : undefined,
          })),
        })) as any}
      />
    </div>
  );
}
