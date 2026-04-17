import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Slider from "../../components/product/SliderCarousel.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";

/**
 * @titleBy alt
 */
export interface Banner {
  /** @description desktop otimized image */
  desktop: ImageWidget;
  widthDesktop?: number;
  heightDesktop?: number;
  /*
   * @description Título do banner
   * @format textarea
   */
  /** @description Ativar texto HTML do banner? */
  showContent?: boolean;
  title?: string;
  /*
   * @description Texto abaixo do título
   * @format textarea
   */
  text?: string;
  /** @description Texto do botão */
  cto?: string;
  /** @description mobile otimized image */
  mobile: ImageWidget;
  widthMobile?: number;
  heightMobile?: number;
  /** @description Image's alt text */
  alt: string;
  action?: {
    /** @description when user clicks on the image, go to this link */
    href: string;
  };
}

const FALLBACK_DESKTOP = "/static/image/1440x602.png";
const FALLBACK_MOBILE = "/static/image/Rectangle 3.png";

export interface Props {
  images?: Banner[];
  preload?: boolean;
  interval?: number;
  /** @title Exibir Setas (Desktop) */
  arrowsDesktop?: boolean;
  /** @title Exibir Setas (Mobile) */
  arrowsMobile?: boolean;
  /** @title Exibir Indicadores / Dots (Desktop) */
  dotsDesktop?: boolean;
  /** @title Exibir Indicadores / Dots (Mobile) */
  dotsMobile?: boolean;
  /** @title Exibir Conteúdo (Texto e Botão) */
  showContent?: boolean;
}

function BannerItem(
  { image, lcp, id, showContent }: {
    image: Banner;
    lcp?: boolean;
    id: string;
    showContent?: boolean;
  },
) {
  const {
    alt,
    mobile,
    desktop,
    action,
    title,
    text,
    cto,
    widthDesktop,
    heightDesktop,
    widthMobile,
    heightMobile,
  } = image;
  const params = { promotion_name: image.alt };

  const selectPromotionEvent = useSendEvent({
    on: "click",
    event: { name: "select_promotion", params },
  });

  const viewPromotionEvent = useSendEvent({
    on: "view",
    event: { name: "view_promotion", params },
  });

  return (
    <a
      id={id}
      {...selectPromotionEvent}
      href={action?.href ?? "#"}
      class="relative w-full overflow-hidden pb-14 lg:pb-0 block"
    >
      <Picture preload={lcp} {...viewPromotionEvent}>
        <Source
          media="(max-width: 767px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={mobile || FALLBACK_MOBILE}
          width={widthMobile || 360}
          height={heightMobile || 600}
        />
        <Source
          media="(min-width: 768px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={desktop || FALLBACK_DESKTOP}
          width={widthDesktop || 1440}
          height={heightDesktop || 600}
        />
        <img
          class="object-cover w-full h-full"
          loading={lcp ? "eager" : "lazy"}
          src={desktop || FALLBACK_DESKTOP}
          alt={alt}
        />
      </Picture>

      {/* Conteúdo do Banner */}
      {showContent && (
        <div class="absolute left-[20px] bottom-[39px] flex flex-col gap-2 z-10 max-w-[80%]">
          {title && (
            <h2 class="text-white text-2xl font-bold leading-tight">
              {title}
            </h2>
          )}

          {text && (
            <p class="text-white text-sm leading-snug">
              {text}
            </p>
          )}

          {cto && (
            <span class="mt-2 inline-block bg-white text-black px-4 py-2 text-sm font-medium w-max">
              {cto}
            </span>
          )}
        </div>
      )}
    </a>
  );
}

function Buttons({ desktop, mobile }: { desktop: boolean; mobile: boolean }) {
  const displayClass = clx(
    desktop ? "sm:flex" : "sm:hidden",
    mobile ? "flex" : "hidden",
  );

  return (
    <>
      <div
        class={clx(
          "items-center justify-center z-10 col-start-1 row-start-2 ml-4",
          displayClass,
        )}
      >
        <Slider.PrevButton
          class="btn btn-neutral btn-outline btn-circle no-animation btn-sm border-none arrow-carousel bg-white/50 hover:bg-white text-black"
          disabled={false}
        >
          <Icon id="right-arrow-carousel" class="rotate-180" />
        </Slider.PrevButton>
      </div>

      <div
        class={clx(
          "items-center justify-center z-10 col-start-3 row-start-2 mr-4",
          displayClass,
        )}
      >
        <Slider.NextButton
          class="btn btn-neutral btn-outline btn-circle no-animation btn-sm border-none arrow-carousel bg-white/50 hover:bg-white text-black"
          disabled={false}
        >
          <Icon id="right-arrow-carousel" />
        </Slider.NextButton>
      </div>
    </>
  );
}

function Dots(
  { images, desktop, mobile }: {
    images?: Banner[];
    desktop: boolean;
    mobile: boolean;
  },
) {
  const displayClass = clx(
    desktop ? "sm:flex" : "sm:hidden",
    mobile ? "flex" : "hidden",
  );

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .carousel-dots-tracker [data-dot] {
            background-color: rgba(255,255,255,0.4) !important;
            width: 100% !important;
            height: 3px !important;
            border-radius: 0 !important;
            opacity: 1 !important;
            box-shadow: none !important;
            border: none !important;
            outline: none !important;
            transition: background-color 0.3s ease !important;
          }
          .carousel-dots-tracker [data-dot]:disabled {
            background-color: white !important;
          }
        `,
        }}
      />
      <div
        class={clx(
          "absolute bottom-[70px] lg:bottom-[30px] left-0 w-full px-5 lg:px-20 justify-center col-span-full row-start-3 z-10",
          displayClass,
        )}
      >
        <ul class="flex w-full max-w-[1440px] gap-0 carousel-dots-tracker">
          {images?.map((_, index) => (
            <li key={index} class="carousel-item flex-1">
              <Slider.Dot index={index} class="" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Carousel(
  {
    images = [],
    preload,
    interval,
    arrowsDesktop = true,
    arrowsMobile = false,
    dotsDesktop = true,
    dotsMobile = true,
    showContent = true,
  }: Props,
) {
  const id = useId();

  return (
    <div
      id={id}
      class="relative max-w-vc-1920 mx-auto w-full grid grid-cols-[48px_1fr_48px] sm:grid-cols-[120px_1fr_120px] grid-rows-[1fr_auto_1fr] lg:min-h-[496px] md:min-height-[unset] lg:pb-14 xl:pt-[39px]"
    >
      <Slider class="carousel carousel-center w-full col-span-full row-span-full pt-[38px] xl:pt-0">
        {images.map((image, index) => (
          <Slider.Item index={index} class="carousel-item w-full">
            <BannerItem
              image={image}
              lcp={index === 0 && preload}
              id={`${id}::${index}`}
              showContent={showContent}
            />
          </Slider.Item>
        ))}
      </Slider>

      {(arrowsDesktop || arrowsMobile) && (
        <Buttons desktop={arrowsDesktop} mobile={arrowsMobile} />
      )}
      {(dotsDesktop || dotsMobile) && (
        <Dots images={images} desktop={dotsDesktop} mobile={dotsMobile} />
      )}

      <Slider.JS rootId={id} interval={interval && interval * 1e3} infinite />
    </div>
  );
}

export default Carousel;
