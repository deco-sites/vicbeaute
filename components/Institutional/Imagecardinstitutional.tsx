import { type ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { useDevice as useDevice } from "@deco/deco/hooks";

export interface ImageDeviceProps {
  image: ImageWidget;
  href?: string;
  alt: string;
  width: number;
  height: number;
}

export interface ImageGroup {
  mobile: ImageDeviceProps;
  tablet: ImageDeviceProps;
  desktop: ImageDeviceProps;
}

export interface Props {
  firstImage: ImageGroup;
  secondImage: ImageGroup;
  thirdImage: ImageGroup;
  fourthImage: ImageGroup;
  text?: string;
}

function ImageCardInstitutional({ firstImage, secondImage, thirdImage, fourthImage, text }: Props) {
  const device = useDevice();

  const renderImageGroup = (imgGroup: ImageGroup) => {
    if (!imgGroup) return null;
    
    if (device === "desktop") {
      return (
        <a href={imgGroup.desktop.href || "#"} class="block w-full h-full">
          <img
            alt={imgGroup.desktop.alt}
            src={imgGroup.desktop.image}
            width={imgGroup.desktop.width}
            height={imgGroup.desktop.height}
            class="w-full h-full object-cover"
          />
        </a>
      );
    }
    if (device === "tablet") {
      return (
        <a href={imgGroup.tablet.href || "#"} class="block w-full h-full">
          <img
            alt={imgGroup.tablet.alt}
            src={imgGroup.tablet.image}
            width={imgGroup.tablet.width}
            height={imgGroup.tablet.height}
            class="w-full h-full object-cover"
          />
        </a>
      );
    }
    if (device === "mobile") {
      return (
        <a href={imgGroup.mobile.href || "#"} class="block w-full h-full">
          <img
            alt={imgGroup.mobile.alt}
            src={imgGroup.mobile.image}
            width={imgGroup.mobile.width}
            height={imgGroup.mobile.height}
            class="w-full h-full object-cover"
          />
        </a>
      );
    }
    return null;
  };

  return (
    <div class="flex flex-col items-center justify-center w-full mb-[30px] gap-[10px]">
      {text && (
        <h2 class="my-[10px] max-w-[381px] h-fit leading-[32px] text-[32px] text-[#CE9680] text-10 font-Queens text-center px-3">
          {text}
        </h2>
      )}

      {/* MOBILE: Layout Masonry Original */}
      <div class="flex md:hidden flex-col w-full gap-[10px]">
        {/* Primeiras duas lado a lado */}
        <div class="flex flex-row w-full gap-[10px] pl-4 lg:pl-[10%]">
          {/* Imagem 1: Mais espaço (2/3) */}
          <div class="flex-[2] overflow-hidden">
            {renderImageGroup(firstImage)}
          </div>
          {/* Imagem 2: Menos espaço (1/3) */}
          <div class="flex-[1] overflow-hidden">
            {renderImageGroup(secondImage)}
          </div>
        </div>

        {/* Outras duas abaixo, lado a lado */}
        <div class="flex flex-row w-full gap-[10px] pr-4 lg:pr-[10%]">
          {/* Imagem 3: Menos espaço (1/3) */}
          <div class="flex-[1] overflow-hidden">
            {renderImageGroup(thirdImage)}
          </div>
          {/* Imagem 4: Mais espaço (2/3) */}
          <div class="flex-[2] overflow-hidden">
            {renderImageGroup(fourthImage)}
          </div>
        </div>
      </div>

      {/* DESKTOP: Carrossel 1 Linha (Scroll) */}
      <div class="hidden md:flex overflow-x-auto w-full gap-[20px] mt-[40px] px-[10vw] hide-scrollbar snap-x snap-mandatory">
        {[firstImage, secondImage, thirdImage, fourthImage].map((imgProps, i, arr) => {
          if (!imgProps) return null;
          const isLast = i === arr.length - 1;
          return (
            <div 
               key={i} 
               class={`flex-shrink-0 w-[40vw] max-w-[450px] aspect-square snap-center overflow-hidden ${isLast ? 'pr-[10vw] box-content' : ''}`}
            >
              {renderImageGroup(imgProps)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ImageCardInstitutional;
