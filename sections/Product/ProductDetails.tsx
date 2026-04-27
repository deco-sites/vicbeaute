import { ProductDetailsPage } from "apps/commerce/types.ts";
import ImageGallerySlider from "../../islands/Gallery.tsx";
import ProductInfo from "../../components/product/ProductInfo.tsx";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import Section from "../../components/ui/Section.tsx";
import { clx } from "../../sdk/clx.ts";
import Icon from "../../components/ui/Icon.tsx";
import ProductAccordion from "../../components/product/ProductAccordion.tsx";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

export default function ProductDetails({ page }: Props) {
  /**
   * Rendered when a not found is returned by any of the loaders run on this page
   */
  if (!page) {
    return (
      <div class="w-full flex justify-center items-center py-28">
        <div class="flex flex-col items-center justify-center gap-6">
          <span class="font-medium text-2xl">Page not found</span>
          <a href="/" class="btn no-animation">
            Go back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <section
      id="product-content-area"
      class="container flex flex-col gap-4 sm:gap-5 w-full pt-24 lg:pt-[114px] sm:px-0 max-w-[1130px] lg:pb-16 product-details"
    >
      <div class="lg:hidden w-full px-5">
        <Breadcrumb itemListElement={page.breadcrumbList.itemListElement} />

        {/* Mobile Rating Row */}
        <div class="flex items-center justify-between mt-2 mb-4 pointer-events-none">
          <div class="flex items-center gap-1">
            <Icon id="star-konfidency" size={12} class="text-[#D1927D]" />
            <span class="text-[11px] font-semibold text-[#212121]">
              {(page.product.aggregateRating?.ratingValue ?? 4.5).toFixed(1).replace(".", ",")}
            </span>
            <a href="#reviews" class="text-[11px] text-[#212121] underline ml-1 pointer-events-auto">
              ({page.product.aggregateRating?.reviewCount ?? 7} Avaliações)
            </a>
          </div>
          {page.product.gtin && (
            <span class="text-[9px] text-black-10 uppercase tracking-widest">
              Ref.: {page.product.gtin}
            </span>
          )}
        </div>
      </div>

      <div
        class={clx(
          "container flex flex-col xl:flex-row flex-start lg:pb-5",
          "lg:gap-[60px] py-0",
          "max-w-[1238px] lg:m-[0px]",
        )}
      >
        <div class="sm:col-span-3">
          <ImageGallerySlider page={page} />
        </div>
        <div class="sm:col-span-2">
          <ProductInfo page={page} />
        </div>
      </div>
    </section>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;
