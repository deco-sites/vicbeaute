import type { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  /** @title Banner */
  banner: {
    /** @title Imagem Desktop */
    desktop: ImageWidget;
    /** @title Imagem Mobile */
    mobile: ImageWidget;
    /** @title Texto Alternativo (SEO) */
    alt?: string;
    /** @title Título sobre a imagem */
    title?: HTMLWidget;
    /** @title Botão */
    button?: {
      label: string;
      url: string;
    };
  };
  /** @title Citação (Quote) */
  quote: {
    /** @title Texto da Citação */
    text: HTMLWidget;
    /** @title Autor da Citação */
    author: string;
  };
}

export default function QuoteBanner({
  banner = {
    desktop:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    mobile:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    alt: "Textura vermelha cremosa",
    title: "Menos produtos.<br/>Mais praticidade.",
    button: {
      label: "Ver cores disponíveis",
      url: "#",
    },
  },
  quote = {
    text:
      "“Bochechas coradas e com um ar de saúde? É pra já! Item coringa no nécessaire, esse bastão multifuncional tem textura cremosa que torna o uso à prova de erros. A intensidade da cor fica a nosso critério, já que é fácil de esfumar e possibilita a construção de camadas de uma forma delicada e suave.”",
    author: "Revista Glamour",
  },
}: Props) {
  return (
    <div class="w-full bg-white-15-10 py-10 lg:py-16">
      <div class="max-w-[1140px] mx-auto px-5 lg:px-8 xl:px-0 flex flex-col">
        {/* Banner com Imagem e Overlay */}
        <div class="relative w-full rounded-xl overflow-hidden shadow-sm">
          {/* Imagens Desktop e Mobile */}
          <Image
            src={banner.mobile}
            width={335}
            height={400}
            alt={banner.alt || "Banner Mobile"}
            class="w-full h-auto object-cover lg:hidden"
            loading="lazy"
          />
          <Image
            src={banner.desktop}
            width={1140}
            height={500}
            alt={banner.alt || "Banner Desktop"}
            class="hidden lg:block w-full h-auto object-cover"
            loading="lazy"
          />

          {/* Overlay de Texto e Botão */}
          <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/10">
            {banner.title && (
              <div
                class="font-Queens text-[32px] sm:text-[38px] lg:text-[46px] text-white-15 leading-[1.05] mb-6 drop-shadow-md"
                dangerouslySetInnerHTML={{ __html: banner.title }}
              />
            )}
            {banner.button?.label && banner.button?.url && (
              <a
                href={banner.button.url}
                class="inline-flex border border-white-15 text-white-15 text-[15px] font-medium px-8 py-3 rounded-sm hover:bg-white-15 hover:text-black-10 transition-colors"
                aria-label={banner.button.label}
              >
                {banner.button.label}
              </a>
            )}
          </div>
        </div>

        {/* Texto da Citação (Quote) */}
        <div class="mt-10 lg:mt-16 max-w-[900px] mx-auto flex flex-col items-start lg:items-center">
          {quote.text && (
            <div
              class="font-Queens text-green-10 text-[24px] lg:text-[32px] leading-[1.25] text-left lg:text-center text-balance"
              dangerouslySetInnerHTML={{ __html: quote.text }}
            />
          )}
          {quote.author && (
            <span class="w-full text-black-20 text-[14px] lg:text-[15px] font-Inter mt-6 text-right lg:text-center block">
              {quote.author}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
