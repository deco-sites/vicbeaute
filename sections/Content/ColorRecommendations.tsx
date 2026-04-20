import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Slider from "../../components/ui/Slider.tsx";
import SliderJS from "../../islands/SliderJS.tsx";
import { useId } from "../../sdk/useId.ts";

export interface CartelaCard {
  /** @title Imagem Desktop */
  imageDesktop: ImageWidget;
  /** @title Imagem Mobile */
  imageMobile: ImageWidget;
  altText?: string;
  href?: string;
}

export interface Props {
  /**
   * @title Título da vitrine de Cartelas
   * @format textarea
   */
  title?: string;

  /** @title Cartelas (verão, outono, inverno, primavera) */
  cards?: CartelaCard[];

  /** @title Texto Disclaimer (Rodapé) */
  disclaimer?: string;

  /**
   * @title Botão Final
   * @description Configuração do botão. Para retornar ao topo automaticamente, insira '#' no campo href.
   */
  cta?: {
    label: string;
    href: string;
  };
}

export default function ColorRecommendations({
  title = "Confira nossas indicações de\nprodutos para cada Cartela de Cor:",
  cards = [
    {
      imageDesktop:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      imageMobile:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      altText: "Cartela Verão",
      href: "#",
    },
    {
      imageDesktop:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      imageMobile:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      altText: "Cartela Outono",
      href: "#",
    },
    {
      imageDesktop:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      imageMobile:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      altText: "Cartela Inverno",
      href: "#",
    },
    {
      imageDesktop:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      imageMobile:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      altText: "Cartela Primavera",
      href: "#",
    },
  ],
  disclaimer =
    "*Fotos de modelos correspondentes ao produto, não a cartela de cor.",
  cta = {
    label: "Voltar ao início",
    href: "#",
  },
}: Props) {
  const id = useId();

  return (
    <div class="w-full relative bg-white-10 py-12 lg:py-20 flex flex-col items-center">
      <div class="w-full max-w-[1140px] px-0 lg:px-8 xl:px-0 mx-auto">
        {/* Título Seção Cartelas */}
        {title && (
          <h2 class="font-Queens text-[32px] sm:text-[40px] lg:text-[46px] xl:text-[50px] text-pink-15 text-center leading-[1.1] w-full max-w-[800px] mx-auto px-5 lg:px-0 mb-8 lg:mb-16 whitespace-pre-wrap">
            {title}
          </h2>
        )}

        {/* Cards de Cartelas (Carrossel Mobile / Grid Desktop) */}
        {cards && cards.length > 0 && (
          <div
            id={id}
            class="w-full relative pl-5 lg:pl-0 mb-8 lg:mb-10 lg:max-w-[850px] lg:mx-auto"
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `
              #${id} [data-slider]::-webkit-scrollbar { display: none; }
              #${id} [data-slider] { -ms-overflow-style: none; scrollbar-width: none; }
            `,
              }}
            />
            <ul
              data-slider
              class="flex lg:grid lg:grid-cols-2 gap-4 lg:gap-2 overflow-x-auto lg:overflow-visible snap-x scrollbar-none pr-5 lg:pr-0 pb-4 lg:pb-0"
            >
              {cards.map((card, i) => (
                <li
                  data-slider-item={i}
                  key={i}
                  class="relative min-w-[280px] sm:min-w-[320px] lg:min-w-0 w-full group snap-center rounded-[4px] lg:rounded-none overflow-hidden flex-shrink-0"
                >
                  <a href={card.href || "#"} class="w-full h-full block">
                    {card.imageMobile && (
                      <Image
                        src={card.imageMobile}
                        width={280}
                        height={380}
                        alt={card.altText || "Cartela de cor"}
                        class="lg:hidden w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    {card.imageDesktop && (
                      <Image
                        src={card.imageDesktop}
                        width={550}
                        height={550}
                        alt={card.altText || "Cartela de cor"}
                        class="hidden lg:block w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>

            {/* DOTS P/ Mobile */}
            {cards.length > 1 && (
              <>
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                    .cr-dots-tracker [data-dot] {
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
                    .cr-dots-tracker [data-dot]:disabled {
                      background-color: #4D5D49 !important;
                    }
                  `,
                  }}
                />
                <div class="flex lg:hidden w-full lg:max-w-[351px] gap-0 cr-dots-tracker justify-center mx-auto mt-2 pb-4 px-5">
                  {cards.map((_, index) => (
                    <div key={index} class="carousel-item flex-1">
                      <Slider.Dot index={index} class="w-full" />
                    </div>
                  ))}
                </div>
              </>
            )}

            <SliderJS rootId={id} infinite={false} />
          </div>
        )}

        {/* Disclaimer */}
        {disclaimer && (
          <div class="w-full px-5 text-center mb-8">
            <p class="text-[10px] md:text-[12px] text-black-20">{disclaimer}</p>
          </div>
        )}

        {/* CTA Boto */}
        {cta && (
          <div class="w-full flex justify-center px-5 mb-4 lg:mb-8">
            <a
              href={cta.href}
              class="inline-block bg-green-10 hover:bg-green-20 text-white-15 px-10 py-3 rounded-[4px] text-[14px] lg:text-[15px] font-medium transition-colors"
            >
              {cta.label}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
