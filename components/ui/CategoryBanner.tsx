import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { type SectionProps } from "@deco/deco";

export interface Props {
  /** @description Título da Categoria a ser escrito em h1 na imagem */
  title: string;

  /** @description Imagem Desktop (Sugestão: 1440x360) */
  imageDesk?: ImageWidget;

  /** @description Imagem Mobile (Sugestão: 375x300) */
  imageMobile?: ImageWidget;

  /** @description Texto alternativo da imagem */
  imageAlt?: string;

  /** @description Usar cor original na fonte (#4D5D49 ao invés de Branco)? */
  darkText?: boolean;
}

function BreadcrumbInsideBanner(
  { pathname, darkText }: { pathname: string; darkText?: boolean },
) {
  // Limpa o path e gera as partes ignorando queries
  const parts = pathname?.split("/").filter(Boolean) || [];

  if (parts.length === 0) return null;

  const textColor = darkText ? "text-[#4D5D49]" : "text-[#FFFFFF]";

  return (
    <ul
      class={`flex items-center gap-[6px] text-[13px] font-medium tracking-wide relative z-20 ${textColor}`}
    >
      <li>
        <a href="/" class="hover:underline transition-all drop-shadow-md">
          Inicio
        </a>
      </li>
      {parts.map((p, i) => {
        // Formata nome (ex: maquiagem-rosto -> Maquiagem Rosto)
        const name = p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, " ");
        const isLast = i === parts.length - 1;
        const href = "/" + parts.slice(0, i + 1).join("/");

        return (
          <li class="flex items-center gap-[6px]" key={href}>
            <span
              class={`opacity-90 text-[10px] mt-[1px] drop-shadow-md ${textColor}`}
            >
              /
            </span>
            {isLast
              ? (
                <span class="opacity-100 font-semibold drop-shadow-md">
                  {name}
                </span>
              )
              : (
                <a
                  href={href}
                  class="hover:underline opacity-90 transition-opacity drop-shadow-md"
                >
                  {name}
                </a>
              )}
          </li>
        );
      })}
    </ul>
  );
}

// O loader simples repassando apenas a URl da page para renderizar as BreadCrumbs (pois só o server tem acesso puro ao Request no deco)
export const loader = (props: Props, req: Request) => {
  const url = new URL(req.url);
  return { ...props, pathname: url.pathname };
};

function CategoryBanner(props: SectionProps<ReturnType<typeof loader>>) {
  const {
    title = "",
    // Fallbacks essenciais para evitar crash da Deco caso o logista adicione o bloco vazio antes de subir a foto
    imageDesk =
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/ec597b6a-dcf1-48ca-a99d-95b3c6304f96",
    imageMobile =
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/91102b71-4832-486a-b683-5f7b06f649af",
    imageAlt = "",
    pathname = "",
    darkText,
  } = props;

  const h1Color = darkText ? "text-[#4D5D49]" : "text-[#FFFFFF]";

  return (
    <div class="relative w-full h-[300px] lg:h-[360px] overflow-hidden bg-black flex items-center mt-[39px]">
      {/* Background Image Setup */}
      <Picture preload class="absolute inset-0 w-full h-full">
        <Source
          src={imageMobile}
          width={375}
          height={300}
          media="(max-width: 1023px)"
        />
        <Source
          src={imageDesk}
          width={1440}
          height={360}
          media="(min-width: 1024px)"
        />
        <img
          class="w-full h-full object-cover opacity-90"
          src={imageDesk}
          alt={imageAlt ?? title}
        />
      </Picture>

      {/* Sombreamento sutil na borda inferior para as migalhas de pão fiquem legíveis sempre */}
      <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Camada de Conteúdos (H1 e Breadcrumbs) */}
      <div class="relative w-full h-full z-10 max-w-[1440px] mx-auto">
        {/* Title (Centrado verticalmente na coluna da esquerda) */}
        <h1
          class={`absolute left-[12px] lg:left-[80px] top-[50%] -translate-y-[40%] lg:-translate-y-1/2 font-Queens text-[36px] lg:text-[76px] leading-[1] drop-shadow-lg tracking-tighter xl:tracking-normal ${h1Color}`}
        >
          {title}
        </h1>

        {/* Breadcrumbs */}
        <div class="absolute bottom-[6px] left-[12px] lg:left-[80px]">
          <BreadcrumbInsideBanner pathname={pathname} darkText={darkText} />
        </div>
      </div>
    </div>
  );
}

export default CategoryBanner;
