import type { Product } from "apps/commerce/types.ts";
import ProductSlider from "../../components/product/ProductSlider.tsx";
import { useId } from "../../sdk/useId.ts";
import TabbedSliderJS from "../../islands/TabbedSliderJS.tsx";
import { clx } from "../../sdk/clx.ts";

export interface TabData {
  /** @description Título da Aba (ex: Stick Tudo, Corretivo) */
  label: string;
  /** @description Produtos para exibir nesta aba */
  products: Product[] | null;
}

export interface Props {
  /**
   * @description Título principal da seção
   * @default Novidades
   */
  title?: string;
  /**
   * @description As abas que renderizarão os sliders
   */
  tabs?: TabData[];
  /**
   * @description Cor do Título
   * @default #CE9680
   * @format color-input
   */
  titleColor?: string;
}

export default function TabbedProductSlider({ 
  title = "Novidades", 
  tabs = [], 
  titleColor = "#CE9680" 
}: Props) {
  const rootId = useId();

  if (!tabs || tabs.length === 0) return null;

  return (
    <div id={rootId} class="w-full flex flex-col py-10 xl:py-16 bg-[#F4F4F4]">
      {/* Title */}
      {title && (
        <h2 
          class="text-center font-Queens text-[36px] lg:text-[44px] leading-tight mb-8"
          style={{ color: titleColor }}
        >
          {title}
        </h2>
      )}

      {/* Tabs Navigation */}
      <div class="w-full overflow-x-auto no-scrollbar mb-8 lg:mb-12">
        <div class="flex justify-start lg:justify-center items-center gap-6 lg:gap-10 px-5 lg:px-0 w-max mx-auto border-b border-[#E1E1E1]">
          {tabs.map((tab, index) => {
            const isActive = index === 0;
            return (
              <button
                key={index}
                data-tab-button={index}
                class={clx(
                  " font-hanken-grotesk pb-2 outline-none whitespace-nowrap text-base lg:text-[18px] transition-all border-b-2",
                  isActive
                    ? "border-[#455C42] text-[#455C42] font-medium"
                    : "border-transparent text-[#8a8a8a] hover:text-[#455C42]"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents -> Sliders */}
      <div class="w-full max-w-[1440px] px-0 lg:px-20 mx-auto">
        {tabs.map((tab, index) => (
          <div
            key={index}
            data-tab-content={index}
            class={clx("w-full transition-opacity duration-300", index === 0 ? "block" : "hidden")}
          >
            {tab.products && tab.products.length > 0 ? (
              <ProductSlider 
                products={tab.products} 
                itemListName={title} 
              />
            ) : (
              <div class="flex justify-center items-center h-40 text-[#8a8a8a] text-sm">
                Nenhum produto cadastrado para "{tab.label}"
              </div>
            )}
          </div>
        ))}
      </div>

      <TabbedSliderJS rootId={rootId} />
    </div>
  );
}
