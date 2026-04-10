import type { ProductDetailsPage } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

export default function ProductDescription({ page }: Props) {
  if (!page || !page.product) return null;

  const product = page.product;
  let description = product.description;
  const baseProduct = product.isVariantOf ?? product;

  if (!description && "description" in baseProduct) {
    description = baseProduct.description;
  }

  if (!description && "hasVariant" in baseProduct) {
    description = baseProduct.hasVariant?.find((v) => v.description)
      ?.description;
  }

  // Find image with label "descricao" or "decricao" (typo)
  const descriptionImage = product.image?.find((img) => {
    const name = img.name?.toLowerCase();
    const alt = img.alternateName?.toLowerCase();
    return name === "descricao" || alt === "descricao" || name === "decricao" ||
      alt === "decricao";
  })?.url ||
    baseProduct.image?.find((img) => {
      const name = img.name?.toLowerCase();
      const alt = img.alternateName?.toLowerCase();
      return name === "descricao" || alt === "descricao" ||
        name === "decricao" || alt === "decricao";
    })?.url;

  // Add fallback: first product image or a generic placeholder
  const finalImage = descriptionImage || product.image?.[0]?.url ||
    baseProduct.image?.[0]?.url ||
    "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0e65-4f9e-bbb5-4d371fccaede";

  if (!description) return null;

  // Removed the faulty HTML string parsing logic.
  // We will pass the full description directly and let Tailwind nested selectors style the native HTML tags.

  return (
    <div id="product-description" class="w-full py-8 lg:py-16">
      <div
        class={clx(
          "container grid grid-cols-1 max-w-[1044px] gap-8 px-5 lg:px-0 bg-[#ffffff]",
          finalImage ? "lg:grid-cols-2 lg:gap-16 xl:gap-24" : "lg:grid-cols-1",
        )}
      >
        {/* Mobile: Text on top or Image on top? Image on top. */}
        {finalImage && (
          <div class="lg:order-2 flex justify-center h-full">
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
              class="hidden lg:block w-full object-cover rounded-sm lg:h-auto"
            />
          </div>
        )}

        {/* Text Content */}
        <div class="lg:order-1 flex flex-col justify-center h-full">
          <h2 class="font-Queens text-[32px] lg:text-[40px] text-pink-15 mb-4 lg:mb-6 leading-tight">
            Descri&#231;&#227;o
          </h2>

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
        </div>
      </div>
    </div>
  );
}
