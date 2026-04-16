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

  // Extrai o nome da cor do <strong> inicial e o resto como descrição
  let colorDisplayName = activeColor.name;
  let remainingHtml = activeColor.descriptionHtml;
  if (activeColor.descriptionHtml) {
    const match = activeColor.descriptionHtml.match(/^<strong[^>]*>([\s\S]*?)<\/strong>\s*(?:<br\s*\/?>)?\s*([\s\S]*)$/i);
    if (match) {
      const extracted = match[1].replace(/<[^>]+>/g, "").trim();
      if (extracted) {
        colorDisplayName = extracted;
        remainingHtml = match[2].trim();
      }
    }
  }

  return (
    <div id="product-color-details" class="w-full py-8 bg-gray-20">
      <div
        class={clx(
          "container grid grid-cols-1 max-w-[1280px] bg-white-15 xl:gap-[30px] gap-8 px-5 lg:px-0",
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
            height={540}
            class="hidden lg:block w-full object-cover lg:h-auto"
          />
        </div>

        {/* Right: Texts & Tabs */}
        <div class="lg:order-2 flex flex-col justify-start h-full pt-4 lg:pt-0">
          <h2 class="font-Queens text-[32px] lg:text-[40px] text-[#D1927D] mb-4 lg:mb-6 leading-tight">
            {title}
          </h2>

          {/* Esconde scrollbar do container de tabs */}
          <style dangerouslySetInnerHTML={{ __html: `
            .color-details-tabs { -ms-overflow-style: none; scrollbar-width: none; }
            .color-details-tabs::-webkit-scrollbar { display: none; }
          `}} />

          {/* Tabs Container */}
          <div class="color-details-tabs flex flex-row overflow-x-auto gap-3 pb-1">
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

          {/* Dots — linhas finas idênticas aos sliders do projeto */}
          {colors.length > 1 && (
            <div class="flex w-full gap-0 mt-2 mb-1">
              {colors.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => selectedIdx.value = i}
                  aria-label={`Selecionar cor ${i + 1}`}
                  style={{
                    flex: 1,
                    height: "3px",
                    borderRadius: 0,
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    backgroundColor: i === selectedIdx.value
                      ? "#455C42"
                      : "rgba(25,28,31,0.2)",
                    transition: "background-color 0.3s ease",
                  }}
                />
              ))}
            </div>
          )}

          <hr class="border-[#EBEBEB] w-full mb-6 mt-3" />

          {/* Structured Description */}
          <div class="flex flex-col font-Hanken-Grotesk text-[15px] leading-relaxed text-[#4C4C4C]">
            {colorDisplayName && (
              <div class="mb-4">
                <strong class="font-bold text-[#212121] block mb-1">Nome da cor:</strong>
                <span>{colorDisplayName}</span>
              </div>
            )}
            {remainingHtml && (
              <div class="flex flex-col">
                <strong class="font-bold text-[#212121] block mb-1">Descrição:</strong>
                <div
                  class={clx(
                    "[&_strong]:font-bold [&_strong]:text-[#212121] [&_strong]:mb-1 [&_strong]:block",
                    "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_li]:mb-1 [&_li]:text-[#4C4C4C]",
                    "[&_p]:mb-4 last:[&_p]:mb-0",
                  )}
                  // deno-lint-ignore react-dangerouslysetinnerhtml
                  dangerouslySetInnerHTML={{ __html: remainingHtml }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
