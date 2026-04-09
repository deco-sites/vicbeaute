import { ProductDetailsPage } from "apps/commerce/types.ts";
import ImageGallerySlider from "../../islands/Gallery.tsx";
import ProductInfo from "../../components/product/ProductInfo.tsx";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import Section from "../../components/ui/Section.tsx";
import { clx } from "../../sdk/clx.ts";
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
    <div class="container flex flex-col gap-4 sm:gap-5 w-full py-4 lg:pt-[114px] sm:px-0 max-w-[1130px] lg:pb-16 product-details">
      <div class="lg:hidden w-full px-5">
        <Breadcrumb itemListElement={page.breadcrumbList.itemListElement} />
      </div>

      <div
        class={clx(
          "container grid lg:pb-5",
          "grid-cols-1 gap-2 py-0",
          "sm:grid-cols-5 sm:gap-6 max-w-[1044px] lg:m-[0px]",
        )}
      >
        <div class="sm:col-span-3">
          <ImageGallerySlider page={page} />
        </div>
        <div class="sm:col-span-2">
          <ProductInfo page={page} />
        </div>
      </div>
      <div class="hidden lg:block w-full lg:max-w-[1130px] max-w-[1536px] lg:border-t">
        <ProductAccordion page={page} />
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;
