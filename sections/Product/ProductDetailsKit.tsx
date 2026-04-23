import { Product, ProductDetailsPage } from "apps/commerce/types.ts";
import ImageGallerySlider from "../../islands/Gallery.tsx";
import ProductInfoKit from "../../components/product/ProductInfoKit.tsx";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import Section from "../../components/ui/Section.tsx";
import { clx } from "../../sdk/clx.ts";
import { AppContext } from "../../apps/site.ts";
import { AppContext as AppContextVTEX } from "apps/vtex/mod.ts";
import konfidencyLoader from "../../loaders/konfidency/productList.ts";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

export const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const { page } = props;
  let kitProducts: Product[] | null = null;

  if (page?.product) {
    const product = page.product;
    const additionalProps = product.isVariantOf?.additionalProperty ??
      product.additionalProperty ?? [];
    const kitIdsProp = additionalProps.find((p) =>
      p.name === "Produtos Kit Personalizado"
    )?.value;

    if (kitIdsProp) {
      const kitIds = kitIdsProp.split(",").map((id) => id.trim()).filter(
        Boolean,
      );

      if (kitIds.length > 0) {
        try {
          const vtex = ctx as unknown as AppContextVTEX;

          kitProducts = await vtex.invoke(
            "vtex/loaders/intelligentSearch/productList.ts",
            {
              ids: kitIds,
              count: kitIds.length,
            },
          );

          if (kitProducts && kitProducts.length > 0) {
            // 1. Fetch similars for each product (to load color variants)
            await Promise.all(kitProducts.map(async (p) => {
              const pId = p.isVariantOf?.productGroupID || p.productID;
              try {
                const sims = await vtex.invoke(
                  "vtex/loaders/legacy/relatedProductsLoader.ts",
                  {
                    crossSelling: "similars",
                    id: pId,
                  },
                );
                if (sims && sims.length > 0) {
                  p.isSimilarTo = sims;
                }
              } catch (_e) {}
            }));

            // 2. Fetch Konfidency reviews
            kitProducts = await konfidencyLoader({ products: kitProducts });
          }
        } catch (e) {
          console.error(
            "[ProductDetailsKit] Erro ao buscar produtos do kit:",
            e,
          );
        }
      }
    }
  }

  return { ...props, kitProducts };
};

export default function ProductDetailsKit(
  { page, kitProducts }: Props & { kitProducts?: Product[] | null },
) {
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
    <div class="container flex flex-col gap-4 sm:gap-5 w-full pt-24 lg:pt-[114px] sm:px-0 max-w-[1130px] lg:pb-16 product-details-kit">
      <div class="lg:hidden w-full px-5">
        <Breadcrumb itemListElement={page.breadcrumbList.itemListElement} />
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
          <ProductInfoKit page={page} kitProducts={kitProducts} />
        </div>
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;
