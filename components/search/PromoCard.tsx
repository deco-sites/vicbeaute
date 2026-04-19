import type { ImageWidget as LiveImage } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";

export interface PromoCardProps {
  /** @description Imagem da versão Mobile (Recomendado: 170x394) */
  mobileImage: LiveImage;
  /** @description Imagem da versão Desktop (Recomendado: 350x510) */
  desktopImage: LiveImage;
  /** @description Texto alternativo da imagem */
  alt?: string;
  /** @description Pequeno Sub-título superior (ex: Holiday-Ready Makeup) */
  subtitle?: string;
  /** @description Título principal do card (ex: Radiant essentials for every party that season) */
  title?: string;
  /** @description Texto do Botão (ex: Compre agora) */
  buttonText?: string;
  /** @description Link de destino ao clicar no card ou botão */
  url?: string;
}

export default function PromoCard(props: PromoCardProps) {
  const { mobileImage, desktopImage, alt, subtitle, title, buttonText, url } =
    props;

  return (
    <a
      href={url || "#"}
      class="group relative flex flex-col justify-end overflow-hidden w-full lg:w-[350px] h-[394px] lg:h-[510px] rounded-sm bg-black"
    >
      <Picture class="absolute inset-0 w-full h-full">
        <Source
          src={mobileImage}
          media="(max-width: 1023px)"
          width={170}
          height={394}
        />
        <Source
          src={desktopImage}
          media="(min-width: 1024px)"
          width={350}
          height={510}
        />
        <img
          src={desktopImage}
          width={350}
          height={510}
          alt={alt || title || "Promo Card"}
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </Picture>

      {/* Degrade inferior forte para os textos ficarem completamente legiveis sobre a imagem */}
      <div class="absolute inset-x-0 bottom-0 top-[30%] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      <div class="relative z-10 flex flex-col p-5 lg:p-7 w-full text-[#ffffff]">
        {subtitle && (
          <span class="text-[9px] lg:text-[10px] mb-2 font-medium tracking-wide uppercase opacity-90">
            {subtitle}
          </span>
        )}
        {title && (
          <h3 class="text-[17px] lg:text-[20px] font-sans leading-tight mb-5 lg:mb-6 text-[#ffffff]">
            {title}
          </h3>
        )}
        {buttonText && (
          <span class="inline-flex w-full justify-center items-center py-3 border border-[#ffffff]/40 text-[11px] lg:text-[12px] uppercase tracking-wider hover:bg-[#ffffff] hover:text-black hover:border-[#ffffff] transition-colors rounded-sm font-semibold">
            {buttonText}
          </span>
        )}
      </div>
    </a>
  );
}
