import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface ContentBlock {
  /** @title Posição da Imagem no Desktop */
  imagePlacement: "left" | "right";
  /** @title Imagem Desktop */
  imageDesktop: ImageWidget;
  /** @title Imagem Mobile */
  imageMobile: ImageWidget;
  imageAlt?: string;
  /** @title Título do Bloco */
  title: string;
  /**
   * @title Texto do Bloco
   * @format textarea
   */
  text: string;
}

export interface Props {
  /** @title Título Principal */
  mainTitle?: string;

  /** @title Blocos de Conteúdo (Ex: Tom e Subtom) */
  blocks?: ContentBlock[];

}

export default function SkinToneGuide({
  mainTitle = "Tom e Subtom de Pele",
  blocks = [
    {
      imagePlacement: "left",
      title: "Tom de Pele",
      text: "Refere-se à cor superficial da pele, variando entre claro, médio e escuro",
      imageMobile: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      imageDesktop: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      imageAlt: "Tom de Pele",
    },
    {
      imagePlacement: "right",
      title: "Subtom de Pele",
      text: "É a cor subjacente que influencia a aparência geral da pele. Existem três principais subtons: quentes (tons amarelados/dourados), frios (tons rosados/azulados) e neutro (uma mistura de ambos). O subtom permanece constante, independentemente da exposição ao sol ou mudanças na pele.",
      imageMobile: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      imageDesktop: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      imageAlt: "Subtom de Pele",
    },
  ],
}: Props) {
  return (
    <div class="w-full relative bg-white-10 py-12 lg:py-20 flex flex-col items-center">
      <div class="w-full max-w-[1140px] px-0 lg:px-8 xl:px-0 mx-auto">
        
        {/* Título Superior */}
        {mainTitle && (
          <h2 class="font-Queens text-[32px] sm:text-[40px] lg:text-[46px] xl:text-[50px] text-pink-15 text-center leading-[1.1] w-full px-5 lg:px-0 mb-10 lg:mb-16">
            {mainTitle}
          </h2>
        )}

        {/* Blocos em Zig-Zag */}
        <div class="flex flex-col w-full gap-12 lg:gap-0">
          {blocks?.map((block, idx) => (
            <div
              key={idx}
              class={`flex flex-col w-full ${
                block.imagePlacement === "left"
                  ? "lg:flex-row"
                  : "lg:flex-row-reverse"
              } bg-transparent items-center`}
            >
              {/* Textos Celular (Aparece antes da imagem no mobile) */}
              <div class="flex lg:hidden flex-col items-center text-center px-5 mb-5 w-full">
                <h3 class="font-bold text-[18px] text-black-10 mb-2">{block.title}</h3>
                <p class="text-[14px] text-black-20">{block.text}</p>
              </div>

              {/* Coluna da Imagem */}
              <div class="w-full lg:w-1/2 flex justify-center mb-6 lg:mb-0 px-5 lg:px-0">
                {block.imageMobile && (
                  <Image
                    src={block.imageMobile}
                    width={335}
                    height={335}
                    alt={block.imageAlt || block.title}
                    class="lg:hidden w-full max-w-[400px] h-auto object-cover rounded-sm"
                    loading="lazy"
                  />
                )}
                {block.imageDesktop && (
                  <Image
                    src={block.imageDesktop}
                    width={570}
                    height={570}
                    alt={block.imageAlt || block.title}
                    class="hidden lg:block w-full max-w-[570px] aspect-square object-cover"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Coluna de Texto Desktop */}
              <div
                class={`hidden lg:flex w-full lg:w-1/2 flex-col justify-center max-w-[480px] lg:px-12 xl:px-16 ${
                  block.imagePlacement === "left" ? "lg:mr-auto" : "lg:ml-auto"
                }`}
              >
                <h3 class="font-bold text-[18px] xl:text-[20px] text-black-10 mb-2 lg:mb-3">
                  {block.title}
                </h3>
                <p class="text-[14px] xl:text-[15px] xl:leading-relaxed text-black-20">
                  {block.text}
                </p>
              </div>
            </div>
          ))}
        </div>


      </div>
    </div>
  );
}
