import type { ImageWidget, HTMLWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  /**
   * @title Imagens
   */
  image: {
    desktop: ImageWidget;
    mobile: ImageWidget;
    alt?: string;
  };
  content: {
    /** 
     * @title Título principal 
     */
    title?: string;
    /** 
     * @title Cor do Título 
     */
    titleColor?: "Rosa" | "Verde" | "Preto";
    /** 
     * @title Descrição (Desktop)
     */
    descriptionDesktop?: HTMLWidget;
    /** 
     * @title Descrição (Mobile)
     * @description Preencha apenas se for diferente do Desktop
     */
    descriptionMobile?: HTMLWidget;
    /** 
     * @title Cor da Descrição (Mobile)
     */
    descriptionMobileColor?: "Verde" | "Cinza Escuro";
  };
  /**
   * @title Posição da Imagem no Desktop
   * @default right
   */
  imagePosition?: "left" | "right";
}

const TITLE_COLORS = {
  "Rosa": "text-pink-15",
  "Verde": "text-green-10",
  "Preto": "text-black-10",
};

const DESC_MOBILE_COLORS = {
  "Verde": "text-green-10",
  "Cinza Escuro": "text-black-20",
};

export default function FeatureImageText({
  image = {
    desktop: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    mobile: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    alt: "Textura cremosa que funciona de verdade",
  },
  content = {
    title: "Textura cremosa que funciona de verdade",
    titleColor: "Rosa",
    descriptionDesktop: "O Stick Tudo nasceu para quem não é expert, mas quer se sentir bem. Ele resolve a maquiagem inteira em poucos minutos.",
    descriptionMobile: "Desliza, esfuma fácil e não pesa.<br/>Não marca poros e seca confortável.",
    descriptionMobileColor: "Verde",
  },
  imagePosition = "right",
}: Props) {
  const isImageRight = imagePosition === "right";
  const titleClass = TITLE_COLORS[content.titleColor || "Rosa"];
  const descMobileClass = DESC_MOBILE_COLORS[content.descriptionMobileColor || "Cinza Escuro"];

  return (
    <div class="w-full bg-white-10 py-10 lg:py-20 lg:px-8 xl:px-0">
      <div class="max-w-[1140px] mx-auto flex flex-col lg:flex-row lg:bg-white-15 lg:rounded-2xl lg:overflow-hidden lg:shadow-sm">
        
        {/* Caixa de Conteúdo */}
        <div 
          class={`w-full lg:w-1/2 flex flex-col justify-center px-5 py-8 lg:p-14 xl:p-20 order-2 ${
            isImageRight ? "lg:order-1" : "lg:order-2"
          }`}
        >
          {content.title && (
            <h2 class={`font-Queens text-[36px] sm:text-[42px] lg:text-[48px] xl:text-[52px] ${titleClass} leading-[1.05] mb-4 lg:mb-6 text-center lg:text-left`}>
              {content.title}
            </h2>
          )}

          {/* Descrição Mobile (exibida apenas no mobile se fornecida separadamente) */}
          {content.descriptionMobile && (
            <div 
              class={`lg:hidden ${descMobileClass} text-[18px] sm:text-[20px] font-medium leading-tight text-center`}
              dangerouslySetInnerHTML={{ __html: content.descriptionMobile }}
            />
          )}

          {/* Descrição Desktop (exibida sempre no desktop, e no mobile se não houver a prop descriptionMobile) */}
          {content.descriptionDesktop && (
            <div 
              class={`${content.descriptionMobile ? "hidden lg:block" : "block"} text-black-20 text-[15px] lg:text-[16px] leading-relaxed mb-8 text-center lg:text-left [&>p]:mb-4 last:[&>p]:mb-0`}
              dangerouslySetInnerHTML={{ __html: content.descriptionDesktop }}
            />
          )}
        </div>

        {/* Caixa da Imagem */}
        <div 
          class={`w-full lg:w-1/2 order-1 px-5 lg:px-0 ${
            isImageRight ? "lg:order-2" : "lg:order-1"
          }`}
        >
          {/* Imagem Mobile */}
          <div class="w-full h-auto rounded-xl overflow-hidden lg:hidden">
             <Image
                src={image.mobile}
                width={335}
                height={335}
                alt={image.alt || content.title}
                class="w-full h-full object-cover"
                loading="lazy"
             />
          </div>

          {/* Imagem Desktop */}
          <div class="hidden lg:block w-full h-full min-h-[400px]">
             <Image
                src={image.desktop}
                width={570}
                height={570}
                alt={image.alt || content.title}
                class="w-full h-full object-cover"
                loading="lazy"
             />
          </div>
        </div>

      </div>
    </div>
  );
}
