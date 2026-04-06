import type { ProductListingPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductCard from "../../components/product/ProductCard.tsx";
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
import NotFoundSearch from "../../islands/SearchError.tsx";
import ErrorBreadcrumbs from "./searchError/searchErrorBreadcrumb.tsx";
export interface Layout {
  /**
   * @title Pagination
   * @description Format of the pagination
   */
  pagination?: "show-more" | "pagination";
}
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

function NotFound() {
  return (
    <div class="w-full flex justify-center items-center py-10">
      <span>Not Found!</span>
    </div>
  );
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
  return (
    <div class="grid grid-flow-row grid-cols-1 place-items-center">
      <div
        class={clx(
          "pb-2 sm:pb-10",
          (!prevPageUrl || partial === "hideLess") && "hidden",
        )}
      >
        <a
          rel="prev"
          class="btn btn-ghost"
          hx-swap="outerHTML show:parent:top"
          hx-get={partialPrev}
        >
          <span class="inline [.htmx-request_&]:hidden">
            Show Less
          </span>
          <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
        </a>
      </div>

      <div
        data-product-list
        class={clx(
          "grid items-center",
          "grid-cols-2 gap-[18px]",
          "lg:grid-cols-4 lg:gap-10",
          "w-full",
        )}
      >
        {products?.map((product, index) => (
          <ProductCard
            key={`product-card-${product.productID}`}
            product={product}
            preload={index === 0}
            index={offset + index}
            class="h-full min-w-[160px] max-w-[300px]"
          />
        ))}
      </div>

      <div class={clx("pt-2 sm:pt-10 w-full", "")}>
        {infinite
          ? (
            <div class="flex justify-center [&_section]:contents">
              <a
                rel="next"
                class={clx(
                  "btn btn-ghost",
                  (!nextPageUrl || partial === "hideMore") && "hidden",
                )}
                hx-swap="outerHTML show:parent:top"
                hx-get={partialNext}
              >
                <span class="inline [.htmx-request_&]:hidden">
                  Show More
                </span>
                <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
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
    <span class="text-gray-45 text-xs lg:text-base pb-[14px] lg:pb-0">
      {page.pageInfo.records} produtos encontrados
    </span>
  );
  const sortBy = sortOptions.length > 0 && (
    <Sort sortOptions={sortOptions} url={url} />
  );
  return (
    <>
      <div id={container} {...viewItemListEvent} class="w-full">
        {partial
          ? <PageResult {...props} />
          : (
            <div class="container flex flex-col w-full py-4 sm:py-5 px-4 sm:px-0 lg:max-w-[1280px] container-search">
              <Drawer
                class="lg:hidden block"
                id={controls}
                aside={
                  <div class="bg-[#F8F8F8] flex flex-col h-full divide-y overflow-y-hidden">
                    <div class=" bg-[#F8F8F8] flex justify-between items-center">
                      <div class="px-5 pt-5 flex flex-col-reverse">
                        <span>{results}</span>
                        <span class="font-semibold text-black-10 text-[22px]">
                          Filtrar por
                        </span>
                      </div>
                      <label class="btn btn-ghost" for={controls}>
                        <Icon id="close" />
                      </label>
                    </div>
                    <div class="flex-grow overflow-auto border-t-transparent">
                      <Filters
                        filters={filters}
                        sortOptions={sortOptions}
                        url={url}
                      />
                    </div>
                  </div>
                }
              >
                <div class="lg:bg-[#F8F8F8] flex flex-col sm:hidden justify-between items-start gap-[14px]">
                  <div class="flex w-full gap-7 flex-row-reverse justify-between">
                    <label
                      class="select items-center w-full rounded-lg max-w-vc-160 border border-gray-40 min-h-[unset] h-8 px-4 text-sm text-black-15 bg-[url(/image/filter.png)] bg-auto bg-[position:calc(100%_-_41px)_calc(1px_+_46%),calc(100%_-_16.1px)_calc(1px_+_50%)] pl-14 font-Poppins"
                      for={controls}
                    >
                      Filtros
                    </label>
                    {sortBy}
                  </div>
                  {results}
                </div>
              </Drawer>

              <div class="grid grid-cols-1 md:grid-cols-[260px_1fr] md:gap-5 lg:grid-cols-[280px_1fr] lg:gap-10">
                <aside class="hidden md:flex place-self-start flex-col gap-9 max-w-[280px] w-full">
                  <div class="bg-[#F8F8F8] flex flex-col h-full divide-y overflow-y-hidden">
                    <div class=" bg-[#F8F8F8] flex justify-between items-center">
                      <div class="px-5 py-2 flex flex-col gap-2">
                        <span>{results}</span>
                        <span class="font-semibold text-black-10 text-[22px]">
                          Filtrar por
                        </span>
                      </div>
                    </div>
                    <div class="flex-grow overflow-auto border-t-transparent">
                      <Filters
                        filters={filters}
                        sortOptions={sortOptions}
                        url={url}
                      />
                    </div>
                  </div>
                  <div class="bg-[#F8F8F8] flex flex-col sm:hidden justify-between items-start gap-[14px]">
                    <div class="flex w-full gap-7 flex-row-reverse justify-between">
                      <label
                        class="select items-center w-full rounded-lg max-w-vc-160 border border-gray-40 min-h-[unset] h-8 px-4 text-sm text-black-15 bg-[url(/image/filter.png)] bg-auto bg-[position:calc(100%_-_41px)_calc(1px_+_46%),calc(100%_-_16.1px)_calc(1px_+_50%)] pl-14 font-Poppins"
                        for={controls}
                      >
                        Filtros
                      </label>
                      {sortBy}
                    </div>
                    {results}
                  </div>
                </aside>

                <div class="flex flex-col gap-9 lg:gap-0">
                  <PageResult {...props} />
                </div>
              </div>
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
    return (
      <>
        <ErrorBreadcrumbs titleBreadcrumb="Erro 404" />
        <NotFoundSearch />
      </>
    );
  }

  return <Result {...props} page={page} url={url} />;
}

export default SearchResult;
