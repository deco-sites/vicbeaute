import type { Product, ProductDetailsPage } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { AppContext as AppContextVTEX } from "apps/vtex/mod.ts";
import { AppContext } from "../../apps/site.ts";

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
        } catch (e) {
          console.error(
            "[ProductDescriptionKit] Erro ao buscar produtos do kit:",
            e,
          );
        }
      }
    }
  }

  return { ...props, kitProducts };
};

interface FullProps extends Props {
  kitProducts?: Product[] | null;
}

export default function ProductDescriptionKit(
  { page, kitProducts }: FullProps,
) {
  if (!page || !page.product) return null;

  const product = page.product;
  const baseProduct = product.isVariantOf ?? product;

  // Main description (kit description)
  // Fallback chain: product.description -> isVariantOf.description -> metaTagDescription -> hasVariant
  const description = product.description ??
    (baseProduct as typeof product & { description?: string }).description ??
    product.additionalProperty?.find((a) => a.name === "metaTagDescription")
      ?.value ??
    baseProduct.hasVariant?.find((v) => v.description)?.description ??
    "";

  // If no data at all, don't render
  if (!page || !page.product) return null;

  // Find image with label "descricao" or fallback
  const descriptionImage = product.image?.find((img) => {
    const name = img.name?.toLowerCase();
    const alt = img.alternateName?.toLowerCase();
    return name === "descricao" || alt === "descricao" ||
      name === "decricao" || alt === "decricao";
  })?.url ??
    baseProduct.image?.find((img) => {
      const name = img.name?.toLowerCase();
      const alt = img.alternateName?.toLowerCase();
      return name === "descricao" || alt === "descricao" ||
        name === "decricao" || alt === "decricao";
    })?.url;

  const finalImage = descriptionImage ?? product.image?.[0]?.url ??
    baseProduct.image?.[0]?.url ??
    "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0e65-4f9e-bbb5-4d371fccaede";

  // Build kit items accordion data
  const kitItems = (kitProducts ?? []).map((p) => {
    const itemDescription = p.description ??
      p.isVariantOf?.description ??
      "";

    // First product image as thumbnail (main product photo)
    const thumbUrl = p.image?.[0]?.url ?? "";

    const name = p.isVariantOf?.name ?? p.name ?? "";

    return { name, thumbUrl, description: itemDescription };
  });

  return (
    <div id="product-description" class="w-full py-8 lg:py-16">
      <div
        class={clx(
          "container flex flex-col lg:flex-row max-w-[1280px] px-5 lg:px-0 bg-[#ffffff]",
        )}
      >
        {/* Image */}
        {finalImage && (
          <div class="lg:order-2 flex justify-center h-full lg:w-1/2">
            <Image
              src={finalImage}
              alt={product.name || "Descrição do produto"}
              width={351}
              height={351}
              class="w-full object-cover rounded-sm lg:hidden"
            />
            <Image
              src={finalImage}
              alt={product.name || "Descrição do produto"}
              width={640}
              height={560}
              class="hidden lg:block w-full rounded-sm lg:h-auto"
            />
          </div>
        )}

        {/* Text Content */}
        <div class="lg:order-1 flex flex-col justify-center lg:px-10 h-full lg:w-1/2">
          <h2 class="font-Queens text-[32px] lg:text-[40px] text-pink-15 mb-2 pt-3 leading-tight">
            Descri&#231;&#227;o
          </h2>

          {/* Main kit description */}
          <div
            class={clx(
              "flex flex-col gap-4 text-[15px] font-Hanken-Grotesk text-[#4C4C4C] leading-relaxed",
              "[&_ul]:flex [&_ul]:flex-col [&_ul]:w-full [&_ul]:my-5 [&_ul]:pl-5 [&_ul]:list-disc",
              "[&_li]:py-3 [&_li]:border-b [&_li]:border-dotted [&_li]:border-[#B3B3B3] [&_li]:text-[#4C4C4C] [&_li]:pl-1",
              "[&_p]:mb-4 last:[&_p]:mb-0",
            )}
            // deno-lint-ignore react-dangerouslysetinnerhtml
            dangerouslySetInnerHTML={{ __html: description }}
          />

          {/* Kit items accordion */}
          {kitItems.length > 0 && (
            <div class="flex flex-col mt-6 gap-0">
              {kitItems.map((kit, idx) => (
                <details
                  key={idx}
                  class="group border-t border-[#E0DDD6] last:border-b"
                >
                  <summary class="flex items-center gap-3 py-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                    {/* Product thumbnail */}
                    {kit.thumbUrl && (
                      <div class="w-10 h-10 rounded-sm overflow-hidden flex-shrink-0 bg-[#FAF9F5]">
                        <Image
                          src={kit.thumbUrl}
                          alt={kit.name}
                          width={40}
                          height={40}
                          class="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <span class="flex-1 font-Hanken-Grotesk text-[14px] font-medium text-[#363931]">
                      {kit.name}
                    </span>

                    {/* +/- icon */}
                    <div class="w-6 h-6 flex items-center justify-center flex-shrink-0 text-[#363931]">
                      {/* Plus: shown when closed */}
                      <svg
                        class="block group-open:hidden"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      >
                        <line x1="9" y1="3" x2="9" y2="15" />
                        <line x1="3" y1="9" x2="15" y2="9" />
                      </svg>
                      {/* Minus: shown when open */}
                      <svg
                        class="hidden group-open:block"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      >
                        <line x1="3" y1="9" x2="15" y2="9" />
                      </svg>
                    </div>
                  </summary>

                  {/* Expanded description */}
                  {kit.description && (
                    <div
                      class="pb-4 px-1 text-[14px] font-Hanken-Grotesk text-[#4C4C4C] leading-relaxed"
                      // deno-lint-ignore react-dangerouslysetinnerhtml
                      dangerouslySetInnerHTML={{ __html: kit.description }}
                    />
                  )}
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
