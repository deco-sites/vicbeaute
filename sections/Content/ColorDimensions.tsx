import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Card {
  /**
   * @title Título do Card
   * @description Ex: Intensidade, Profundidade, etc.
   */
  title: string;
  /**
   * @title Texto do Card
   * @format textarea
   */
  text: string;
}

export interface Props {
  /**
   * @title Título principal
   * @description Ex: As três dimensões de cor
   */
  title?: string;
  /**
   * @title Lista de Cards
   * @description Adicione os cards de dimensão aqui
   */
  cards?: Card[];
  /**
   * @title Imagem
   * @description Variações da imagem (mobile e desktop)
   */
  image: {
    mobile: ImageWidget;
    desktop: ImageWidget;
    altText?: string;
  };
}

export default function ColorDimensions({
  title = "As três dimensões de cor",
  cards = [
    {
      title: "Intensidade",
      text:
        "Refere-se à vivacidade ou saturação de uma cor, indicando quão brilhante ou apagada ela é. Cores intensas são vibrantes e chamativas, enquanto cores menos intensas são mais suaves.",
    },
    {
      title: "Profundidade",
      text:
        "Relaciona-se à claridade ou escuridão de uma cor, ou seja, se ela é clara, média ou escura. Isso influencia como a cor é percebida em diferentes tonalidades.",
    },
    {
      title: "Temperatura",
      text:
        "Diz respeito à sensação de calor ou frieza que a cor transmite. Cores quentes (como vermelho, laranja) trazem a sensação de calor, enquanto cores frias (como azul, verde) trazem a sensação de frio.",
    },
  ],
  image = {
    mobile:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    desktop:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    altText: "Dimensões de cor",
  },
}: Props) {
  return (
    <div class="w-full bg-green-15 py-12 lg:py-20">
      <div class="max-w-[1140px] mx-auto flex flex-col lg:flex-row items-center px-5 lg:px-8 xl:px-0">
        {/* Título Mobile (Visível apenas em telas menores) */}
        {title && (
          <h2 class="lg:hidden font-Queens text-[38px] sm:text-[42px] text-black-10 mb-8 text-center leading-[1.1] w-full">
            {title}
          </h2>
        )}

        {/* Coluna da Imagem (Esquerda no Desktop / Meio no Mobile) */}
        <div class="w-full lg:w-1/2 flex justify-center lg:justify-start relative">
          {/* Imagem p/ Mobile */}
          <Image
            src={image.mobile}
            width={335}
            height={420}
            alt={image.altText || title}
            class="lg:hidden w-full max-w-[420px] h-auto object-cover rounded-[4px]"
            loading="lazy"
          />
          {/* Imagem p/ Desktop */}
          <Image
            src={image.desktop}
            width={550}
            height={650}
            alt={image.altText || title}
            class="hidden lg:block w-full max-w-[550px] h-auto object-cover"
            loading="lazy"
          />
        </div>

        {/* Coluna de Texto e Cards (Direita no Desktop / Baixo no Mobile) */}
        <div class="w-full lg:w-1/2 flex flex-col justify-center max-w-[480px] lg:max-w-none mx-auto lg:mx-0 lg:pl-10 xl:pl-16 pt-8 lg:pt-0">
          {/* Título Desktop (Escondido no mobile) */}
          {title && (
            <h2 class="hidden lg:block font-Queens text-[42px] xl:text-[52px] text-black-10 mb-8 text-left leading-[1.1] w-full">
              {title}
            </h2>
          )}

          {/* Cards */}
          <div class="flex flex-col gap-4 lg:gap-5 w-full">
            {cards?.map((card, index) => (
              <div
                key={index}
                class="bg-white px-6 py-6 lg:px-8 lg:py-7 rounded-[8px] flex flex-col gap-2 w-full"
              >
                <h3 class="font-bold text-[16px] xl:text-[18px] text-black-10 text-left">
                  {card.title}
                </h3>
                <p class="text-[14px] xl:text-[15px] text-black-20 leading-relaxed text-left">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
