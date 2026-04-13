import { useSignal } from "@preact/signals";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../sdk/clx.ts";

export interface ColorTab {
  id: string;
  name: string;
  subtitle: string;
  swatchUrl: string;
  largeImageUrl: string;
  descriptionHtml: string;
}

export interface Props {
  title?: string;
  colors: ColorTab[];
}

export default function ColorDetails({ title = "Cores", colors }: Props) {
  const selectedIdx = useSignal(0);

  if (!colors || colors.length === 0) return null;

  const activeColor = colors[selectedIdx.value] || colors[0];

  return (
    <div id="product-color-details" class="w-full py-8 lg:py-16 bg-[#ffffff]">
      <div
        class={clx(
          "container grid grid-cols-1 max-w-[1044px] gap-8 px-5 lg:px-0",
          "lg:grid-cols-2 lg:gap-16 xl:gap-24",
        )}
      >
        {/* Left: Large Image */}
        <div class="lg:order-1 flex justify-center h-full">
          <Image
            src={activeColor.largeImageUrl}
            alt={activeColor.name || "Cor do produto"}
            width={351}
            height={351}
            class="w-full object-cover lg:hidden"
          />
          <Image
            src={activeColor.largeImageUrl}
            alt={activeColor.name || "Cor do produto"}
            width={640}
            height={640}
            class="hidden lg:block w-full object-cover lg:h-auto"
          />
        </div>

        {/* Right: Texts & Tabs */}
        <div class="lg:order-2 flex flex-col justify-start h-full pt-4 lg:pt-0">
          <h2 class="font-Queens text-[32px] lg:text-[40px] text-[#D1927D] mb-4 lg:mb-6 leading-tight">
            {title}
          </h2>

          {/* Tabs Container */}
          <div class="flex flex-row overflow-x-auto gap-3 pb-2 mb-4 scrollbar-none">
            {colors.map((color, i) => {
              const isSelected = i === selectedIdx.value;
              return (
                <button
                  type="button"
                  key={color.id}
                  onClick={() => selectedIdx.value = i}
                  class={clx(
                    "flex items-center gap-3 px-[10px] py-[6px] border rounded-sm flex-shrink-0 transition-colors",
                    isSelected
                      ? "border-[#4C4C4C] bg-white"
                      : "border-[#E5E5E5] bg-white hover:border-[#808080]"
                  )}
                >
                  <div class="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-[#f0f0f0]">
                    <Image
                      src={color.swatchUrl}
                      alt={color.name}
                      width={24}
                      height={24}
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="flex flex-col text-left items-start overflow-hidden max-w-[140px]">
                    <span class={clx("text-sm font-semibold leading-tight truncate w-full", isSelected ? "text-[#212121]" : "text-[#4C4C4C]")}>
                      {color.name}
                    </span>
                    {color.subtitle && (
                      <span class="text-xs text-[#808080] leading-tight mt-0.5 truncate w-full" title={color.subtitle}>
                        {color.subtitle}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <hr class="border-[#EBEBEB] w-full mb-6" />

          {/* HTML Description */}
          {activeColor.descriptionHtml && (
            <div
              class={clx(
                "flex flex-col font-Hanken-Grotesk text-[15px] leading-relaxed text-[#4C4C4C]",
                "[&_strong]:font-bold [&_strong]:text-[#212121] [&_strong]:mb-1 [&_strong]:block",
                "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_li]:mb-1 [&_li]:text-[#4C4C4C]",
                "[&_p]:mb-4 last:[&_p]:mb-0"
              )}
              // deno-lint-ignore react-dangerouslysetinnerhtml
              dangerouslySetInnerHTML={{ __html: activeColor.descriptionHtml }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
