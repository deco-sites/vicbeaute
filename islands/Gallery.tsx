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

  const groupImages = isVariantOf?.image ?? pImages ?? [];

  const filtered = groupImages.filter((img) =>
    name?.includes(img.alternateName || "")
  );

  const images = filtered.length > 0 ? filtered : groupImages;

  return (
    <>
      <div
        id={id}
        class={clx(
          "flex flex-col gap-5 relative",
          "lg:flex-row-reverse",
        )}
      >
        <div
          class={clx(
            "col-start-1 col-span-1 mx-auto",
            "sm:col-start-2 lg:border rounded",
          )}
        >
          <div class={clx("relative h-min flex-grow rounded-lg")}>
            <Slider class="carousel carousel-center gap-6 w-full">
              {images.map((img, index) => (
                <Slider.Item
                  index={index}
                  class="carousel-item w-full relative"
                >
                  <div class="absolute z-20 lg:bottom-3 bottom-5 left-3 text-sm/4 px-2 py-0.5 bg-white-200 rounded-2xl">
                    {index + 1} / {images.length}
                  </div>
                  <Image
                    class="w-full h-full mx-auto transition-3s lg:hover:scale-150 lg:hover:cursor-crosshair"
                    sizes="(max-width: 640px) 100vw, 40vw"
                    style={{ aspectRatio: ASPECT_RATIO }}
                    src={(img.url!).replace("w=420&h=420", "w=1000&h=1000")}
                    alt={img.alternateName}
                    width={WIDTH}
                    height={HEIGHT}
                    preload={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </Slider.Item>
              ))}
            </Slider>

            <Slider.PrevButton
              class="absolute left-4 top-1/2 disabled:opacity-50 hidden"
              disabled
            >
              <Icon
                id="chevron-right"
                width={9}
                height={18}
                class="rotate-180"
              />
            </Slider.PrevButton>

            <Slider.NextButton
              class="absolute right-4 top-1/2 disabled:opacity-50 hidden"
              disabled={images.length < 2}
            >
              <Icon id="chevron-right" width={9} height={18} />
            </Slider.NextButton>
          </div>
        </div>

        <div class={clx("lg:col-start-1 lg:col-span-1 lg:flex")}>
          <ul
            class={clx(
              "xl:carousel carousel-center w-full lg:h-[500px]",
              "sm:carousel-vertical md:flex md:justify-start flex justify-center gap-0 md:items-center md:flex-row lg:flex-col lg:justify-start",
              "lg:gap-2 max-w-full overflow-x-auto sm:overflow-y-auto md:justify-center",
            )}
          >
            {images.map((img, index) => (
              <li class="carousel-item lg:w-24 lg:h-24 h-1 w-[50px]">
                <Slider.Dot disabled={index===0} class="bg-gray-30 h-1 w-[50px] no-animation disabled:w-[50px] disabled:bg-black-5 transition-[width] disabled:rounded-full lg:bg-transparent lg:h-[unset] lg:w-[unset] lg:disabled:w-[unset] lg:disabled:bg-transparent lg:disabled:rounded-none " index={index}>
                  <Image
                    style={{ aspectRatio: "1 / 1" }}
                    class="hidden lg:block group-disabled:border-gray-150 border border-solid object-cover w-full h-full"
                    width={96}
                    height={96}
                    src={img.url!}
                    alt={img.alternateName}
                  />
                </Slider.Dot>
              </li>
            ))}
          </ul>
        </div>

        <Slider.JS rootId={id} />
      </div>
    </>
  );
}
