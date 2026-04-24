import type { ProductListingPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductCardSimilars from "../../components/product/ProductCardSimilars.tsx";
import Filters from "../../islands/Filters.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import Breadcrumb from "../ui/Breadcrumb.tsx";
import Drawer from "../ui/Drawer.tsx";
import Sort from "./Sort.tsx";
import { useDevice, useScript, useSection } from "@deco/deco/hooks";
import { type SectionProps } from "@deco/deco";
import SeoText from "../ui/SEOText.tsx";
import NotFoundSection from "../../sections/Content/NotFound.tsx";
import ErrorBreadcrumbs from "./searchError/searchErrorBreadcrumb.tsx";
import PromoCard, { PromoCardProps } from "./PromoCard.tsx";
export interface Layout {
  /**
   * @title Pagination
   * @description Format of the pagination
   */
  pagination?: "show-more" | "pagination";
}
import { type Section } from "@deco/deco/blocks";

export interface Props {
  /** @title Integration */
  page: ProductListingPage | null;
  layout?: Layout;
  /** @description 0 for ?page=0 as your first page */
  startingPage?: 0 | 1;
  /** @hidden */
  partial?: "hideMore" | "hideLess";

  /**
   * @title Ocultar Breadcrumb Padrão
   * @description Ative isso se a página já possui um Category Banner (que injeta o próprio breadcrumb)
   */
  hideBreadcrumb?: boolean;

  /**
   * @title Cards Promocionais intercalados
   * @description Crie até 3 cards promocionais que aparecerão automaticamente abrindo cada linha
   * @maxItems 3
   */
  promoCards?: PromoCardProps[];

  /**
   * @title Bloco de Erro 404 Customizado
   * @description Este bloco será renderizado na tela de 404, podendo ser configurada as imagens e textos pela agência.
   */
  notFoundFallback?: Section;

  /**
   * @title Texto SEO
   * @default
   */
  textSeo?: {
    /**
     * @title Título H1
     */
    h1title?: string;
    /**
     * @title Subtítulo H2
     */
    h2subTitle?: string;
    /**
     * @title Texto
     * @format textarea
     */
    text?: string;
  };
  // textSeo?: RichText;
}

const useUrlRebased = (overrides: string | undefined, base: string) => {
  let url: string | undefined = undefined;
  if (overrides) {
    const temp = new URL(overrides, base);
    const final = new URL(base);
    final.pathname = temp.pathname;
    for (const [key, value] of temp.searchParams.entries()) {
      final.searchParams.set(key, value);
    }
    url = final.href;
  }
  return url;
};
function PageResult(props: SectionProps<typeof loader>) {
  const { layout, startingPage = 0, url, partial } = props;
  const page = props.page!;
  const { products, pageInfo } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;
  const nextPageUrl = useUrlRebased(pageInfo.nextPage, url);
  const prevPageUrl = useUrlRebased(pageInfo.previousPage, url);
  const partialPrev = useSection({
    href: prevPageUrl,
    props: { partial: "hideMore" },
  });
  const partialNext = useSection({
    href: nextPageUrl,
    props: { partial: "hideLess" },
  });
  const infinite = layout?.pagination !== "pagination";
  const hasPromo = props.promoCards && props.promoCards.length > 0 &&
    zeroIndexedOffsetPage === 0;

  return (
    <div class="grid grid-flow-row grid-cols-1 place-items-center">
      <div
        class={clx(
          "pb-2 sm:pb-10 flex justify-center w-full",
          (!prevPageUrl || partial === "hideLess") && "hidden",
        )}
      >
        <a
          rel="prev"
          class="flex items-center justify-center font-medium text-[12px] xl:text-sm bg-[#5E6C5B] text-white-15 hover:bg-[#4d594b] w-[251px] h-[42px] rounded-[5px] transition-colors font-Hanken-Grotesk"
          hx-swap="outerHTML show:parent:top"
          hx-get={partialPrev}
        >
          <span class="inline [.htmx-request_&]:hidden">
            Carregar menos produtos
          </span>
          <span class="loading loading-spinner hidden [.htmx-request_&]:block text-white" />
        </a>
      </div>

      <div
        data-product-list
        class={clx(
          "grid items-start",
          "grid-cols-2 gap-[18px]",
          hasPromo ? "lg:grid-cols-[350px_1fr_1fr_1fr]" : "lg:grid-cols-4",
          "lg:gap-x-[10px] mb-[30px] xl:mb-0 gap-x-[10px] lg:gap-y-[40px] gap-y-5",
          "w-full",
        )}
      >
        {(() => {
          if (!products) return null;
          const itemsToRender = [];
          let promoIndex = 0;
          let productIndex = 0;

          const promoCount = hasPromo ? props.promoCards!.length : 0;

          // ---- ALGORITMO AUTO-GRID PERFEITO ----
          // Se o VTEX/Deco manda 9 produtos e temos 3 promos = 12 (ok, 3 linhas perfeitas no desk).
          // Mas na Pagina 2 vem só 9 produtos... 9 % 4 = sobra 1 sozinho!
          // Isso calcula o excedente e joga fora os ultimos para garantir SEMPRE um grid retangular perfeito.
          const totalRaw = products.length + promoCount;
          const excess = totalRaw % 4; // Múltiplos de 4 (Desktop) automaticamente resolvem o 2 (Mobile)
          const validProductCount = products.length - excess;

          const totalToRender = validProductCount + promoCount;

          for (let i = 0; i < totalToRender; i++) {
            const isPromoPosition = hasPromo && (i === 0 || i === 4 || i === 8);
            if (
              isPromoPosition && props.promoCards &&
              promoIndex < props.promoCards.length
            ) {
              const promo = props.promoCards[promoIndex];
              itemsToRender.push(
                <div
                  class="w-full flex h-full"
                  key={`promo-card-${promoIndex}`}
                >
                  <PromoCard {...promo} />
                </div>,
              );
              promoIndex++;
            } else if (productIndex < validProductCount) {
              const product = products[productIndex];
              itemsToRender.push(
                <ProductCardSimilars
                  key={`product-card-${product.productID}`}
                  product={product}
                  preload={productIndex === 0 && !hasPromo}
                  index={offset + productIndex}
                  class="h-full min-w-[160px] max-w-[300px]"
                />,
              );
              productIndex++;
            }
          }
          return itemsToRender;
        })()}
      </div>

      <div class={clx("pt-2 sm:pt-10 w-full", "")}>
        {infinite
          ? (
            <div class="flex justify-center [&_section]:contents">
              <a
                rel="next"
                class={clx(
                  "flex items-center justify-center font-Manrope font-medium text-[12px] bg-[#5E6C5B] text-white-15 hover:bg-[#4d594b] w-[251px] h-[42px] rounded-[5px] transition-colors",
                  (!nextPageUrl || partial === "hideMore") && "hidden",
                )}
                hx-swap="outerHTML show:parent:top"
                hx-get={partialNext}
              >
                <span class="inline [.htmx-request_&]:hidden">
                  Carregar mais produtos
                </span>
                <span class="loading loading-spinner hidden [.htmx-request_&]:block font-Manrope text-[12px] xl:text-[14px] font-medium" />
              </a>
            </div>
          )
          : (
            <div class={clx("join", infinite && "hidden")}>
              <a
                rel="prev"
                aria-label="previous page link"
                href={prevPageUrl ?? "#"}
                disabled={!prevPageUrl}
                class="btn btn-ghost join-item"
              >
                <Icon id="chevron-right" class="rotate-180" />
              </a>
              <span class="btn btn-ghost join-item">
                Page {zeroIndexedOffsetPage + 1}
              </span>
              <a
                rel="next"
                aria-label="next page link"
                href={nextPageUrl ?? "#"}
                disabled={!nextPageUrl}
                class="btn btn-ghost join-item"
              >
                <Icon id="chevron-right" />
              </a>
            </div>
          )}
      </div>
    </div>
  );
}
const setPageQuerystring = (page: string, id: string) => {
  const element = document.getElementById(id)?.querySelector(
    "[data-product-list]",
  );
  if (!element) {
    return;
  }
  new IntersectionObserver((entries) => {
    const url = new URL(location.href);
    const prevPage = url.searchParams.get("page");
    for (let it = 0; it < entries.length; it++) {
      if (entries[it].isIntersecting) {
        url.searchParams.set("page", page);
      } else if (
        typeof history.state?.prevPage === "string" &&
        history.state?.prevPage !== page
      ) {
        url.searchParams.set("page", history.state.prevPage);
      }
    }
    history.replaceState({ prevPage }, "", url.href);
  }).observe(element);
};
function Result(props: SectionProps<typeof loader>) {
  const container = useId();
  const controls = useId();
  const device = useDevice();
  const { startingPage = 0, url, partial } = props;
  const page = props.page!;
  const { products, filters, breadcrumb, pageInfo, sortOptions } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;
  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        // TODO: get category name from search or cms setting
        item_list_name: breadcrumb.itemListElement?.at(-1)?.name,
        item_list_id: breadcrumb.itemListElement?.at(-1)?.item,
        items: page.products?.map((product, index) =>
          mapProductToAnalyticsItem({
            ...(useOffer(product.offers)),
            index: offset + index,
            product,
            breadcrumbList: page.breadcrumb,
          })
        ),
      },
    },
  });
  const results = (
    <span class="text-gray-45 text-[12px] xl:text-[14px] pb-[14px] lg:pb-0 font-Poppins">
      ({page.pageInfo.records}) produtos
    </span>
  );
  const sortBy = sortOptions.length > 0 && (
    <Sort sortOptions={sortOptions} url={url} />
  );
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .drawer-filters > .drawer-side {
          z-index: 100 !important;
        }
      `,
        }}
      />
      <div id={container} {...viewItemListEvent} class="w-full">
        {partial
          ? <PageResult {...props} />
          : (
            <div class="container flex flex-col w-full py-4 sm:py-5 px-3 xl:px-4 xlarge:px-0 sm:px-0 lg:max-w-[1280px] container-search">
              <Drawer
                class="block w-full drawer-filters"
                id={controls}
                aside={
                  <div class="bg-[#ffffff] flex flex-col h-full w-[380px] max-w-[100vw] relative">
                    <div class="bg-[#ffffff] flex justify-between items-center px-6 py-6 border-b border-[#E1E1E1]">
                      <div class="w-8"></div> {/* Spacer for centering */}
                      <span class="text-[#CE9680] text-[32px] font-Queens">
                        Filtros
                      </span>
                      <label
                        class="btn btn-ghost btn-sm btn-circle hover:bg-transparent text-[#191C1F]"
                        for={controls}
                      >
                        <Icon id="close" size={24} strokeWidth={1} />
                      </label>
                    </div>
                    <div class="flex-grow overflow-auto p-6 custom-scrollbar pb-[140px]">
                      <Filters
                        filters={filters}
                        sortOptions={sortOptions}
                        url={url}
                      />
                    </div>

                    {/* Fixed Footer */}
                    <div class="absolute bottom-0 left-0 w-full p-6 border-t border-[#E1E1E1] bg-[#ffffff] flex flex-col gap-5 z-10 lg:pb-[max(24px,env(safe-area-inset-bottom))]">
                      <span class="text-center font-medium text-[13px] text-[#191C1F] tracking-wide">
                        {page.pageInfo.records} produtos encontrados
                      </span>
                      <div class="flex gap-3 w-full">
                        <a
                          href={url.split("?")[0]}
                          class="flex-1 border border-[#191C1F] text-[#191C1F] text-[13px] font-semibold uppercase tracking-widest h-12 flex items-center justify-center rounded-sm transition-colors hover:bg-neutral-50"
                        >
                          Limpar filtro
                        </a>
                        <label
                          for={controls}
                          class="flex-1 cursor-pointer bg-[#556B50] hover:bg-[#455C42] text-[#ffffff] text-[13px] font-semibold uppercase tracking-widest h-12 flex items-center justify-center rounded-sm transition-colors shadow-sm"
                        >
                          Aplicar filtro
                        </label>
                      </div>
                    </div>
                  </div>
                }
              >
                <div class="flex w-full justify-between items-start lg:items-center mb-6 lg:mb-10 lg:mt-6 gap-4 border-b border-[#E1E1E1] pb-5 lg:border-none lg:pb-0">
                  {/* Esquerda: Resultados + Tags Ativas */}
                  <div class="flex flex-wrap items-center gap-4">
                    {results}

                    {filters
                      .filter((f) => f["@type"] === "FilterToggle")
                      .flatMap((f) =>
                        f.values.filter((v) => v.selected && v.url)
                      )
                      .map((active) => (
                        <a
                          key={active.url}
                          href={active.url}
                          class="flex items-center gap-[6px] px-[12px] py-[6px] bg-[#ffffff] border border-[#E1E1E1] rounded-sm hover:border-[#455C42] transition-colors text-[13px] font-medium tracking-wide text-[#8a8a8a] whitespace-nowrap"
                        >
                          {active.label}
                          <Icon id="close" size={14} class="opacity-60" />
                        </a>
                      ))}
                  </div>

                  {/* Direita: Botões Filtro + Ordenar */}
                  <div class="flex items-center gap-3 w-full lg:w-auto">
                    <label
                      class="flex items-center gap-2 cursor-pointer bg-[#ffffff] px-5 py-2 rounded-[30px] border border-[#E1E1E1] shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow text-[13px] font-medium tracking-wide flex-shrink-0 text-[#191C1F]"
                      for={controls}
                    >
                      Filtros
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        class="text-[#191C1F]"
                      >
                        <path
                          d="M4 6H20M4 12H14M4 18H9"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </label>
                    <div class="flex-shrink-0 relative sorting-container">
                      {/* O sortBy interno eh o <Sort />, se for preciso pode ser envelopado ou manipulado pelo CSS globals */}
                      {sortBy}
                    </div>
                  </div>
                </div>

                <div class="flex flex-col w-full">
                  <PageResult {...props} />
                </div>

                {props.textSeo && <SeoText textSeo={props.textSeo} />}
              </Drawer>
            </div>
          )}
      </div>

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            setPageQuerystring,
            `${pageInfo.currentPage}`,
            container,
          ),
        }}
      />
    </>
  );
}

export const loader = (props: Props, req: Request) => {
  return {
    ...props,
    url: req.url,
  };
};

function SearchResult({ page, url, ...props }: SectionProps<typeof loader>) {
  const searchParams = new URL(url).searchParams;
  const q = searchParams.get("q")?.trim();

  if (!page) {
    if (props.notFoundFallback) {
      return (
        <props.notFoundFallback.Component {...props.notFoundFallback.props} />
      );
    }
    return (
      <>
        <NotFoundSection />
      </>
    );
  }

  return <Result {...props} page={page} url={url} />;
}

export default SearchResult;
