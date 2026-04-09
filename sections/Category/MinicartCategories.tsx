import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section, {
  type Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useDevice } from "@deco/deco/hooks";

/** @titleBy label */
export interface Item {
  /** @title Imagem da Categoria */
  image: ImageWidget;
  /** @title Link de destino */
  href: string;
  /** @title Nome da Categoria */
  label: string;
}

export interface Props extends SectionHeaderProps {
  /** @title Categorias */
  items: Item[];
  /**
   * @title Exibir dots
   * @description Exibe pontos de navegação estilo linha achatada abaixo das imagens.
   * @default true
   */
  dots?: boolean;
}

function Card({ image, href, label }: Item) {
  return (
    <a
      href={href}
      class="flex flex-col items-center justify-start gap-1 h-full"
    >
      <div class="w-[100px] h-[100px] overflow-hidden rounded-[8px] flex justify-center items-center border border-transparent hover:border-black/10 transition-colors">
        <Image
          src={image}
          alt={label}
          width={100}
          height={100}
          loading="lazy"
          class="object-cover w-full h-full"
        />
      </div>
      <span class="font-normal text-sm text-center text-[#212121]">
        {label}
      </span>
    </a>
  );
}

function MinicartCategories({ title, cta, items, dots = true }: Props) {
  const id = useId();
  const device = useDevice();

  if (!items || items.length === 0) return null;

  const itemsPerPage = 3;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div id={id} class="relative w-full flex flex-col pt-[10px] pb-6">
      {title && <Section.Header title={title} cta={cta} />}

      <Slider class="carousel carousel-center gap-1 w-full px-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-[10px] items-stretch">
        {items.map((i, index) => (
          <Slider.Item
            index={index}
            class={clx(
              "carousel-item snap-center",
            )}
            style={{ width: "max-content" }}
          >
            <Card {...i} />
          </Slider.Item>
        ))}
      </Slider>

      {dots && (
        <>
          <style
            dangerouslySetInnerHTML={{
              __html: `
              .minicart-categories-dots-tracker [data-dot] {
                background-color: rgba(25, 28, 31, 0.2) !important;
                width: 100% !important;
                height: 3px !important;
                border-radius: 0 !important;
                opacity: 1 !important;
                box-shadow: none !important;
                border: none !important;
                outline: none !important;
                transition: background-color 0.3s ease !important;
              }
              .minicart-categories-dots-tracker [data-dot]:disabled {
                background-color: #455C42 !important;
              }
            `,
            }}
          />
          <div class="flex w-full px-4 gap-0 minicart-categories-dots-tracker justify-center mx-auto mt-2 pb-2">
            {Array.from(
              { length: totalPages },
              (_, index) => (
                <div key={index} class="carousel-item flex-1">
                  <Slider.Dot index={index} class="w-full" />
                </div>
              ),
            )}
          </div>
        </>
      )}
      <Slider.JS rootId={id} dots={dots} />
    </div>
  );
}

export default MinicartCategories;
