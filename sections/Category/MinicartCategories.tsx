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
    <a href={href} class="flex flex-col items-center justify-start gap-3 h-full">
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
      <span class="font-normal text-sm text-center text-[#212121]">{label}</span>
    </a>
  );
}

function MinicartCategories({ title, cta, items, dots = true }: Props) {
  const id = useId();
  const device = useDevice();

  if (!items || items.length === 0) return null;

  return (
    <div id={id} class="relative w-full flex flex-col pt-4 pb-6">
      {title && <Section.Header title={title} cta={cta} />}

      <Slider class="carousel carousel-center gap-1 w-full px-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 items-stretch">
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
        <div class="flex gap-[6px] justify-center mt-2 px-4">
          {items.map((_, index) => (
            <button
              data-dot={index}
              aria-label={`go to slider item ${index}`}
              class="focus:outline-none group disabled:!bg-black disabled:!opacity-100 bg-[#D9D9D9] opacity-100 w-8 h-[3px] rounded-sm transition-all duration-300"
            />
          ))}
        </div>
      )}
      <Slider.JS rootId={id} dots={dots} />
    </div>
  );
}

export default MinicartCategories;
