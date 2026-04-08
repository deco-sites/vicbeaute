import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import AddToCartButtonPdp from "./AddToCartButtonPdp.tsx";
import OutOfStock from "./OutOfStock.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";
import ProductAccordion from "./ProductAccordion.tsx";

interface Props {
  page: ProductDetailsPage | null;
}

function formatPriceWithStyledSymbol(value: number, currency?: string) {
  const fullPrice = formatPrice(value, currency);
  const match = fullPrice?.match(/^(R\$)(.*)$/);
  if (!match) return fullPrice;
  return (
    <>
      <span class="text-[20px] text-xl text-blue-5 lg:font-bold">
        {match[1]}
      </span>
      <span class="items-start flex font-bold text-[26px] text-blue-5">
        {match[2]}
      </span>
    </>
  );
}

function ProductInfo({ page }: Props) {
  const id = useId();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { breadcrumbList, product } = page;
  const { productID, offers, isVariantOf } = product;
  const title = isVariantOf?.name ?? product.name;

  const { price = 0, listPrice = 0, seller = "1", availability } = useOffer(
    offers,
  );

  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };

  const item = mapProductToAnalyticsItem({
    product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
  });

  const viewItemEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item",
      params: {
        item_list_id: "product",
        item_list_name: "Product",
        items: [item],
      },
    },
  });

  const hasValidVariants = isVariantOf?.hasVariant?.some(
    (variant) =>
      variant?.name?.toLowerCase() !== "title" &&
      variant?.name?.toLowerCase() !== "default title",
  ) ?? false;

  return (
    <div>
      <div
        {...viewItemEvent}
        class="lg:flex hidden flex-col product-info"
        id={id}
      >
        {product.gtin && (
          <>
            <span class="text-sm text-gray-60">
              Ref.: {product.gtin}
            </span>

            {/* NOVA DIV envolvendo título + preços */}
            <div>
              <h1
                class={clx(
                  "text-3xl font-semibold lg:font-normal lg:font-Poppins",
                  "pt-4 lg:pt-1",
                )}
              >
                {title}
              </h1>

              <div class="flex gap-1 pt-1 lg:pt-[6px] flex-col-reverse min-h-[62px]">
                <span class="text-3xl font-semibold text-base-400 lg:flex items-center">
                  {formatPriceWithStyledSymbol(price, offers?.priceCurrency)}
                  <span
                    class={clx(
                      "text-sm font-semibold text-white bg-orange-5 text-center rounded px-1 no-underline h-[17px] ml-4",
                      percent < 1 && "opacity-0",
                    )}
                  >
                    -{percent}%
                  </span>
                </span>
                {listPrice > price && (
                  <span class="line-through text-xs text-gray-35">
                    {formatPrice(listPrice, offers?.priceCurrency)}
                  </span>
                )}
              </div>
            </div>
            {/* FIM NOVA DIV */}
          </>
        )}

        {hasValidVariants && (
          <div className="mt-4 sm:mt-8 lg:hidden">
            <ProductSelector product={product} />
          </div>
        )}

        <div class="mt-4 sm:mt-[14px] flex flex-col gap-2">
          {availability === "https://schema.org/InStock"
            ? (
              <AddToCartButtonPdp
                item={item}
                seller={seller}
                product={product}
                class="btn btn-primary no-animation"
                disabled={false}
              />
            )
            : <OutOfStock productID={productID} />}
        </div>
      </div>

      <div
        {...viewItemEvent}
        class="lg:hidden flex flex-col px-3 product-info-mobile"
        id={id}
      >
        <span class="text-base font-medium text-black-5 pb-2">
          {title}
        </span>

        {product.gtin && (
          <span class="text-xs text-gray-35 pb-2">
            Ref.: {product.gtin}
          </span>
        )}

        <div class="flex gap-1 flex-col-reverse">
          <span class="text-[26px] font-bold text-blue-5 align-top justify-start flex items-center">
            {formatPriceWithStyledSymbol(price, offers?.priceCurrency)}
            <span
              class={clx(
                "text-sm font-semibold text-white bg-orange-5 text-center rounded px-1 no-underline h-[17px] ml-4",
                percent < 1 && "opacity-0",
              )}
            >
              -{percent}%
            </span>
          </span>
          {listPrice > price && (
            <span class="line-through text-xs text-gray-35">
              {formatPrice(listPrice, offers?.priceCurrency)}
            </span>
          )}
        </div>

        {hasValidVariants && (
          <div className="mt-[14px] sm:mt-8 hidden">
            <ProductSelector product={product} />
          </div>
        )}

        <div
          id="add-to-cart-quantity-pdp"
          class="mt-3 lg:mt-10 flex flex-col gap-2 pb-7"
        >
          {availability === "https://schema.org/InStock"
            ? (
              <AddToCartButtonPdp
                item={item}
                seller={seller}
                product={product}
                class="btn btn-primary no-animation"
                disabled={false}
              />
            )
            : <OutOfStock productID={productID} />}
        </div>

        <div class="mt-4 sm:mt-6 border-t">
          <ProductAccordion page={page} />
        </div>
      </div>
    </div>
  );
}

export default ProductInfo;
