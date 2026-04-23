import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface CategoryCard {
  /** @description Imagem da categoria (Quadradinha: recomendada) */
  image: ImageWidget;
  /** @description Nome da categoria exibido abaixo da imagem */
  label: string;
  /** @description Link de destino ao clicar na categoria */
  url: string;
}

export interface Props {
  /** @description Título da seção (Ex: Categoria de produtos) */
  title?: string;
  /** @description Cor de Fundo da Seção (Ex: #f4f4f4 ou transparent) */
  backgroundColor?: string;
  /** @description Lista de categorias a serem exibidas */
  categories?: CategoryCard[];
}

export default function ProductCategories({
  title = "Categoria de produtos",
  backgroundColor = "transparent",
  categories = [],
}: Props) {
  if (!categories || categories.length === 0) return null;

  return (
    <div style={{ backgroundColor }} class="w-full py-8 lg:py-12">
      <div class="max-w-[1280px] mx-auto xl:px-[30px] xl2:px-0">
        <div class="px-[12px] lg:px-0">
          {title && (
            <h2 class="text-[#2C2C2C] font-Hanken-Grotesk font-medium text-[18px] xl:text-[24px] mb-4 lg:mb-6">
              {title}
            </h2>
          )}
        </div>

        {/* Native Horizontal Scroll Container - No Arrows / No Dots */}
        <div class="flex overflow-x-auto snap-x snap-mandatory gap-[8px] lg:gap-[11px] mx-3 xl:mx-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4">
          {categories.map((category, index) => (
            <a
              key={index}
              href={category.url}
              class="flex flex-col gap-[10px] relative snap-start shrink-0 group transition-all"
            >
              <div class="w-[80px] h-[80px] lg:w-[150px] lg:h-[150px] rounded-lg overflow-hidden shrink-0 border border-transparent transition-colors relative">
                {
                  /*
                   A largura base p/ carregar otimizado pelo Deno Fresh.
                   Vai ser 150x150 no Desk e em mobile ajustamos via CSS w-[80px].
                */
                }
                <Image
                  src={category.image}
                  alt={category.label}
                  width={150}
                  height={150}
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <span class="text-center font-Hanken-Grotesk text-[12px] xl:text-[16px] text-[#363931] leading-tight transition-colors px-1 whitespace-nowrap overflow-hidden text-ellipsis lg:max-w-[150px] max-w-[80px]">
                {category.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
