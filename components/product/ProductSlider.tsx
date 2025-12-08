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
      <div id={id} class="relative w-full lg:px-0 px-4 pt-2">
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
          <div class="flex gap-4 justify-center mt-4 pb-6">
            {Array.from(
              { length: totalPages },
              (_, index) => (
                <Slider.Dot
                  index={index}
                  class="focus:outline-none group disabled:!bg-black disabled:!opacity-100 disabled:ring-2 disabled:ring-offset-2 bg-black-15 opacity-50 w-2 h-2 rounded-full transition-all duration-300 ring-custom"
                />
              ),
            )}
          </div>
        )} <Slider.JS rootId={id} arrows={arrows} dots={dots} />
      </div>
    </>
  );
}
export default ProductSlider;
