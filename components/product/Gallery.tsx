import { ProductDetailsPage } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import ProductImageZoom from "./ProductImageZoom.tsx";
import Icon from "../ui/Icon.tsx";
import Slider from "../ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useState } from "preact/hooks";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

const WIDTH = 820;
const HEIGHT = 615;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

export default function GallerySlider(props: Props) {
  const id = useId();
  const zoomId = `${id}-zoom`;

  if (!props.page) {
    throw new Error("Missing Product Details Page Info");
  }

  const { page: { product: { name, isVariantOf, image: pImages } } } = props;

  const groupImages = (isVariantOf?.image ?? pImages ?? []).filter(
    (img) => img.name?.toLowerCase() !== "cor",
  );
  const filtered = groupImages.filter((img) =>
    name?.includes(img.alternateName || "")
  );
  const images = filtered.length > 0 ? filtered : groupImages;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <>
      <div
        id={id}
        class="grid grid-flow-row sm:grid-flow-col grid-cols-1 sm:grid-cols-[min-content_1fr] gap-5"
      >
        <div class="col-start-1 col-span-1 sm:col-start-2">
          <div class="relative h-min flex-grow">
            <Image
              class="w-full"
              sizes="(max-width: 640px) 100vw, 40vw"
              style={{ aspectRatio: ASPECT_RATIO }}
              src={images[currentImageIndex]?.url!}
              alt={images[currentImageIndex]?.alternateName}
              width={WIDTH}
              height={HEIGHT}
            />

            <Slider.PrevButton
              class="no-animation absolute left-2 top-1/2 btn btn-circle btn-outline disabled:invisible"
              onClick={() =>
                setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
              disabled={currentImageIndex === 0}
            >
              <Icon id="chevron-right" class="rotate-180" />
            </Slider.PrevButton>

            <Slider.NextButton
              class="no-animation absolute right-2 top-1/2 btn btn-circle btn-outline disabled:invisible"
              onClick={() =>
                setCurrentImageIndex(
                  Math.min(images.length - 1, currentImageIndex + 1),
                )}
              disabled={currentImageIndex === images.length - 1}
            >
              <Icon id="chevron-right" />
            </Slider.NextButton>

            <div class="absolute top-2 right-2 bg-base-100 rounded-full">
              <label class="btn btn-ghost hidden sm:inline-flex" for={zoomId}>
                <Icon id="pan_zoom" />
              </label>
            </div>
          </div>
        </div>

        <div class="col-start-1 col-span-1">
          <ul
            class={clx(
              "carousel carousel-center",
              "sm:carousel-vertical",
              "gap-2",
              "max-w-full",
              "overflow-x-auto",
              "sm:overflow-y-auto",
            )}
            style={{ maxHeight: "600px" }}
          >
            {images.map((img, index) => (
              <li class="carousel-item w-16 h-16" key={index}>
                <button
                  onClick={() =>
                    setCurrentImageIndex(index)}
                  class={clx(
                    "group-disabled:border-base-400 border rounded object-cover w-full h-full",
                    index === currentImageIndex
                      ? "border-primary"
                      : "border-transparent",
                  )}
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <Image
                    class="object-cover w-full h-full"
                    width={64}
                    height={64}
                    src={img.url!}
                    alt={img.alternateName}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ProductImageZoom
        id={zoomId}
        images={images}
        currentImageIndex={currentImageIndex}
        width={700}
        height={Math.trunc(700 * HEIGHT / WIDTH)}
      />
    </>
  );
}
