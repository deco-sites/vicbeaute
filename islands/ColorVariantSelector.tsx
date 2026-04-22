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
  /** URL do useSection para SPA navigations */
  sectionUrl?: string;
}

interface Props {
  colors: ColorOption[];
  /** URL relativa do produto atualmente selecionado (ex: "/produto/corada/p") */
  selectedUrl: string;
  /** Atualizar a URL do navegador ao selecionar a cor? Default: true */
  pushUrl?: boolean;
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

export default function ColorVariantSelector({ colors, selectedUrl, pushUrl = true }: Props) {
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

  return (
    <div 
      class="flex flex-col gap-[10px] w-full mt-2"
      hx-target="closest section"
      hx-swap="outerHTML show:none"
      hx-sync="this:replace"
    >
      {/* Label */}
      <span class="text-sm text-[#212121]">
        Selecione a cor de desejo
      </span>

      {/* ── Bolinhas de cor ── */}
      <div class="flex flex-row gap-[6px] flex-wrap">
        {colors.map((color, i) => {
          const isSelected = i === selectedIdx.value;
          return (
            <a
              key={i}
              href={color.url}
              hx-get={color.sectionUrl}
              hx-push-url={pushUrl ? color.url : undefined}
              onClick={(e) => {
                selectedIdx.value = i;
              }}
              title={color.name}
              aria-label={`Selecionar cor: ${color.name}`}
              class={clx(
                "w-[30px] h-[30px] rounded-full flex-shrink-0 transition-all duration-150 overflow-hidden block",
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
            </a>
          );
        })}
      </div>

      {/* ── Dropdown expandível (details/summary nativo — sem JS) ── */}
      <details class="border border-[#E2E2E2] rounded-lg overflow-hidden w-full group">
        <summary class="flex items-center gap-3 px-4 py-[10px] bg-white-15 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
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

          {/* Chevron: fechado = apontando para baixo, aberto = para cima */}
          <span class="text-[#444] flex-shrink-0 transition-transform duration-200 rotate-180 group-open:rotate-0">
            <ChevronUp />
          </span>
        </summary>

        {/* List: all color options */}
        <div class="border-t border-[#EBEBEB] max-h-[240px] overflow-y-auto">
          {colors.map((color, i) => {
            const isSelected = i === selectedIdx.value;
            return (
              <a
                key={i}
                href={color.url}
                hx-get={color.sectionUrl}
                hx-push-url={pushUrl ? color.url : undefined}
                onClick={(e) => {
                  selectedIdx.value = i;
                }}
                class={clx(
                  "w-full flex items-center gap-3 px-4 py-[10px] transition-colors text-left",
                  i > 0 ? "border-t border-[#F2F2F2]" : "",
                  isSelected
                    ? "bg-[#F4F0EB]"
                    : "bg-white-15 hover:bg-[#FAFAFA]",
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
              </a>
            );
          })}
        </div>
      </details>
    </div>
  );
}
