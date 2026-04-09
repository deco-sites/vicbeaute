import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { useVariantPossibilities } from "../../sdk/useVariantPossiblities.ts";
import WishlistButton from "../wishlist/WishlistButton.tsx";
import AddToCartButton from "./AddToCartButton.tsx";
import { Ring } from "./ProductVariantSelector.tsx";
import { useId } from "../../sdk/useId.ts";

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  /** @description used for analytics event */
  itemListName?: string;

  /** @description index of the product card in the list */
  index?: number;

  class?: string;
}

const WIDTH = 287;
const HEIGHT = 287;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

function ProductCard({
  product,
  preload,
  itemListName,
  index,
  class: _class,
}: Props) {
  const id = useId();

  const { url, image: images, offers, isVariantOf } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const title = isVariantOf?.name ?? product.name;
  const variantName = product.name;
  const [front, back] = images ?? [];

  const { listPrice, price, seller = "1", availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const possibilities = useVariantPossibilities(hasVariant, product);
  const firstSkuVariations = Object.entries(possibilities)?.[0];
  const variants = Object.entries(firstSkuVariations?.[1] ?? {});
  const relativeUrl = relative(url);
  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  const item = mapProductToAnalyticsItem({ product, price, listPrice, index });

  {/* Add click event to dataLayer */}
  const event = useSendEvent({
    on: "click",
    event: {
      name: "select_item" as const,
      params: {
        item_list_name: itemListName,
        items: [item],
      },
    },
  });

  const firstVariantName = firstSkuVariations?.[0]?.toLowerCase();
  const shoeSizeVariant = "shoe size";

  const collectionTag = product?.additionalProperty?.filter((item) =>
    item?.description === "highlight"
  );

  return (
    <div
      {...event}
      class={clx(
        "card card-compact group text-sm lg:max-w-vc-210 border border-gray-15 rounded-lg",
        _class,
      )}
      data-cy={`product-card-${title?.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <figure
        class={clx(
          "relative bg-base-200",
          "rounded border border-transparent",
        )}
        style={{ aspectRatio: ASPECT_RATIO }}
      >
        <a
          href={relativeUrl}
          aria-label="view product"
          class={clx(
            "absolute top-0 left-0",
            "grid grid-cols-1 grid-rows-1",
            "w-full",
            !inStock && "opacity-70",
          )}
        >
          {collectionTag?.[0]?.value && (
            <div class="hidden absolute top-0 bg-red-400 w-full items-center justify-center p-1 max-w-vc-106 h-6 rounded">
              {collectionTag?.[0]?.value}
            </div>
          )}
          <Image
            src={front.url!}
            alt={front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-cover",
              "rounded w-full",
              "col-span-full row-span-full",
            )}
            sizes="(max-width: 150px) 50vw, 20vw"
            preload={preload}
            loading={preload ? "eager" : "lazy"}
            decoding="async"
          />
          <Image
            src={back?.url ?? front.url!}
            alt={back?.alternateName ?? front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-cover",
              "rounded w-full",
              "col-span-full row-span-full",
              "transition-opacity opacity-0 lg:group-hover:opacity-100",
            )}
            sizes="(max-width: 640px) 50vw, 20vw"
            loading="lazy"
            decoding="async"
          />
        </a>

        <div class="hidden absolute bottom-0 right-0">
          <WishlistButton item={item} variant="icon" />
        </div>
      </figure>

      <a href={relativeUrl} class="py-1 px-1">
        <span class="font-Manrope text-vc-10 text-black-20">
          {variantName }
        </span>
        <h3 class="font-Manrope font-medium text-xs text-black-35 line-clamp-2 min-h-8">
          {title}
        </h3>

        <div
          class={clx(
            "flex gap-[2px] pt-1 min-h-[32px]",
            price === 0 ? "text-transparent" : "",
          )}
        >
          {listPrice && listPrice !== price && (
            <span class="line-through font-Manrope text-gray-400 text-xs">
              {formatPrice(listPrice, offers?.priceCurrency)}
            </span>
          )}
          <span class="font-bold font-Manrope text-lg text-green-10">
            {formatPrice(price, offers?.priceCurrency)}
          </span>
        </div>
      </a>

      {variants.length > 1 && firstVariantName !== shoeSizeVariant && (
        <ul class="flex items-center justify-start gap-2 pt-4 pb-1 pl-1 overflow-x-auto">
          {variants.map(([value, link]) => [value, relative(link)] as const)
            .map(([value, link]) => (
              <li>
                <a href={link} class="cursor-pointer">
                  <input
                    class="hidden peer"
                    type="radio"
                    name={`${id}-${firstSkuVariations?.[0]}`}
                    checked={link === relativeUrl}
                  />
                  <Ring value={value} checked={link === relativeUrl} />
                </a>
              </li>
            ))}
        </ul>
      )}

      <div class="flex-grow" />

      <div class="p-1">
        {inStock
          ? (
            <div
              class={clx(
                "btn",
                "border-none text-sm no-animation w-full",
                "flex w-full justify-center rounded-lg mx-auto bg-green-10 font-Manrope font-medium text-xs text-green-5 px-0 lg:text-base",
              )}
            >
              Produto Indisponível
            </div>
          )
          : (
            <div
              class={clx(
                "btn",
                "border-none text-sm no-animation w-full",
                "disabled:!bg-transparent",
                "hover:!text-error disabled:!text-error",
                "flex w-full max-w-vc-152 justify-center rounded-lg mx-auto bg-gray-30 font-Inter text-black-15 font-medium text-base px-0 lg:text-base",
              )}
            >
              Produto Indisponível
            </div>
          )}
      </div>
    </div>
  );
}

export default ProductCard;
