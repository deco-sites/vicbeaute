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
    
    // Auto-fallback: escolhe a melhor imagem disponível se a requirida estiver vazia
    let activeProps = imgGroup.mobile;
    if (device === "desktop" && imgGroup.desktop?.image) activeProps = imgGroup.desktop;
    else if (device === "tablet" && imgGroup.tablet?.image) activeProps = imgGroup.tablet;
    else if (imgGroup.mobile?.image) activeProps = imgGroup.mobile;
    else if (imgGroup.desktop?.image) activeProps = imgGroup.desktop;
    else activeProps = imgGroup.tablet;

    if (!activeProps?.image) return null;

    return (
      <a href={activeProps.href || "#"} class="block w-full h-full">
        <img
          alt={activeProps.alt}
          src={activeProps.image}
          width={activeProps.width || 260}
          height={activeProps.height || 260}
          class="w-full h-full object-cover"
        />
      </a>
    );
  };

  return (
    <div class="flex flex-col items-center justify-center w-full mb-[30px] gap-[10px] overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {text && (
        <h2 class="my-[10px] max-w-[381px] h-fit leading-[32px] text-[32px] text-[#CE9680] text-10 font-Queens text-center px-3">
          {text}
        </h2>
      )}

      {/* Carrossel Linha 1 (Rola independente) */}
      <div class="flex overflow-x-auto w-full gap-[8px] mt-[10px] pl-4 md:pl-0 md:justify-center hide-scrollbar snap-x snap-mandatory">
        <div class="flex-shrink-0 w-[260px] h-[260px] snap-center overflow-hidden aspect-square">
          {renderImageGroup(firstImage)}
        </div>
        <div class="flex-shrink-0 w-[260px] h-[260px] snap-center overflow-hidden aspect-square pr-4 md:pr-0 box-content">
          {renderImageGroup(secondImage)}
        </div>
      </div>

      {/* Carrossel Linha 2 (Rola independente) */}
      <div class="flex overflow-x-auto w-full gap-[8px] pl-4 md:pl-0 md:justify-center hide-scrollbar snap-x snap-mandatory pb-4">
        <div class="flex-shrink-0 w-[260px] h-[260px] snap-center overflow-hidden aspect-square">
          {renderImageGroup(thirdImage)}
        </div>
        <div class="flex-shrink-0 w-[260px] h-[260px] snap-center overflow-hidden aspect-square pr-4 md:pr-0 box-content">
          {renderImageGroup(fourthImage)}
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
