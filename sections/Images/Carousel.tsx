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
  arrows?: boolean;
  dots?: boolean;
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
      class="relative w-full overflow-hidden pb-14 lg:pb-0"
    >
      <Picture preload={lcp} {...viewPromotionEvent}>
        <img
          class="md:hidden w-full"
          src={mobile || FALLBACK_MOBILE}
          width={widthMobile}
          height={heightMobile}
        />
        <img
          class="hidden md:block"
          src={desktop || FALLBACK_DESKTOP}
          alt={alt}
          width={widthDesktop}
          height={heightDesktop}
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
              aaaaaaaaaa
            </p>
          )}

          {cto && (
            <span class="mt-2 inline-block bg-white text-black px-4 py-2 text-sm font-medium">
              {cto}
            </span>
          )}
        </div>
      )}
    </a>
  );
}

function Buttons() {
  return (
    <>
      <div class="hidden sm:flex items-center justify-center z-10 col-start-1 row-start-2">
        <Slider.PrevButton
          class="btn btn-neutral btn-outline btn-circle no-animation btn-sm border-none arrow-carousel"
          disabled={false}
        >
          <Icon id="right-arrow-carousel" class="rotate-180" />
        </Slider.PrevButton>
      </div>

      <div class="hidden sm:flex items-center justify-center z-10 col-start-3 row-start-2">
        <Slider.NextButton
          class="btn btn-neutral btn-outline btn-circle no-animation btn-sm border-none arrow-carousel"
          disabled={false}
        >
          <Icon id="right-arrow-carousel" />
        </Slider.NextButton>
      </div>
    </>
  );
}

function Dots({ images }: { images?: Banner[] }) {
  return (
    <div class="absolute bottom-[20px] lg:bottom-[35px] left-1/2 flex justify-center mt-2 col-span-full row-start-3 -translate-x-1/2">
      <ul class="flex gap-2">
        {images?.map((_, index) => (
          <li key={index} class="carousel-item">
            <Slider.Dot
              index={index}
              class={clx(
                "w-2 h-2 rounded-full transition-all duration-300",
                "bg-[#2D2D2C] opacity-50",
                "disabled:!bg-black disabled:!opacity-100 disabled:ring-2 disabled:!ring-black disabled:ring-offset-2",
              )}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Carousel(
  {
    images = [],
    preload,
    interval,
    arrows = true,
    dots = true,
    showContent = true,
  }: Props,
) {
  const id = useId();

  return (
    <div
      id={id}
      class="relative max-w-vc-1920 mx-auto w-full grid grid-cols-[48px_1fr_48px] sm:grid-cols-[120px_1fr_120px] grid-rows-[1fr_auto_1fr] lg:min-h-[496px] md:min-height-[unset] lg:pb-14"
    >
      <Slider class="carousel carousel-center w-full col-span-full row-span-full">
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
      {arrows && <Buttons />}
      {dots && <Dots images={images} />}
      <Slider.JS rootId={id} interval={interval && interval * 1e3} infinite />
    </div>
  );
}

export default Carousel;
