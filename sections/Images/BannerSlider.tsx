import type { ImageWidget as LiveImage } from "apps/admin/widgets.ts";

import Icon from "../../components/ui/Icon.tsx";
import Slider from "../../components/ui/Slider.tsx";
import SliderJS from "../../islands/SliderJS.tsx";
import { useId } from "../../sdk/useId.ts";

export interface BannerCard {
  /** @description Imagem da versão Desktop */
  desktopImage: LiveImage;
  /** @description Imagem da versão Mobile */
  mobileImage: LiveImage;
  /** @description Texto alternativo (Acessibilidade e SEO) */
  alt?: string;
  /** @description Pequeno texto avermelhado superior */
  subtitle?: string;
  /** @description Título principal */
  title: string;
  /** @description Texto do Botão */
  buttonText?: string;
  /** @description Link do Botão */
  buttonLink?: string;
  /** @description Fundo branco translúcido (white/15). Quando desativado, usa o fundo bege padrão (#EEEBE6) */
  whiteBackground?: boolean;
}

export interface Props {
  /** @description Lista de Banners (Aparece 1 por vez no Slider) */
  banners?: BannerCard[];
  /** @description Mostrar Setas de navegação no Desktop */
  arrowsDesktop?: boolean;
  /** @description Mostrar Setas de navegação no Mobile */
  arrowsMobile?: boolean;
  /** @description Mostrar trilho de pontos (Dots) no Desktop */
  dotsDesktop?: boolean;
  /** @description Mostrar trilho de pontos (Dots) no Mobile */
  dotsMobile?: boolean;
  /** @description Tempo de intervalo (segundos) - deixe vazio para parar o autoplay */
  interval?: number;
}

export default function BannerSlider(
  {
    banners = [],
    arrowsDesktop = true,
    arrowsMobile = true,
    dotsDesktop = true,
    dotsMobile = true,
    interval,
  }: Props,
) {
  const id = useId();

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div
      id={id}
      class="relative w-full flex flex-col mb-10"
    >
      <div class="relative w-full overflow-hidden">
        <Slider class="carousel carousel-center w-full col-span-full row-span-full">
          {banners.map((banner, index) => (
            <Slider.Item
              key={index}
              index={index}
              class="carousel-item w-full"
            >
              {/* MOBILE LAYOUT: Imagem em cima + caixa de texto em baixo */}
              <div class="flex lg:hidden flex-col w-full">
                <img
                  class="object-cover w-full h-auto"
                  loading={index === 0 ? "eager" : "lazy"}
                  src={banner.mobileImage}
                  alt={banner.alt || banner.title}
                />
                <div class="flex flex-col items-center justify-center text-center px-[14px] py-[12px] w-full bg-[#f4f4f4]">
                  {banner.subtitle && (
                    <span class="text-[#CE9680] font-Hanken-Grotesk text-sm mb-2">
                      {banner.subtitle}
                    </span>
                  )}
                  {banner.title && (
                    <h2 class="text-[#455C42] text-3xl text-[24px] font-Hanken-Grotesk mb-[10px] leading-[1.1] max-w-[280px]">
                      {banner.title}
                    </h2>
                  )}
                  {banner.buttonText && (
                    <a
                      href={banner.buttonLink || "#"}
                      class="bg-[#455C42] text-[#EBEDE2] px-[53px] font-Hanken-Grotesk py-4 text-sm font-medium transition-opacity rounded-md tracking-wider"
                    >
                      {banner.buttonText}
                    </a>
                  )}
                </div>
              </div>

              {/* DESKTOP LAYOUT: Duas colunas — esquerda bg + texto, direita imagem */}
              <div
                class="hidden lg:grid w-full h-[480px]"
                style="grid-template-columns: 1fr 724px;"
              >
                {/* Coluna esquerda: background neutro + texto */}
                <div
                  class={`flex items-center justify-center ${
                    banner.whiteBackground ? "bg-white-15" : "bg-[#EEEBE6]"
                  }`}
                >
                  <div class="flex flex-col items-start text-left max-w-[360px] mx-auto">
                    {banner.subtitle && (
                      <span class="text-[#CE9680] xl:tracking-normal xl:leading-[1.2] font-Hanken-Grotesk font-light text-[16px] mb-3">
                        {banner.subtitle}
                      </span>
                    )}
                    {banner.title && (
                      <h2 class="text-[#455C42] text-[42px] xl:text-[48px] font-Queens mb-6 leading-[1.05]
                    xl:leading-[1.0] xl:font-regular">
                        {banner.title}
                      </h2>
                    )}
                    {banner.buttonText && (
                      <a
                        href={banner.buttonLink || "#"}
                        class="bg-[#455C42] text-[#ffffff] px-6 py-3 text-sm xl:font-regular xl: font-hanken-grotesk font-medium transition-colors rounded-md tracking-wider xl:text-[14px]"
                      >
                        {banner.buttonText}
                      </a>
                    )}
                  </div>
                </div>

                {/* Coluna direita: imagem */}
                <div class="overflow-hidden h-full">
                  <img
                    class="object-cover w-full h-full"
                    loading={index === 0 ? "eager" : "lazy"}
                    src={banner.desktopImage}
                    alt={banner.alt || banner.title}
                  />
                </div>
              </div>
            </Slider.Item>
          ))}
        </Slider>

        {/* ARROWS CONTAINER */}
        {(arrowsDesktop || arrowsMobile) && banners.length > 1 && (
          <div
            class={`absolute top-1/2 -translate-y-1/2 w-full justify-between items-center pointer-events-none z-10 px-4 lg:px-10
            ${arrowsMobile ? "flex" : "hidden"} 
            ${arrowsDesktop ? "lg:flex" : "lg:hidden"}`}
          >
            <Slider.PrevButton class="btn btn-circle glass opacity-80 hover:opacity-100 bg-[#EFEFEF] hover:bg-white text-black pointer-events-auto border-none w-10 h-10 min-h-10">
              <Icon
                class="text-base-100 rotate-180"
                size={24}
                id="right-arrow-category"
                strokeWidth={3}
              />
            </Slider.PrevButton>
            <Slider.NextButton class="btn btn-circle glass opacity-80 hover:opacity-100 bg-[#EFEFEF] hover:bg-white text-black pointer-events-auto border-none w-10 h-10 min-h-10">
              <Icon
                class="text-base-100"
                size={24}
                id="right-arrow-category"
                strokeWidth={3}
              />
            </Slider.NextButton>
          </div>
        )}
      </div>
      {/* end overflow-hidden wrapper */}

      {/* DOTS CONTAINER */}
      {(dotsDesktop || dotsMobile) && banners.length > 1 && (
        <>
          <style
            dangerouslySetInnerHTML={{
              __html: `
              .bannerslider-dots-tracker [data-dot] {
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
              .bannerslider-dots-tracker [data-dot]:disabled {
                background-color: #455C42 !important;
              }
            `,
            }}
          />
          <div
            class={`flex w-full lg:max-w-[351px] gap-0 bannerslider-dots-tracker justify-center mx-auto mt-2 lg:mt-[6px] pb-4
              ${dotsMobile ? "flex" : "hidden"}
              ${dotsDesktop ? "lg:flex" : "lg:hidden"}`}
          >
            {banners.map((_, index) => (
              <div key={index} class="carousel-item flex-1">
                <Slider.Dot index={index} class="w-full" />
              </div>
            ))}
          </div>
        </>
      )}

      <SliderJS rootId={id} interval={interval && interval * 1e3} infinite />
    </div>
  );
}
