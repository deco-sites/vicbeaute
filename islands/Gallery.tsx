import { ProductDetailsPage } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "../components/ui/Icon.tsx";
import { clx } from "../sdk/clx.ts";
import { useId } from "../sdk/useId.ts";
import Slider from "../components/ui/PDPSlider.tsx";

export interface Props {
  page: ProductDetailsPage | null;
}

const WIDTH = 500;
const HEIGHT = 500;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

export default function GallerySlider(props: Props) {
  const id = useId();

  if (!props.page) {
    throw new Error("Missing Product Details Page Info");
  }

  const {
    page: {
      product: { name, isVariantOf, image: pImages },
    },
  } = props;

  const groupImages = (isVariantOf?.image ?? pImages ?? []).filter(
    (img) => img.name?.toLowerCase() !== "cor"
  );

  const filtered = groupImages.filter((img) =>
    name?.includes(img.alternateName || "")
  );

  const images = filtered.length > 0 ? filtered : groupImages;

  return (
    <>
      <div id={id} class="relative flex flex-col w-full">
        {/* === VERSÃO DESKTOP: Grid de 2 Colunas Sem Slider === */}
        <div class="hidden lg:grid grid-cols-2 gap-2 w-full">
          {images.map((img, index) => (
            <div key={index} class="relative w-full aspect-square overflow-hidden bg-[#F8F8F8]">
              {/* Ajuste de Image Source pra alta resolução */}
              {index === 0 && (
                 <div class="absolute top-4 left-4 z-10 flex flex-col gap-2">
                   <span class="bg-[#e4e2cd] text-[#191C1F] text-[9px] font-bold px-2 py-1 uppercase tracking-wider">Hit no TikTok</span>
                   <span class="bg-[#3e3e3b] text-white text-[9px] font-bold px-2 py-1 uppercase tracking-wider">Mais Vendidos</span>
                 </div>
              )}
              <Image
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                sizes="(min-width: 1024px) 50vw"
                style={{ aspectRatio: ASPECT_RATIO }}
                src={(img.url!).replace("w=420&h=420", "w=1000&h=1000")}
                alt={img.alternateName}
                width={WIDTH}
                height={HEIGHT}
                preload={index < 4}
                loading={index < 4 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* === VERSÃO MOBILE: Slider com Setas e Indicador === */}
        <div class="lg:hidden relative w-full flex-grow">
          <Slider class="carousel carousel-center gap-0 w-full">
            {images.map((img, index) => (
              <Slider.Item
                index={index}
                class="carousel-item w-full relative aspect-square bg-[#F8F8F8]"
              >
                <Image
                  class="w-full h-full object-cover"
                  sizes="(max-width: 1023px) 100vw"
                  style={{ aspectRatio: ASPECT_RATIO }}
                  src={(img.url!).replace("w=420&h=420", "w=800&h=1000")}
                  alt={img.alternateName}
                  width={400}
                  height={500}
                  preload={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </Slider.Item>
            ))}
          </Slider>

          {/* Seta Voltar Mobile */}
          <Slider.PrevButton
            class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full shadow-sm bg-white-15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10"
          >
            <Icon id="chevron-right" width={9} height={18} class="rotate-180 text-black" strokeWidth={2} />
          </Slider.PrevButton>

          {/* Seta Avançar Mobile */}
          <Slider.NextButton
            class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full shadow-sm bg-white-15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10"
            disabled={images.length < 2}
          >
            <Icon id="chevron-right" width={9} height={18} class="text-black" strokeWidth={2} />
          </Slider.NextButton>

          {/* Paging Indicators Customizados do Slider (Necessita do Javascript Ativo) */}
          <div class="absolute bottom-5 left-5 z-10 text-[12px] bg-white-15 rounded-full px-3 py-[6px] font-semibold text-[#191C1F] shadow-sm tracking-wide">
             1 / {images.length}
             {/* No futuro: Atualizar indicador dinamicamente. O Slider do Deco nativamente usa bullets. 
                 Se quiser números que mudem: Requer interceptar o Index ativo do Carrossel via Signal ou Action */}
          </div>
        </div>

        <Slider.JS rootId={id} />
      </div>
    </>
  );
}
