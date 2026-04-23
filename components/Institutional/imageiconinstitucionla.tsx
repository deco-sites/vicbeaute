import { type ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { useDevice as useDevice } from "@deco/deco/hooks";

export interface Props {
  firstImage: {
    mobile: {
      image: ImageWidget;
      href?: string;
      alt: string;
      width: number;
      height: number;
    };
    tablet: {
      image: ImageWidget;
      href?: string;
      alt: string;
      width: number;
      height: number;
    };
    desktop: {
      image: ImageWidget;
      href?: string;
      alt: string;
      width: number;
      height: number;
    };
  };
  secondImage: {
    mobile: {
      image: ImageWidget;
      href?: string;
      alt: string;
      width: number;
      height: number;
    };
    tablet: {
      image: ImageWidget;
      href?: string;
      alt: string;
      width: number;
      height: number;
    };
    desktop: {
      image: ImageWidget;
      href?: string;
      alt: string;
      width: number;
      height: number;
    };
  };
  text?: string;
}

function BannerInstitucional({ firstImage, text, secondImage }: Props) {
  const device = useDevice();
  return (
    <div class="cy-banner flex flex-col items-center justify-center h-fit mt-[40px] mb-[40px]">
      {device === "desktop" && (
        <img
          alt={firstImage.desktop.alt}
          src={firstImage.desktop.image}
          width={firstImage.desktop.width}
          height={firstImage.desktop.height}
        />
      )}

      {device === "tablet" && (
        <a href={firstImage.tablet.href}>
          <img
            class=""
            alt={firstImage.tablet.alt}
            src={firstImage.tablet.image}
            width={firstImage.tablet.width}
            height={firstImage.tablet.height}
          />
        </a>
      )}

      {device === "mobile" && (
        <a href={firstImage.mobile.href}>
          <img
            class=""
            alt={firstImage.mobile.alt}
            src={firstImage.mobile.image}
            width={firstImage.mobile.width}
            height={firstImage.mobile.height}
          />
        </a>
      )}

      {text && (
        <h2 class="my-[10px] max-w-[381px] h-fit leading-[32px] text-[32px] text-[#CE9680] text-10 font-Queens text-center px-3">
          {text}
        </h2>
      )}

      {device === "desktop" && (
        <img
          alt={secondImage.desktop.alt}
          src={secondImage.desktop.image}
          width={secondImage.desktop.width}
          height={secondImage.desktop.height}
        />
      )}

      {device === "tablet" && (
        <a href={secondImage.tablet.href}>
          <img
            class=""
            alt={secondImage.tablet.alt}
            src={secondImage.tablet.image}
            width={secondImage.tablet.width}
            height={secondImage.tablet.height}
          />
        </a>
      )}

      {device === "mobile" && (
        <a href={secondImage.mobile.href}>
          <img
            class=""
            alt={secondImage.mobile.alt}
            src={secondImage.mobile.image}
            width={secondImage.mobile.width}
            height={secondImage.mobile.height}
          />
        </a>
      )}
    </div>
  );
}

export default BannerInstitucional;
