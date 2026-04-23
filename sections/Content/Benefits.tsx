import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface BenefitCard {
  /**
   * @title Imagens
   */
  image: {
    /**
     * @title Imagem Desktop
     * @description Recomendado imagem quadrada (ex: 300x300)
     */
    desktop: ImageWidget;
    /**
     * @title Imagem Mobile
     * @description Recomendado imagem quadrada (ex: 300x300)
     */
    mobile: ImageWidget;
  };
  /**
   * @title Texto Alternativo (SEO)
   */
  alt?: string;
  /**
   * @title Descrição Curta
   */
  text: string;
}

export interface Props {
  /**
   * @title Título da Seção
   * @default Porque você vai amar
   */
  title?: string;
  /**
   * @title Benefícios
   */
  cards?: BenefitCard[];
}

export default function Benefits({
  title = "Porque você vai amar",
  cards = [
    {
      image: {
        desktop:
          "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
        mobile:
          "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      },
      text: "3 em 1: blush, batom e sombra",
      alt: "3 em 1: blush, batom e sombra",
    },
    {
      image: {
        desktop:
          "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
        mobile:
          "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      },
      text: "Textura cremosa e fácil de esfumar",
      alt: "Textura cremosa e fácil de esfumar",
    },
    {
      image: {
        desktop:
          "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
        mobile:
          "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      },
      text: "Resultado natural, sem pesar",
      alt: "Resultado natural, sem pesar",
    },
    {
      image: {
        desktop:
          "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
        mobile:
          "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      },
      text: "Ideal para o dia a dia e para levar na bolsa",
      alt: "Ideal para o dia a dia e para levar na bolsa",
    },
  ],
}: Props) {
  return (
    <div class="w-full bg-white-10 py-12 lg:py-20">
      <div class="max-w-[1140px] mx-auto flex flex-col">
        {title && (
          <h2 class="font-Queens text-[32px] sm:text-[38px] lg:text-[42px] text-pink-15 mb-8 lg:mb-10 text-center leading-[1.1] w-full px-5">
            {title}
          </h2>
        )}

        {/* Scrollable on mobile, Grid on desktop */}
        <div class="w-full overflow-hidden">
          <ul class="flex gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-4 px-5 lg:px-8 xl:px-0 [&::-webkit-scrollbar]:hidden w-full h-full pb-4 lg:pb-0">
            {cards?.map((card, index) => (
              <li
                key={index}
                class="flex flex-col bg-white min-w-[240px] lg:min-w-0 w-[240px] lg:w-full snap-center shadow-sm"
              >
                <div class="w-full aspect-square relative overflow-hidden bg-white-5">
                  <Image
                    src={card.image.mobile}
                    width={280}
                    height={280}
                    alt={card.alt || card.text}
                    class="w-full h-full object-cover lg:hidden"
                    loading="lazy"
                  />
                  <Image
                    src={card.image.desktop}
                    width={280}
                    height={280}
                    alt={card.alt || card.text}
                    class="w-full h-full object-cover hidden lg:block"
                    loading="lazy"
                  />
                </div>
                <div class="p-4 lg:p-6 flex flex-1 items-center justify-center min-h-[100px] bg-white">
                  <p class="font-Queens text-black-10 text-center text-[16px] lg:text-[18px] leading-tight">
                    {card.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
