import { useState } from "preact/hooks";
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
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!colors || colors.length === 0) return null;

  const activeColor = colors[selectedIdx] || colors[0];

  // Extrai o nome da cor do <strong> inicial e o resto como descrição
  let colorDisplayName = activeColor.name;
  let remainingHtml = activeColor.descriptionHtml;
  if (activeColor.descriptionHtml) {
    const match = activeColor.descriptionHtml.match(
      /^<strong[^>]*>([\s\S]*?)<\/strong>\s*(?:<br\s*\/?>)?\s*([\s\S]*)$/i,
    );
    if (match) {
      const extracted = match[1].replace(/<[^>]+>/g, "").trim();
      if (extracted) {
        colorDisplayName = extracted;
        remainingHtml = match[2].trim();
      }
    }
  }

  // Remove qualquer <br> que tenha ficado isolado no começo da string para evitar espaçamento em branco
  if (remainingHtml) {
    remainingHtml = remainingHtml.replace(/^(?:<br\s*\/?>\s*)+/gi, "");
  }

  return (
    <div id="product-color-details" class="w-full py-8 bg-gray-20 xl:py-[50px]">
      <div
        class={clx(
          "container grid grid-cols-1 max-w-[1280px] bg-white-15 xl:gap-[30px] gap-[10px] px-3 xl:px-5 lg:px-0 xl:h-[540px] rounded",
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
        <div class="lg:order-2 flex flex-col justify-start h-full">
          <h2 class="font-Queens text-[32px] lg:text-[42px] text-[#CE9680] mb-4 lg:mb-[10px] mt-[30px] leading-tight">
            {title}
          </h2>

          {/* Esconde scrollbar do container de tabs */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .color-details-tabs { -ms-overflow-style: none; scrollbar-width: none; }
            .color-details-tabs::-webkit-scrollbar { display: none; }
          `,
            }}
          />

          {/* Tabs Container */}
          <div class="color-details-tabs flex flex-row overflow-x-auto gap-3 pb-1">
            {colors.map((color, i) => {
              const isSelected = i === selectedIdx;
              return (
                <button
                  type="button"
                  key={color.id}
                  onClick={(e) => {
                    setSelectedIdx(i);
                    const btn = e.currentTarget as HTMLElement;
                    btn.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                      inline: "center",
                    });
                  }}
                  class={clx(
                    "flex items-center gap-2 px-[10px] py-[6px] border rounded-sm flex-shrink-0 transition-colors",
                    isSelected
                      ? "border-[#EBEDE2] bg-white bg-[#EBEDE2]"
                      : "border-[#E5E5E5] bg-white hover:border-[#808080]",
                  )}
                >
                  <div class="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 border border-[#f0f0f0]">
                    <Image
                      src={color.swatchUrl}
                      alt={color.name}
                      width={24}
                      height={24}
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="flex flex-col text-left items-start overflow-hidden max-w-[140px]">
                    <span class="text-xs leading-tight truncate w-full font-Hanken-Grotesk text-[#4D5D49]">
                      {color.name}
                    </span>
                    {color.subtitle && (
                      <span
                        class="text-xs leading-tight truncate w-full font-Hanken-Grotesk text-[#4D5D49]"
                        title={color.subtitle}
                      >
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
                  onClick={() => {
                    setSelectedIdx(i);
                    // Auto-scroll the corresponding tab into view
                    if (typeof document !== "undefined") {
                      const tabsEl = document.querySelector(
                        ".color-details-tabs",
                      );
                      if (tabsEl && tabsEl.children[i]) {
                        (tabsEl.children[i] as HTMLElement).scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                          inline: "center",
                        });
                      }
                    }
                  }}
                  aria-label={`Selecionar cor ${i + 1}`}
                  style={{
                    flex: 1,
                    height: "3px",
                    borderRadius: 0,
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    backgroundColor: i === selectedIdx
                      ? "#455C42"
                      : "rgba(25,28,31,0.2)",
                    transition: "background-color 0.3s ease",
                  }}
                />
              ))}
            </div>
          )}

          <hr class="w-full mb-[30px] mt-3" />

          {/* Structured Description */}
          <div class="flex flex-col font-Hanken-Grotesk text-[15px] leading-relaxed text-[#4C4C4C] mx-5 xl:mx-0 pb-5 xl:pb-0">
            {colorDisplayName && (
              <div class="mb-3">
                <strong class="font-bold text-[#2c2c2c] block mb-1 font-Hanken-Grotesk xl:text-[20px]">
                  Nome da cor:
                </strong>
                <span class="font-Hanken-Grotesk xl:text-[16px]">
                  {colorDisplayName}
                </span>
              </div>
            )}
            {remainingHtml && (
              <div class="flex flex-col">
                <strong class="font-bold text-[#212121] block mb-1 font-Hanken-Grotesk xl:text-[20px]">
                  Descrição da cor:
                </strong>
                <div
                  class="font-Hanken-Grotesk xl:text-[16px]"
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
