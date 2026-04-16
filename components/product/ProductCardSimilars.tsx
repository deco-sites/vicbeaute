import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import WishlistButton from "../wishlist/WishlistButton.tsx";
import { useId } from "../../sdk/useId.ts";
import ProductCardColorSelector from "../../islands/ProductCardColorSelector.tsx";
import Icon from "../ui/Icon.tsx";

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

function ProductCardSimilars({
  product,
  preload,
  itemListName,
  index,
  class: _class,
}: Props) {
  const id = useId();

  const { url, image: images, offers, isVariantOf, aggregateRating } = product;
  const title = isVariantOf?.name ?? product.name;
  const variantName = product.name;
  const [front, back] = images ?? [];

  const { listPrice, price, seller = "1", availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
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

  const collectionTag = product?.additionalProperty?.filter((item) =>
    item?.description === "highlight"
  );

  const colorProp = (product?.isVariantOf?.additionalProperty ?? product?.additionalProperty ?? [])
    .find((a) => a.name === "Cores")?.value ?? "";

  // Extrair Similars
  const similars = product.isSimilarTo ?? [];

  // Construir a lista completa de opções (principal + similares)
  let allProducts: Product[] = [];
  if (similars.length > 0) {
    allProducts = [product, ...similars];
  } else {
    // Fallback pra variações nativas caso a API retorne em isVariantOf.hasVariant (menos comum para Cores no caso da Vic, mas de prevencao)
    allProducts = product.isVariantOf?.hasVariant ?? [product];
  }

  // Deduplicar produtos pelo ID ou nome para evitar duplicações se as APIs retornarem o mesmo item 2 vezes
  allProducts = Array.from(
    new Map(allProducts.map((p) => [p.productID, p])).values(),
  );

  return (
    <div
      {...event}
      class={clx(
        "card card-compact group text-sm w-full xl:max-w-[300px] max-w-[220px] bg-white-15 rounded-lg relative overflow-hidden",
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
            <div class="hidden absolute top-0 bg-red-400 w-full items-center justify-center p-1 max-w-vc-106 h-6 rounded z-10">
              {collectionTag?.[0]?.value}
            </div>
          )}

          <Image
            src={front?.url!}
            alt={front?.alternateName}
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
            src={back?.url ?? front?.url!}
            alt={back?.alternateName ?? front?.alternateName}
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

        <div class="hidden absolute bottom-0 right-0 z-10">
          <WishlistButton item={item} variant="icon" />
        </div>

        <div class="absolute bottom-1 left-1 z-20">
          <ProductCardColorSelector
            products={allProducts}
            currentProductId={product.productID}
          />
        </div>
      </figure>

      <div class="xl:px-3 px-2 xl:pt-[14px] pt-[10px] xl:pb-4 pb-[11px] flex flex-col flex-grow">
        <a href={relativeUrl} class="block flex-grow focus:outline-none">
          <span class="font-hanken-grotesk xl:text-[12px] text-vc-10 text-[#4c4c4c] line-clamp-1">
            {colorProp || variantName}
          </span>
          <h3 class="text-[#363931] font-hanken-grotesk text-[16px] line-clamp-2 min-h-[42px] flex items-center">
            {title}
          </h3>

          <div class="flex items-center gap-1 mt-1 h-[18px]">
            {aggregateRating && (aggregateRating.ratingValue ?? 0) > 0 && (
              <>
                  <Icon id="star-konfidency" size={14} />
                <span class="font-hanken-grotesk text-[12px] text-[#363931] leading-none">
                  {(aggregateRating.ratingValue ?? 0).toFixed(1).replace(".", ",")}
                </span>
                <span class="font-hanken-grotesk text-[12px] text-[#363931] leading-none">
                  ({aggregateRating.reviewCount})
                </span>
              </>
            )}
          </div>

          <div
            class={clx(
              "flex flex-wrap gap-x-[4px] gap-y-0.5 pt-1 items-end min-h-[32px] mt-1",
              price === 0 ? "text-transparent" : "",
            )}
          >
            {listPrice && listPrice !== price && (
              <span class="line-through font-Manrope text-[#a1a1aa] text-[11px] block w-full leading-[10px]">
                {formatPrice(listPrice, offers?.priceCurrency)}
              </span>
            )}
            <span class="font-bold font-hanken-grotesk text-[22px] sm:text-[16px] text-[#455C42] leading-none">
              {formatPrice(price, offers?.priceCurrency)}
            </span>
          </div>
        </a>
      </div>

      <div class="px-1.5 pb-1.5 mt-auto">
        {inStock
          ? (
            <div
              class={clx(
                "btn border-none text-sm no-animation w-full px-0 lg:text-[14px]",
                "flex justify-center rounded-sm mx-auto bg-[#455C42] hover:bg-[#3d513a] text-[#D5D8C2] font-medium min-h-[40px] h-[40px]",
              )}
              // Temporary unavailable state based on original product card logic.
              // Wait, the original had 'Produto Indisponível' on BOTH branches??? Let me fix it based on the screenshots: it's 'Compre agora' with a bag icon.
            >
              Compre agora{" "}
              <span class="ml-1">
                <Icon
                  id="bag-cards"
                  width="15"
                  height="16"
                />
              
              </span>
            </div>
          )
          : (
            <div
              class={clx(
                "btn border-none text-[13px] no-animation w-full px-0 lg:text-[14px]",
                "disabled:!bg-transparent hover:!text-error disabled:!text-error",
                "flex justify-center rounded-sm mx-auto bg-gray-30 font-Inter text-black-15 font-medium min-h-[40px] h-[40px]",
              )}
            >
              Indisponível
            </div>
          )}
      </div>
    </div>
  );
}

export default ProductCardSimilars;
