import type { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
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
     * @title Kicker / Sobre-título
     * @description Exibido acima do título, padrão apenas no desktop.
     */
    kicker?: string;
    /**
     * @title Título principal
     * @description O título será rosa no mobile e verde no desktop, seguindo o design.
     */
    title?: string;
    /**
     * @title Descrição
     */
    description?: HTMLWidget;
    /**
     * @title Botão
     */
    button?: {
      label: string;
      url: string;
    };
  };
  /**
   * @title Posição da Imagem no Desktop
   * @default right
   */
  imagePosition?: "left" | "right";
}

export default function ImageTextBanner({
  image = {
    desktop:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    mobile:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    alt: "Maquiagem Stick Tudo",
  },
  content = {
    kicker: "Landi Page Stick tudo",
    title: "Feito para quem quer se maquiar sem complicação",
    description:
      "O Stick Tudo nasceu para quem não é expert, mas quer se sentir bem. Ele resolve a maquiagem inteira em poucos minutos.",
    button: {
      label: "Compre Aqui",
      url: "#",
    },
  },
  imagePosition = "right",
}: Props) {
  const isImageRight = imagePosition === "right";

  return (
    <div class="w-full bg-white-15-10 py-10 lg:py-20 lg:px-8 xl:px-0">
      <div class="max-w-[1140px] mx-auto flex flex-col lg:flex-row lg:bg-white-15 lg:rounded-2xl lg:overflow-hidden lg:shadow-sm">
        {/* Content Box */}
        <div
          class={`w-full lg:w-1/2 flex flex-col justify-center px-5 py-8 lg:p-14 xl:p-20 order-2 ${
            isImageRight ? "lg:order-1" : "lg:order-2"
          }`}
        >
          {content.kicker && (
            <span class="hidden lg:block text-pink-5 text-[14px] lg:text-[15px] tracking-wide mb-3 lg:mb-4 lg:text-left text-center">
              {content.kicker}
            </span>
          )}

          {content.title && (
            <h2 class="font-Queens text-[36px] sm:text-[42px] lg:text-[48px] xl:text-[52px] text-pink-15 lg:text-green-10 leading-[1.05] mb-4 lg:mb-6 text-center lg:text-left">
              {content.title}
            </h2>
          )}

          {content.description && (
            <div
              class="text-black-20 text-[15px] lg:text-[16px] leading-relaxed mb-8 text-center lg:text-left [&>p]:mb-4 last:[&>p]:mb-0"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
          )}

          {content.button?.label && content.button?.url && (
            <a
              href={content.button.url}
              class="inline-block bg-green-10 hover:bg-green-20 text-white-15 text-[15px] font-medium px-8 py-3.5 rounded-md transition-colors self-center lg:self-start hidden lg:inline-flex"
            >
              {content.button.label}
            </a>
          )}
        </div>

        {/* Image Box */}
        <div
          class={`w-full lg:w-1/2 order-1 px-5 lg:px-0 ${
            isImageRight ? "lg:order-2" : "lg:order-1"
          }`}
        >
          {/* Mobile Image */}
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

          {/* Desktop Image */}
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
