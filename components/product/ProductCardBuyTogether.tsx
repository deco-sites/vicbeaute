import type { Product } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import Icon from "../ui/Icon.tsx";

interface Props {
  product: Product;
  /** @description index of the product card in the list */
  index?: number;
  class?: string;
}

const WIDTH = 287;
const HEIGHT = 287;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

function ProductCardBuyTogether({ product, class: _class }: Props) {
  const { url, image: images, offers, isVariantOf } = product;
  const title = isVariantOf?.name ?? product.name;
  const [front, back] = images ?? [];

  const { price } = useOffer(offers);
  const relativeUrl = relative(url);

  // Formatar preço com partes separadas, ex: "R$" "99" ",00"
  const formattedPrice = formatPrice(price, offers?.priceCurrency);
  let currency = "R$";
  let mainPrice = "0";
  let cents = "00";

  if (formattedPrice) {
    const parts = formattedPrice.split(",");
    if (parts.length > 1) {
      const firstPart = parts[0];
      const match = firstPart.match(/^([^\\d]+)(\\d.*)$/);
      if (match) {
        currency = match[1].trim();
        mainPrice = match[2];
      } else {
        mainPrice = firstPart;
      }
      cents = parts[1];
    } else {
      const match = formattedPrice.match(/^([^\\d]+)(\\d.*)$/);
      if (match) {
        currency = match[1].trim();
        mainPrice = match[2];
      } else {
        mainPrice = formattedPrice;
      }
    }
  }

  // Pegando a nota média (mocada ou extraída se existir, o design mostra 4,2)
  const ratingValue = product.aggregateRating?.ratingValue ?? "4,2";

  return (
    <div
      class={clx(
        "flex flex-col gap-3 group text-sm w-full max-w-[287px] bg-white rounded-lg",
        _class,
      )}
    >
      <figure
        class={clx(
          "relative bg-[#F4F4F4] rounded-lg overflow-hidden flex items-center justify-center p-2",
        )}
        style={{ aspectRatio: ASPECT_RATIO }}
      >
        <a href={relativeUrl} aria-label="view product" class="w-full h-full flex items-center justify-center">
          <Image
            src={front.url!}
            alt={front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: ASPECT_RATIO }}
            class="object-contain w-full h-full mix-blend-multiply"
            sizes="(max-width: 150px) 100vw, 30vw"
            loading="lazy"
            decoding="async"
          />
        </a>

        {/* Rating badge nativo do design */}
        <div class="absolute top-2 right-2 flex items-center gap-1 text-[11px] font-bold text-[#4a4a4a]">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 0L6.12257 3.45492H9.75528L6.81636 5.59017L7.93893 9.04508L5 6.90983L2.06107 9.04508L3.18364 5.59017L0.244718 3.45492H3.87743L5 0Z" />
          </svg>
          {ratingValue}
        </div>
      </figure>

      <a href={relativeUrl} class="flex flex-col gap-1 px-1">
        <h3 class="font-Manrope font-medium text-[14px] leading-tight text-[#4a4a4a] min-h-10">
          {title}
        </h3>

        <div class="flex items-baseline text-[#4a4a4a] mt-1 font-Manrope">
          <span class="text-[12px] mr-1">{currency}</span>
          <span class="text-[20px] font-bold">{mainPrice}</span>
          <span class="text-[12px]">,{cents}</span>
        </div>
      </a>
    </div>
  );
}

export default ProductCardBuyTogether;
