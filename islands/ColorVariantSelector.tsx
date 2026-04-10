import { useSignal } from "@preact/signals";
import { clx } from "../sdk/clx.ts";

export interface ColorOption {
  /** URL do produto desta cor */
  url: string;
  /** Nome da cor (ex: "Corada") */
  name: string;
  /** Subtítulo da cor (ex: "Coral quente") */
  subtitle: string;
  /** URL da imagem usada como swatch */
  imgUrl: string;
}

interface Props {
  colors: ColorOption[];
  /** URL relativa do produto atualmente selecionado (ex: "/produto/corada/p") */
  selectedUrl: string;
}

const ChevronUp = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export default function ColorVariantSelector({ colors, selectedUrl }: Props) {
  const isOpen = useSignal(true);

  // Encontra o index do produto selecionado pela URL atual
  const initialIndex = Math.max(
    0,
    colors.findIndex((c) => {
      try {
        const cUrl = new URL(c.url, "http://localhost");
        const selUrl = new URL(selectedUrl ?? "/", "http://localhost");
        return cUrl.pathname === selUrl.pathname;
      } catch {
        return c.url === selectedUrl;
      }
    }),
  );

  const selectedIdx = useSignal(initialIndex);

  if (!colors.length) return null;

  const selected = colors[selectedIdx.value] ?? colors[0];

  const navigate = (index: number) => {
    selectedIdx.value = index;
    const color = colors[index];
    if (color?.url) {
      globalThis.window.location.href = color.url;
    }
  };

  return (
    <div class="flex flex-col gap-[10px] w-full mt-2">
      {/* Label */}
      <span class="text-sm text-[#212121]">
        Selecione a cor de desejo
      </span>

      {/* ── Bolinhas de cor ── */}
      <div class="flex flex-row gap-[6px] flex-wrap">
        {colors.map((color, i) => {
          const isSelected = i === selectedIdx.value;
          return (
            <button
              type="button"
              key={i}
              onClick={() => navigate(i)}
              title={color.name}
              aria-label={`Selecionar cor: ${color.name}`}
              class={clx(
                "w-[30px] h-[30px] rounded-full flex-shrink-0 transition-all duration-150 overflow-hidden",
                isSelected
                  ? "ring-[2.5px] ring-offset-[2px] ring-[#888]"
                  : "ring-0 hover:ring-[2px] hover:ring-offset-[2px] hover:ring-[#bbb]",
              )}
            >
              <img
                src={color.imgUrl}
                alt={color.name}
                width={30}
                height={30}
                class="w-full h-full object-cover"
                loading="eager"
              />
            </button>
          );
        })}
      </div>

      {/* ── Dropdown expandível ── */}
      <div class="border border-[#E2E2E2] rounded-lg overflow-hidden w-full">
        {/* Header: item selecionado + toggle */}
        <button
          type="button"
          onClick={() => {
            isOpen.value = !isOpen.value;
          }}
          class="w-full flex items-center gap-3 px-4 py-[10px] bg-white select-none"
          aria-expanded={isOpen.value}
        >
          {/* Swatch circle 40px */}
          <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-[#F0F0F0]">
            <img
              src={selected?.imgUrl}
              alt={selected?.name}
              width={40}
              height={40}
              class="w-full h-full object-cover"
            />
          </div>

          {/* Texts */}
          <div class="flex flex-col flex-1 text-left overflow-hidden">
            <span class="text-sm font-semibold text-[#212121] leading-tight truncate">
              {selected?.name}
            </span>
            <span class="text-xs text-[#777] leading-tight truncate">
              {selected?.subtitle}
            </span>
          </div>

          {/* Chevron */}
          <span
            class={clx(
              "text-[#444] flex-shrink-0 transition-transform duration-200",
              isOpen.value ? "" : "rotate-180",
            )}
          >
            <ChevronUp />
          </span>
        </button>

        {/* List: all color options */}
        {isOpen.value && (
          <div class="border-t border-[#EBEBEB] max-h-[240px] overflow-y-auto">
            {colors.map((color, i) => {
              const isSelected = i === selectedIdx.value;
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => navigate(i)}
                  class={clx(
                    "w-full flex items-center gap-3 px-4 py-[10px] transition-colors text-left",
                    i > 0 ? "border-t border-[#F2F2F2]" : "",
                    isSelected
                      ? "bg-[#F4F0EB]"
                      : "bg-white hover:bg-[#FAFAFA]",
                  )}
                >
                  {/* Swatch circle 36px */}
                  <div class="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-[#F0F0F0]">
                    <img
                      src={color.imgUrl}
                      alt={color.name}
                      width={36}
                      height={36}
                      class="w-full h-full object-cover"
                    />
                  </div>

                  {/* Texts */}
                  <div class="flex flex-col text-left overflow-hidden">
                    <span class="text-sm font-semibold text-[#212121] leading-tight truncate">
                      {color.name}
                    </span>
                    <span class="text-xs text-[#777] leading-tight truncate">
                      {color.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
