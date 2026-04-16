import type { ImageWidget as LiveImage } from "apps/admin/widgets.ts";
import Icon from "../../components/ui/Icon.tsx";
import Slider from "../../components/ui/Slider.tsx";
import SliderJS from "../../islands/SliderJS.tsx";
import { useId } from "../../sdk/useId.ts";

/**
 * @titleBy title
 */
export interface CardItem {
  /** @description Imagem da versão Desktop (usada também como fallback mobile) */
  desktopImage: LiveImage;
  /** @description Imagem da versão Mobile */
  mobileImage: LiveImage;
  /** @description Texto alternativo (Acessibilidade e SEO) */
  alt?: string;
  /** @description Título do card */
  title: string;
  /** @description Texto descritivo abaixo do título */
  text?: string;
  /** @description Texto do Botão */
  buttonText?: string;
  /** @description Link do Botão */
  buttonLink?: string;
}

export interface Props {
  /** @description Lista de cards do slider */
  cards?: CardItem[];
  /** @description Mostrar Setas de navegação no Desktop */
  arrowsDesktop?: boolean;
  /** @description Mostrar Setas de navegação no Mobile */
  arrowsMobile?: boolean;
  /** @description Mostrar trilho de pontos (Dots) no Desktop */
  dotsDesktop?: boolean;
  /** @description Mostrar trilho de pontos (Dots) no Mobile */
  dotsMobile?: boolean;
  /** @description Intervalo do autoplay em segundos (deixe vazio para desativar) */
  interval?: number;
}

export default function CardSlider(
  {
    cards = [],
    arrowsDesktop = true,
    arrowsMobile = false,
    dotsDesktop = true,
    dotsMobile = true,
    interval,
  }: Props,
) {
  const id = useId();

  if (!cards || cards.length === 0) return null;

  return (
    <div
      id={id}
      class="relative w-full flex flex-col overflow-hidden py-4"
    >
      {/* SLIDER */}
      <Slider class="carousel carousel-center w-full gap-4 px-4 lg:px-8">
        {cards.map((card, index) => (
          <Slider.Item
            key={index}
            index={index}
            class="carousel-item"
          >
            {/* --- MOBILE CARD (280x460) --- */}
            <a
              href={card.buttonLink || "#"}
              class="card-slider-item-mobile lg:hidden relative flex-col overflow-hidden flex-shrink-0 flex bg-[#ffffff] rounded-md"
              style={{ width: "280px", height: "460px" }}
            >
              <div class="w-full overflow-hidden">
                <img
                  class="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  src={card.mobileImage}
                  alt={card.alt || card.title}
                />
              </div>
              <div class="flex flex-col items-center justify-start text-center px-3 pt-3 pb-[10px] flex-1">
                {card.title && (
                  <h3 class="text-[#455C42] text-[20px] font-Queens font-semibold leading-tight max-w-[240px]">
                    {card.title}
                  </h3>
                )}
                {card.text && (
                  <p class="text-[#191C1F] text-xs leading-snug mt-[10px]">
                    {card.text}
                  </p>
                )}
                {card.buttonText && (
                  <span class="mt-2 bg-[#455C42] text-white-15 text-xs font-semibold px-[53px] py-4 rounded-md tracking-wider">
                    {card.buttonText}
                  </span>
                )}
              </div>
            </a>

            {/* --- DESKTOP CARD (620x350) --- */}
            <a
              href={card.buttonLink || "#"}
              class="card-slider-item-desktop hidden lg:flex relative overflow-hidden flex-shrink-0"
              style={{ width: "620px", height: "350px" }}
            >
              <img
                class="absolute inset-0 w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                src={card.desktopImage}
                alt={card.alt || card.title}
              />
              <div class="absolute inset-0 py-8 xl:py-[72px] xl:pl-5 flex flex-col justify-center items-start w-1/2 min-w-[320px] xl:min-w-[unset] xl:max-w-[270px] xl:gap-[10px]">
                {card.title && (
                  <h3 class="text-[#FFFFFF] text-[32px]  xl:font-Hanken-Grotesk xl:leading-[1.0] leading-tight font-semibold">
                    {card.title}
                  </h3>
                )}
                {card.text && (
                  <p class="text-[#FFFFFF] xl:text-[16px] text-sm leading-snug mt-3 xl:mt-0">
                    {card.text}
                  </p>
                )}
                {card.buttonText && (
                  <span class="mt-6 xl:mt-0 bg-[#FFFFFF] text-[#191C1F] px-8 py-3 rounded-sm text-[13px] xl:text-[16px] xl:leading-[1.5] font-bold tracking-wider">
                    {card.buttonText}
                  </span>
                )}
              </div>
            </a>
          </Slider.Item>
        ))}
      </Slider>

      {/* ARROWS */}
      {(arrowsDesktop || arrowsMobile) && cards.length > 1 && (
        <div
          class={[
            "absolute top-1/2 -translate-y-1/2 w-full flex justify-between items-center pointer-events-none z-10 px-1",
            arrowsMobile ? "flex" : "hidden",
            arrowsDesktop ? "lg:flex" : "lg:hidden",
          ].join(" ")}
        >
          <Slider.PrevButton class="btn btn-circle bg-white hover:bg-white text-[#191C1F] pointer-events-auto border-none w-10 h-10 min-h-10 shadow-md opacity-80 hover:opacity-100">
            <Icon
              class="rotate-180"
              size={20}
              id="right-arrow-category"
              strokeWidth={2}
            />
          </Slider.PrevButton>
          <Slider.NextButton class="btn btn-circle bg-white hover:bg-white text-[#191C1F] pointer-events-auto border-none w-10 h-10 min-h-10 shadow-md opacity-80 hover:opacity-100">
            <Icon
              size={20}
              id="right-arrow-category"
              strokeWidth={2}
            />
          </Slider.NextButton>
        </div>
      )}

      {/* DOTS */}
      {(dotsDesktop || dotsMobile) && cards.length > 1 && (
        <>
          <style
            dangerouslySetInnerHTML={{
              __html: `
              .cardslider-dots-tracker [data-dot] {
                background-color: rgba(25, 28, 31, 0.2) !important;
                width: 100% !important;
                height: 3px !important;
                border-radius: 0 !important;
                opacity: 1 !important;
                box-shadow: none !important;
                border: none !important;
                outline: none !important;
                transition: background-color 0.3s ease !important;
              }
              .cardslider-dots-tracker [data-dot]:disabled {
                background-color: #455C42 !important;
              }
              @media (min-width: 1024px) {
                #${id} .card-slider-item {
                  width: 620px !important;
                  height: 350px !important;
                }
              }
            `,
            }}
          />
          <div
            class={[
              "w-full px-4 lg:px-8 mx-auto justify-center z-10 mt-2 lg:mt-[6px]",
              dotsMobile ? "flex" : "hidden",
              dotsDesktop ? "lg:flex" : "lg:hidden",
            ].join(" ")}
          >
            <ul class="flex w-full lg:max-w-[351px] gap-0 cardslider-dots-tracker">
              {cards.map((_, index) => (
                <li key={index} class="carousel-item flex-1">
                  <Slider.Dot index={index} class="" />
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <SliderJS rootId={id} interval={interval && interval * 1e3} infinite />
    </div>
  );
}
