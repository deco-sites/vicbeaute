import { Product } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import Icon from "../ui/Icon.tsx";
import Slider from "../ui/Slider.tsx";
import ProductCard from "./ProductCard.tsx";
import { useId } from "../../sdk/useId.ts";
import { useDevice as useDevice } from "@deco/deco/hooks";

export interface ProductSliderProps {
  products: Product[];
  itemListName?: string;
  arrows?: boolean;
  dots?: boolean;
}
function ProductSlider(
  { products, itemListName, arrows = true, dots = true }: ProductSliderProps,
) {
  const id = useId();
  const device = useDevice()
  const itemsPerPage = device === "mobile" ? 2 : 5;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <>
      <div id={id} class="relative w-full lg:px-0 pl-3 pt-2">
        <Slider id="shelf-slider">
          {products?.map((product, index) => (
            <Slider.Item index={index}>
              <ProductCard
                class="product-slider"
                index={index}
                product={product}
                itemListName={itemListName}
              />
            </Slider.Item>
          ))}
        </Slider>{" "}
        {arrows && (
          <>
            <div class="hidden xl:flex absolute inset-y-0 left-[-40px] items-center">
              <Slider.PrevButton>
                <Icon
                  class="text-base-100"
                  size={24}
                  id="arrow-left-shelf"
                  strokeWidth={3}
                />
              </Slider.PrevButton>
            </div>{" "}
            <div class="hidden xl:flex absolute inset-y-0 right-[-40px] items-center">
              <Slider.NextButton>
                <Icon
                  class="text-base-100"
                  size={24}
                  id="arrow-right-shelf"
                  strokeWidth={3}
                />
              </Slider.NextButton>
            </div>
          </>
        )}{" "}
        {dots && (
          <>
            <style
              dangerouslySetInnerHTML={{
                __html: `
                .productslider-dots-tracker [data-dot] {
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
                .productslider-dots-tracker [data-dot]:disabled {
                  background-color: #455C42 !important;
                }
              `,
              }}
            />
            <div class="flex w-full lg:max-w-[351px] px-4 lg:px-0 gap-0 productslider-dots-tracker justify-center mx-auto mt-4 pb-6">
              {Array.from(
                { length: totalPages },
                (_, index) => (
                  <div key={index} class="carousel-item flex-1">
                    <Slider.Dot
                      index={index}
                      class="w-full"
                    />
                  </div>
                ),
              )}
            </div>
          </>
        )} <Slider.JS rootId={id} arrows={arrows} dots={dots} />
      </div>
    </>
  );
}
export default ProductSlider;
