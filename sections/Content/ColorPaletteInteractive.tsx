import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import ColorPaletteInteractiveTabs, {
  Tab,
} from "../../islands/ColorPaletteInteractiveTabs.tsx";

export interface Props {
  /**
   * @title Overline (Texto Acima do Título)
   * @description Ex: CARTELA DE COR
   */
  overline?: string;
  /**
   * @title Título principal
   * @description Ex: Verão
   */
  title?: string;
  /**
   * @title Descrição Principal
   * @description Texto explicativo principal da cartela.
   * @format textarea
   */
  description?: string;
  /**
   * @title Abas de Variação
   * @description Adicione as opções de variação ex: Frio, Claro, Suave
   */
  tabs?: Tab[];
  /**
   * @title Imagem
   * @description Imagem da modelo exibida no topo do componente.
   */
  image: {
    mobile: ImageWidget;
    desktop: ImageWidget;
    altText?: string;
  };
}

export default function ColorPaletteInteractiveSection({
  overline = "CARTELA DE COR",
  title = "Verão",
  description =
    "Destaca tons frios, como azul-pálido, rosa-claro e lavanda. As características incluem pele com subtons rosados ou azulados, cabelos em tons frios e olhos em tons como azul, verde ou cinza claro. Evitam-se cores vibrantes e quentes. O objetivo é realçar a beleza natural com uma aparência suave e equilibrada.",
  tabs = [
    {
      label: "Frio",
      description: "Para pessoas com subtons frios, como azulados, na pele.",
    },
    {
      label: "Claro",
      description: "Para pessoas com tons de pele claros e baixo contraste.",
    },
    {
      label: "Suave",
      description:
        "Para pessoas com aspecto mais opaco e menos contraste na pele.",
    },
  ],
  image = {
    mobile:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    desktop:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    altText: "Cartela de Cor",
  },
}: Props) {
  return (
    <div class="w-full bg-[#f4f4f4] pb-12 lg:pb-24 pt-[38px]">
      {/* Imagem no topo */}
      <div class="w-full relative">
        <Image
          src={image.mobile}
          width={375}
          height={300}
          alt={image.altText || title}
          class="w-full h-auto object-cover lg:hidden"
          loading="lazy"
        />
        <Image
          src={image.desktop}
          width={1440}
          height={480}
          alt={image.altText || title}
          class="hidden lg:block w-full h-[300px] lg:h-[400px] xl:h-[480px] object-cover"
          loading="lazy"
        />
      </div>

      {/* Conteúdo principal */}
      <div class="w-full max-w-[800px] mx-auto px-5 mt-10 lg:mt-16 flex flex-col items-center">
        {overline && (
          <span class="text-[11px] lg:text-[12px] uppercase tracking-[0.1em] text-black-5 mb-2 font-medium">
            {overline}
          </span>
        )}

        {title && (
          <h2 class="font-Queens text-[48px] lg:text-[64px] text-pink-15 mb-4 lg:mb-6 leading-[1.1] text-center">
            {title}
          </h2>
        )}

        {description && (
          <p class="text-[15px] lg:text-[16px] text-black-20 text-center leading-relaxed max-w-[650px] mb-10 lg:mb-12">
            {description}
          </p>
        )}

        {/* Componente interativo (Abas) */}
        {tabs && tabs.length > 0 && (
          <ColorPaletteInteractiveTabs title={title || "Verão"} tabs={tabs} />
        )}
      </div>
    </div>
  );
}
