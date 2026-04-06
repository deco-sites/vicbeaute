import { type ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { useDevice as useDevice } from "@deco/deco/hooks";

export interface Props {
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
  title?: string;
}

function BannerInstitucional({ tablet, desktop, mobile, title }: Props) {
  const device = useDevice();
  return (
    <div class="cy-banner flex flex-col items-center justify-center h-fit mt-[40px]">
      {title && (
        <h2 class="mb-[10px] max-w-[381px] h-fit leading-[32px] text-[32px] text-[#CE9680] text-10 font-Queens text-center px-3">
          {title}
        </h2>
      )}

      {device === "desktop" && (
        <img
          alt={desktop.alt}
          src={desktop.image}
          width={desktop.width}
          height={desktop.height}
        />
      )}

      {device === "tablet" && (
        <a href={tablet.href}>
          <img
            class=""
            alt={tablet.alt}
            src={tablet.image}
            width={tablet.width}
            height={tablet.height}
          />
        </a>
      )}

      {device === "mobile" && (
        <a href={mobile.href}>
          <img
            class=""
            alt={mobile.alt}
            src={mobile.image}
            width={mobile.width}
            height={mobile.height}
          />
        </a>
      )}
    </div>
  );
}

export default BannerInstitucional;
