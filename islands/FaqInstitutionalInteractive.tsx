import { useState } from "preact/hooks";
import { HTMLWidget } from "apps/admin/widgets.ts";

export interface FaqCard {
  /** @title Título da Pergunta */
  question: string;
  /** @title Resposta (Conteúdo) */
  answer: HTMLWidget;
}

export interface FaqProps {
  title: string;
  searchPlaceholder: string;
  cards: FaqCard[];
}

export default function FaqInstitutionalInteractive({ title, searchPlaceholder, cards }: FaqProps) {
  const [searchTerm, setSearchTerm] = useState("");
  // Track open state for each card using its exact index in the original array
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});

  const toggleAccordion = (index: number) => {
    setOpenStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // We filter the cards, but we need to map them back to their original index
  // so the open state matches the correct card even while searching.
  const cardsWithIndex = cards.map((card, idx) => ({ ...card, originalIndex: idx }));
  
  const filteredCards = cardsWithIndex.filter((card) =>
    card.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section class="flex flex-col items-center w-full mt-[40px] mb-[60px] px-[12px]">
      <div class="flex flex-col items-start w-full max-w-[351px] md:max-w-[904px] md:max-h-[939px] md:w-full md:mx-auto md:items-center">
        {/* Título */}
        {title && (
          <h2 class="queens-text text-[32px] text-[#CE9680] leading-[32px] mb-[15px] pt-[57px] md:pt-[56px]">
            {title}
          </h2>
        )}

        {/* Barra de Pesquisa */}
        <div
          class="flex items-center justify-between w-full h-[54px] md:w-[800px] md:h-[54px] rounded-sm px-4 mb-[30px] bg-[#F2F2F2]"
        >
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onInput={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
            class="w-full h-full bg-transparent outline-none font-Hanken-Grotesk text-[#4D5D49] placeholder-[#555] text-[15px]"
          />
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="ml-2 flex-shrink-0 cursor-pointer"
          >
            <path
              d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke="#4D5D49"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21 21L16.65 16.65"
              stroke="#4D5D49"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        {/* Lista de FAQs */}
        <div class="flex flex-col w-full">
          {filteredCards.length === 0 && (
            <p class="font-Hanken-Grotesk text-[#363931] text-[15px]">
              Nenhum resultado encontrado.
            </p>
          )}
          {filteredCards.map((card) => {
            const isOpen = openStates[card.originalIndex];

            return (
              <div
                key={card.originalIndex}
                class="flex flex-col items-center w-full md:w-[800px] h-fit bg-white"
              >
                {/* Card Header (Clickable) */}
                <button
                  onClick={() => toggleAccordion(card.originalIndex)}
                  class="flex items-center justify-between w-full md:w-[800px] min-h-[57px] py-[10px] text-left bg-transparent"
                >
                  <span class="font-Hanken-Grotesk font-bold text-[#4D5D49] text-[15px] pr-4 leading-[20px]">
                    {card.question}
                  </span>

                  <svg
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class={`transform transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <path
                      d="M1 1L7 7L13 1"
                      stroke="#006F4D"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>

                {/* Card Body */}
                <div
                  class={`w-full md:w-[800px] overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[1000px] pb-4" : "max-h-0"
                  }`}
                >
                  <div
                    class="font-Hanken-Grotesk text-[#363931] text-[15px] pt-2"
                    dangerouslySetInnerHTML={{ __html: card.answer }}
                  />
                </div>
                
                {/* Linha Divisória */}
                <hr class="w-full md:w-[800px] border-t border-[#D5D8C2] self-start" />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Estilos fallback */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .queens-text, .queens-text * { font-family: "Queens", serif !important; }
        .font-Hanken-Grotesk, .font-Hanken-Grotesk * { font-family: "Hanken Grotesk", sans-serif !important; }
      `}} />
    </section>
  );
}
