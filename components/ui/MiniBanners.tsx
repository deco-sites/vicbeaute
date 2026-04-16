import type { ImageWidget as LiveImage } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Slider from "../../components/ui/MiniBannersSlider.tsx";
import SliderJS from "../../islands/SliderJS.tsx";
import { useId } from "../../sdk/useId.ts";

export interface ResponsiveImage {
  /** @description imagem versão desktop */
  desktop: LiveImage;
  /** @description largura versão desktop */
  desktopWidth: number;
  /** @description altura versão desktop */
  desktopHeight: number;

  /** @description imagem versão mobile */
  mobile: LiveImage;
  /** @description largura versão mobile */
  mobileWidth: number;
  /** @description altura versão mobile */
  mobileHeight: number;

  /** @description texto alternativo */
  alt: string;

  /** @description Link do banner */
  href?: string;

  /** @description Texto abaixo da imagem */
  caption?: string;
}

export interface SliderConfig {
  mobile?: {
    /** @description slider mobile tem setas */
    arrow?: boolean;
    /** @description slider mobile tem dots */
    dots?: boolean;
  };
  desktop?: {
    /** @description slider desktop tem setas */
    arrow?: boolean;
    /** @description slider desktop tem dots */
    dots?: boolean;
  };
}

export interface Props {
  header?: {
    title?: string;
    description?: string;
    seeMore?: {
      label?: string;
      href?: string;
    };
  };
  images?: ResponsiveImage[];
  slider?: SliderConfig;
}

export default function MiniBanners({ images, slider, header }: Props) {
  const id = useId();

  return (
    <div
      id={id}
      class="flex flex-col relative container mx-auto lg:pb-14 mb-7 lg:mb-0 mt-5 lg:mt-9 gap-vc-10 xl:max-w-vc-1280"
    >
      <div class="flex justify-between items-start pl-vc-15 xl:pl-[0px]">
        <div class="flex flex-col w-full sm:mb-3">
          <h2 class="flex lg:justify-center lg:align-center font-Queens xl:text-[36px] text-[32px] text-[#CE9680]">
            {header?.title}
          </h2>
          {header?.description && (
            <span class="mt-3 text-secondary">{header?.description}</span>
          )}
        </div>
        {header?.seeMore?.label && (
          <a
            href={header?.seeMore.href}
            class="bg-transparent border border-gray-1 rounded text-sm full-phone:text-xs text-gray-1 h-7 w-full max-w-20 px-1 flex items-center justify-center"
          >
            {header?.seeMore?.label}
          </a>
        )}
      </div>

      <Slider class="carousel carousel-end w-full justify-between max-sm:px-4 max-lg:px-6 lg:ml-0 gap-2 xl:gap-9 px-4">
        {images &&
          images.map((image, index) => (
            <Slider.Item
              key={index}
              index={index}
              data-cy={`categoria-${index + 1}`}
              class="flex flex-col gap-2 carousel-item transition-3s hover:opacity-50"
            >
              <a href={image.href}>
                <figure class="flex flex-col items-center text-center">
                  <Image
                    class="hidden lg:block max-w-370 sm-desktop:max-w-[230px] rounded overflow-hidden"
                    src={image.desktop}
                    alt={image.alt}
                    width={image.desktopWidth}
                    height={image.desktopHeight}
                    loading="lazy"
                  />
                  <Image
                    class="block lg:hidden max-w-full rounded overflow-hidden"
                    src={image.mobile}
                    alt={image.alt}
                    width={image.mobileWidth}
                    height={image.mobileHeight}
                    loading="lazy"
                  />
                  {image.caption && (
                    <figcaption
                      data-cy={`categoria-caption-${index + 1}`}
                      class="mt-1 text-[16px] text-black font-Hanken-Grotesk"
                    >
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              </a>
            </Slider.Item>
          ))}
      </Slider>

      {slider?.mobile?.arrow && (
        <div class="absolute top-1/2 -translate-y-1/2 w-full flex justify-between lg:hidden">
          <div class="flex items-center justify-center z-10">
            <Slider.PrevButton class="btn btn-circle glass">
              <Icon
                class="text-base-100"
                size={24}
                id="left-arrow-category"
                strokeWidth={3}
              />
            </Slider.PrevButton>
          </div>
          <div class="flex items-center justify-center z-10">
            <Slider.NextButton class="btn btn-circle glass">
              <Icon
                class="text-base-100"
                size={24}
                id="right-arrow-category"
                strokeWidth={3}
              />
            </Slider.NextButton>
          </div>
        </div>
      )}

      {slider?.desktop?.arrow && (
        <div class="absolute top-1/2 -translate-y-1/2 w-full justify-between hidden lg:flex">
          <div class="flex items-center justify-center z-10">
            <Slider.PrevButton class=" absolute left-[-40px]">
              <Icon
                class="text-base-100"
                size={24}
                id="left-arrow-category"
                strokeWidth={3}
              />
            </Slider.PrevButton>
          </div>
          <div class="flex items-center justify-center z-10">
            <Slider.NextButton class="absolute right-[-40px]">
              <Icon
                class="text-base-100"
                size={24}
                id="right-arrow-category"
                strokeWidth={3}
              />
            </Slider.NextButton>
          </div>
        </div>
      )}

      <div
        className={`relative flex w-full max-w-[1440px] px-5 lg:px-0 mx-auto justify-center z-10 xl:mt-2 ${
          slider?.mobile?.dots ? "block" : "hidden"
        } ${slider?.desktop?.dots ? "lg:flex" : "lg:hidden"}`}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .minibanners-dots-tracker [data-dot] {
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
              .minibanners-dots-tracker [data-dot]:disabled {
                background-color: #455C42 !important;
              }
            `,
          }}
        />
        <ul class="flex w-full gap-0 minibanners-dots-tracker">
          {images &&
            images.map((_, index) => (
              <li key={index} class="carousel-item flex-1">
                <Slider.Dot index={index} class="" />
              </li>
            ))}
        </ul>
      </div>

      <SliderJS rootId={id} infinite />
    </div>
  );
}
