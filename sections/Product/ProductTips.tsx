import type { ProductDetailsPage } from "apps/commerce/types.ts";
import ProductTipsVideo from "../../islands/ProductTipsVideo.tsx";

export interface Props {
  page: ProductDetailsPage | null;
}

export default function ProductTips({ page }: Props) {
  if (!page || !page.product) return null;

  const product = page.product;
  const baseProduct = product.isVariantOf ?? product;
  const specs = baseProduct.additionalProperty ?? [];

  const textValue = specs.find((s) => s.name === "Dicas Da Vic")?.value;
  const videoId = specs.find((s) => s.name === "Vídeo - Dicas Da Vic")?.value;

  if (!textValue && !videoId) return null;

  return (
    <div id="product-tips" class="w-full bg-[#f4f2ee] py-8 lg:py-16">
      {/* Container shared alignment with description */}
      <div class="container flex flex-col w-full px-5 sm:px-0 xl:px-[30px] xl2:px-0 max-w-[1280px]">
        {/* Mobile Layout (Static, not accordion) */}
        <div class="flex flex-col lg:hidden w-full border-b border-black-5/20 pb-2">
          <h2 class="py-2 font-Queens text-[28px] text-[#D1927D]">
            Dicas da VIC
          </h2>
          <div class="pb-6">
            {textValue && (
              <p class="text-[15px] font-Hanken-Grotesk text-[#4C4C4C] leading-relaxed mb-6">
                {textValue}
              </p>
            )}
            {videoId && (
              <div class="w-full aspect-[4/5] sm:aspect-video rounded overflow-hidden">
                <ProductTipsVideo videoId={videoId!} />
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div class="hidden lg:flex flex-col w-full">
          <h2 class="font-Queens text-[40px] text-[#D1927D] mb-4 leading-tight">
            Dicas da Vic
          </h2>
          {textValue && (
            <p class="text-[15px] font-Hanken-Grotesk text-[#4C4C4C] leading-relaxed mb-8">
              {textValue}
            </p>
          )}
          {videoId && (
            <div class="w-full aspect-video rounded overflow-hidden">
              <ProductTipsVideo videoId={videoId!} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
