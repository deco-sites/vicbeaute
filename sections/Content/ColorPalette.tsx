import type { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  /**
   * @title Título principal
   * @description Título da seção (ex: Cartela de cor)
   */
  title?: string;
  /**
   * @title Texto Descritivo
   * @description Conteúdo textual da cartela. Utilize as opções de formatação do editor HTML para criar parágrafos separados.
   */
  description?: HTMLWidget;
  /**
   * @title Imagem
   * @description Variações da imagem (mobile e desktop) correspondentes à colagem
   */
  image: {
    mobile: ImageWidget;
    desktop: ImageWidget;
    altText?: string;
  };
}

export default function ColorPalette({
  title = "Cartela de cor",
  description =
    "<p>Para quem já conhece mais sobre cores e é adepta da coloração pessoal na hora de escolher roupas e maquiagens, temos a indicação de cartelas de cores para cada produto!</p><p>As cartelas de cores, ou análise de coloração pessoal, não usada para identificar as tonalidades que harmonizam melhor com a pele, olhos e cabelo de uma pessoa, realçando a beleza natural de cada indivíduo.</p><p>Para entender mais sobre o que compõe a cartela de cor, aqui vão alguns pontos importantes para considerar:</p>",
  image = {
    mobile:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    desktop:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    altText: "Colagem de produtos - Cartela de cores",
  },
}: Props) {
  return (
    <div class="w-full bg-white-10 py-12 lg:py-20">
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
            height={335}
            alt={image.altText || title}
            class="lg:hidden w-full max-w-[400px] h-auto object-contain"
            loading="lazy"
          />
          {/* Imagem p/ Desktop */}
          <Image
            src={image.desktop}
            width={550}
            height={550}
            alt={image.altText || title}
            class="hidden lg:block w-full max-w-[550px] h-auto object-contain"
            loading="lazy"
          />
        </div>

        {/* Coluna de Texto (Direita no Desktop / Baixo no Mobile) */}
        <div class="w-full lg:w-1/2 flex flex-col justify-center max-w-[450px] lg:max-w-none mx-auto lg:mx-0 lg:pl-10 xl:pl-16 pt-10 lg:pt-0">
          {/* Título Desktop (Escondido no mobile e centralizado à esquerda junto com texto) */}
          {title && (
            <h2 class="hidden lg:block font-Queens text-[48px] xl:text-[56px] text-black-10 mb-8 text-left leading-[1.1] w-full">
              {title}
            </h2>
          )}

          {/* Descrição renderizando HTML de forma limpa e flexível */}
          {description && (
            <div
              class="text-[15px] xl:text-[16px] text-black-20 [&>p]:mb-5 last:[&>p]:mb-0 leading-relaxed text-left w-full"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
