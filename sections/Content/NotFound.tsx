import type { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  /** @title Imagem de Fundo (Desktop) */
  desktop?: ImageWidget;
  /** @title Imagem de Fundo (Mobile) */
  mobile?: ImageWidget;
  /** @title Alt da imagem */
  alt?: string;
  /** @title Título principal */
  title?: string;
  /** @title Subtítulo/Descrição */
  description?: HTMLWidget;
  /** @title Label do Botão */
  buttonLabel?: string;
  /** @title Link do Botão */
  buttonUrl?: string;
}

export default function NotFound({
  desktop = "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
  mobile = "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
  alt = "Vic Beauté 404",
  title = "Página não<br>encontrada.",
  description = "A beleza que você procura pode ter mudado de lugar. Volte para a página inicial e continue explorando nossos essenciais de maquiagem.",
  buttonLabel = "Voltar para o início",
  buttonUrl = "/",
}: Props) {
  return (
    <div class="w-full flex flex-col md:flex-row relative min-h-[70vh] bg-white-15">
      {/* Coluna Esquerda: Texto */}
      <div class="flex-1 flex flex-col justify-center px-8 py-16 md:px-12 lg:px-24 shrink-0 z-10 bg-[#F9F7F5] order-2 md:order-1">
        <h3 class="text-pink-15 font-Inter text-sm uppercase tracking-widest font-semibold mb-4">Erro 404</h3>
        <h1 
          class="font-Queens text-[#333] text-[48px] md:text-[64px] lg:text-[72px] leading-[1.05] mb-6 text-balance drop-shadow-sm"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <div 
          class="font-Inter text-[#555] text-[16px] md:text-[18px] leading-relaxed max-w-md mb-10"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <a 
          href={buttonUrl}
          class="relative overflow-hidden group inline-flex items-center justify-center bg-green-10 text-white-15 font-medium px-10 py-4 w-fit rounded transition-all duration-300 hover:bg-green-20 hover:shadow-md"
        >
          <span class="relative z-10">{buttonLabel}</span>
        </a>
      </div>

      {/* Coluna Direita: Imagem de Inspiração */}
      <div class="relative w-full md:w-1/2 h-[450px] md:h-auto overflow-hidden order-1 md:order-2">
         {/* Mobile */}
         <Image 
           src={mobile}
           alt={alt}
           width={750}
           height={600}
           class="md:hidden w-full h-full object-cover"
         />
         {/* Desktop */}
         <Image
           src={desktop}
           alt={alt}
           width={960}
           height={1080}
           class="hidden md:block w-full h-full object-cover"
         />
      </div>
    </div>
  );
}
