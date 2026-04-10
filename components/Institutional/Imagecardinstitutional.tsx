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
  /** @title Quarta Imagem (Apenas Mobile/Tablet) */
  fourthImage: {
    mobile: ImageDeviceProps;
    tablet: ImageDeviceProps;
  };
  text?: string;
}

function ImageCardInstitutional({ firstImage, secondImage, thirdImage, fourthImage, text }: Props) {
  const device = useDevice();

  const renderImageGroup = (imgGroup: { mobile: ImageDeviceProps; tablet: ImageDeviceProps; desktop?: ImageDeviceProps }) => {
    if (!imgGroup) return null;
    
<<<<<<< HEAD
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
=======
    if (device === "desktop" && imgGroup.desktop) {
      return (
        <a href={imgGroup.desktop.href || "#"} class="block w-full h-full" draggable={false}>
          <img
            alt={imgGroup.desktop.alt}
            src={imgGroup.desktop.image}
            width={imgGroup.desktop.width}
            height={imgGroup.desktop.height}
            class="w-full h-full object-cover select-none"
            draggable={false}
          />
        </a>
      );
    }
    if (device === "tablet" && imgGroup.tablet) {
      return (
        <a href={imgGroup.tablet.href || "#"} class="block w-full h-full" draggable={false}>
          <img
            alt={imgGroup.tablet.alt}
            src={imgGroup.tablet.image}
            width={imgGroup.tablet.width}
            height={imgGroup.tablet.height}
            class="w-full h-full object-cover select-none"
            draggable={false}
          />
        </a>
      );
    }
    if (device === "mobile" && imgGroup.mobile) {
      return (
        <a href={imgGroup.mobile.href || "#"} class="block w-full h-full" draggable={false}>
          <img
            alt={imgGroup.mobile.alt}
            src={imgGroup.mobile.image}
            width={imgGroup.mobile.width}
            height={imgGroup.mobile.height}
            class="w-full h-full object-cover select-none"
            draggable={false}
          />
        </a>
      );
    }
    return null;
>>>>>>> 44cf962 (feat(institutional) : implement desktop institutional version)
  };

  return (
    <div class="flex flex-col items-center justify-center w-full mb-[30px] gap-[10px] overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {text && (
        <h2 class="my-[10px] max-w-[381px] h-fit leading-[32px] text-[32px] text-[#CE9680] md:text-[#4D5D49] text-10 font-Queens text-center px-3">
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

      {/* Script para arrastar com o mouse sem precisar tornar a página inteira interativa */}
      <script dangerouslySetInnerHTML={{
        __html: `
        document.addEventListener("DOMContentLoaded", () => {
          document.querySelectorAll('.drag-carousel').forEach(slider => {
            let isDown = false;
            let startX;
            let scrollLeft;
            let isDragging = false;
            let dragThreshold = 5;

            slider.addEventListener('mousedown', (e) => {
              isDown = true;
              isDragging = false;
              startX = e.pageX - slider.offsetLeft;
              scrollLeft = slider.scrollLeft;
              slider.style.cursor = 'grabbing';
              slider.style.scrollSnapType = 'none'; // Desabilita trava dura durante o arraste
            });
            slider.addEventListener('mouseleave', () => { 
              isDown = false; 
              slider.style.cursor = 'grab';
              slider.style.scrollSnapType = 'x mandatory'; // Restaura trava suave
            });
            slider.addEventListener('mouseup', () => { 
              isDown = false; 
              slider.style.cursor = 'grab';
              slider.style.scrollSnapType = 'x mandatory'; // Restaura trava suave
            });
            slider.addEventListener('mousemove', (e) => {
              if(!isDown) return;
              e.preventDefault();
              
              const x = e.pageX - slider.offsetLeft;
              const walk = (x - startX) * 2;
              
              if (Math.abs(walk) > dragThreshold) {
                isDragging = true;
              }
              
              slider.scrollLeft = scrollLeft - walk;
            });

            // Evita que as fotos sejam "clicadas" (agindo como link) ao terminar um arrasto de mouse.
            slider.addEventListener('click', (e) => {
              if (isDragging) {
                  e.preventDefault();
                  e.stopImmediatePropagation();
              }
            }, true);
          });
        });
        `
      }} />

      {/* DESKTOP: Carrossel 1 Linha (Scroll) */}
      <div 
        class="drag-carousel hidden md:flex overflow-x-auto w-full gap-[20px] mt-[40px] px-0 hide-scrollbar snap-x snap-mandatory"
      >
        {/* Parede Invisível NATIVA do Flexbox (Força a foto pra direita garantindo os 80px livre de Tailwind) */}
        <div class="flex-shrink-0 w-[60px] h-[1px] pointer-events-none snap-start" />
        
        {[firstImage, secondImage, thirdImage].map((imgProps, i, arr) => {
          if (!imgProps) return null;
          const isLast = i === arr.length - 1;
          return (
            <>
              <div 
                 key={i} 
                 class="flex-shrink-0 aspect-square snap-start overflow-hidden"
                 style={{ width: '500px', height: '500px' }}
              >
                {renderImageGroup(imgProps)}
              </div>
              {/* Espaçador rígido fantasma apenas no último item para garantir margem de 80px do scroll */}
              {isLast && <div class="flex-shrink-0 w-[60px] h-[1px] pointer-events-none block" />} 
            </>
          );
        })}
      </div>
    </div>
  );
}

export default ImageCardInstitutional;
