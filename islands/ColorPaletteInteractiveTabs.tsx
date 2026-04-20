import { useState } from "preact/hooks";
import { clx } from "../sdk/clx.ts";

export interface Tab {
  /**
   * @title Nome da Aba
   * @description Ex: Frio, Claro, Suave
   */
  label: string;
  /**
   * @title Descrição
   * @description Ex: Para pessoas com subtons frios, como azulados, na pele.
   * @format textarea
   */
  description: string;
}

export interface Props {
  title: string;
  tabs: Tab[];
}

export default function ColorPaletteInteractiveTabs({ title, tabs }: Props) {
  const [activeTab, setActiveTab] = useState(0);

  if (!tabs || tabs.length === 0) return null;

  return (
    <div class="flex flex-col items-center w-full">
      {/* Container das Abas (Frio, Claro, Suave...) */}
      <div class="flex flex-row items-center justify-center gap-3 lg:gap-4 w-full">
        {tabs.map((tab, idx) => {
          const isActive = idx === activeTab;
          return (
            <button
              type="button"
              key={idx}
              onClick={() => setActiveTab(idx)}
              class={clx(
                "font-Queens text-[18px] lg:text-[20px] px-8 lg:px-10 py-[6px] lg:py-2 min-w-[100px] transition-colors border",
                isActive
                  ? "border-[#DCDCDC] text-black-5 bg-transparent" // Ativo com borda ou sem? O design original mostra borda contínua. Vamos usar a borda.
                  : "border-[#E5E5E5] text-black-20 bg-transparent hover:border-[#DCDCDC]", // Inativo
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Conteúdo Abaixo (Título + Ícone + Aba Ativa) */}
      <div class="mt-8 lg:mt-10 flex flex-col items-center">
        <div class="flex items-center justify-center gap-2 lg:gap-3 mb-2 font-Queens text-[32px] lg:text-[40px]">
          <span class="text-pink-15">{title}</span>

          {/* Ícone de florzinha / sparkle */}
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="text-[#D3DAD0] fill-current mx-1"
          >
            <path d="M7.5 0C8.5 2.5 10.5 4.5 13 4.5L15 5C12.5 6 10.5 8 9.5 10.5L9 12.5C8 10 6 8 3.5 7L1.5 6.5C4 5.5 6 3.5 7 1L7.5 0Z" />
          </svg>

          <span class="text-black-10">{tabs[activeTab].label}</span>
        </div>

        {/* Descrição em negrito */}
        <p class="font-bold text-[14px] lg:text-[15px] text-black-5 text-center max-w-[500px]">
          {tabs[activeTab].description}
        </p>
      </div>
    </div>
  );
}
