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
      class="relative w-full overflow-hidden flex flex-col mb-10"
    >
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
              <div class="flex flex-col items-center justify-center text-center px-6 py-10 w-full bg-[#f4f4f4]">
                {banner.subtitle && (
                  <span class="text-[#CE9680] text-sm mb-3">
                    {banner.subtitle}
                  </span>
                )}
                {banner.title && (
                  <h2 class="text-[#455C42] text-3xl font-Queens mb-6 leading-[1.1] max-w-[280px]">
                    {banner.title}
                  </h2>
                )}
                {banner.buttonText && (
                  <a
                    href={banner.buttonLink || "#"}
                    class="bg-[#455C42] text-white px-8 py-3 text-sm font-medium transition-opacity rounded-sm uppercase tracking-wider"
                  >
                    {banner.buttonText}
                  </a>
                )}
              </div>
            </div>

            {/* DESKTOP LAYOUT: Duas colunas — esquerda bg + texto, direita imagem */}
            <div class="hidden lg:grid w-full h-[480px]" style="grid-template-columns: 1fr 724px;">
              {/* Coluna esquerda: background neutro + texto */}
              <div class="flex items-center justify-center bg-[#EEEBE6] px-16 xl:px-24">
                <div class="flex flex-col items-start text-left max-w-[420px]">
                  {banner.subtitle && (
                    <span class="text-[#CE9680] text-sm mb-4">
                      {banner.subtitle}
                    </span>
                  )}
                  {banner.title && (
                    <h2 class="text-[#455C42] text-[42px] xl:text-[48px] font-Queens mb-8 leading-[1.05]">
                      {banner.title}
                    </h2>
                  )}
                  {banner.buttonText && (
                    <a
                      href={banner.buttonLink || "#"}
                      class="bg-[#455C42] text-white px-8 py-3 text-sm font-medium hover:bg-[#344632] transition-colors rounded-sm uppercase tracking-wider"
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
            class={`relative lg:absolute bottom-[0px] lg:bottom-[30px] w-full px-5 lg:px-20 mx-auto justify-center z-10 max-w-[1440px] lg:left-1/2 lg:-translate-x-1/2 mt-5 lg:mt-0 
              ${dotsMobile ? "flex" : "hidden"} 
              ${dotsDesktop ? "lg:flex" : "lg:hidden"}`}
          >
            <ul class="flex w-full gap-0 bannerslider-dots-tracker">
              {banners.map((_, index) => (
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
