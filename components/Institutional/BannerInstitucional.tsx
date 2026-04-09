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
}

export interface Props {
  title: string;
}

function BannerInstitucional({ tablet, desktop, mobile }: Props) {
  const device = useDevice();
  return (
    <div class="cy-banner block h-fit mt-2.5  sm:mx-auto w-full pt-14">
      {device === "desktop" && (
        <img
          class="w-full object-cover"
          alt={desktop.alt}
          src={desktop.image}
          width={desktop.width}
          height={desktop.height}
        />
      )}

      {device === "tablet" && (
        <a href={tablet.href}>
          <img
            class="w-full"
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
            class="w-full"
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
