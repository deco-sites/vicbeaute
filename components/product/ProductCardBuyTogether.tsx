import type { Product } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import Icon from "../ui/Icon.tsx";
import ProductCardColorSelector from "../../islands/ProductCardColorSelector.tsx";

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
  const { url, image: images, offers, isVariantOf, aggregateRating } = product;
  const title = isVariantOf?.name ?? product.name;
  const variantName = product.name;
  const [front, back] = images ?? [];

  const { price, installments } = useOffer(offers);
  const relativeUrl = relative(url);

  // Formatar preço matematicamente para evitar duplicação de R$ vinda do formatPrice padrão
  const formattedThousands = new Intl.NumberFormat("pt-BR").format(
    Math.floor(price ?? 0),
  );
  const centsStr = price
    ? Math.round((price % 1) * 100).toString().padStart(2, "0")
    : "00";
  const currency = "R$";

  const colorProp =
    (product?.isVariantOf?.additionalProperty ?? product?.additionalProperty ??
      [])
      .find((a) => a.name === "Cores")?.value ?? "";

  // Construir a lista completa de opções (principal + similares) para as cores
  let allProducts: Product[] = [];
  const similars = product.isSimilarTo ?? [];
  if (similars.length > 0) {
    allProducts = [product, ...similars];
  } else {
    allProducts = product.isVariantOf?.hasVariant ?? [product];
  }
  allProducts = Array.from(
    new Map(allProducts.map((p) => [p.productID, p])).values(),
  );

  return (
    <div
      class={clx(
        "card card-compact group text-sm w-full bg-white-15 rounded-lg relative overflow-hidden",
        _class,
      )}
    >
      <figure
        class={clx(
          "relative bg-base-200 rounded border border-transparent",
        )}
        style={{ aspectRatio: ASPECT_RATIO }}
      >
        <a
          href={relativeUrl}
          aria-label="view product"
          class="w-full h-full flex items-center justify-center absolute top-0 left-0"
        >
          <Image
            src={front?.url!}
            alt={front?.alternateName}
            width={150}
            height={150}
            style={{ aspectRatio: ASPECT_RATIO }}
            class="block xl:hidden object-cover w-full h-full"
            sizes="(max-width: 150px) 100vw, 30vw"
            loading="lazy"
            decoding="async"
          />
          <Image
            src={front?.url!}
            alt={front?.alternateName}
            width={300}
            height={300}
            class="hidden xl:block object-cover w-full h-full"
            sizes="(max-width: 150px) 100vw, 30vw"
            loading="lazy"
            decoding="async"
          />
        </a>

        {/* Avaliação em cima da imagem APENAS no Mobile */}
        <div class="absolute lg:hidden top-1 right-1 flex items-center gap-[2px] z-20">
          <Icon id="star-konfidency" size={12} />
          <span class="font-Hanken-Grotesk text-[12px] text-[#363931] leading-none pt-[1px]">
            {(aggregateRating?.ratingValue ?? 4.2).toFixed(1).replace(".", ",")}
          </span>
        </div>

        <div class="absolute bottom-1 left-1 z-20">
          <ProductCardColorSelector
            products={allProducts}
            currentProductId={product.productID}
          />
        </div>
      </figure>

      <div class="xl:px-3 px-[5px] pt-[6px] xl:pt-[14px] pb-[11px] xl:pb-4 flex flex-col flex-grow text-left">
        <a
          href={relativeUrl}
          class="block flex-grow focus:outline-none text-left"
        >
          <span class="hidden xl:block font-hanken-grotesk text-[11px] xl:text-[12px] text-vc-10 text-[#4c4c4c] line-clamp-1">
            {colorProp || variantName}
          </span>
          <h3 class="font-Hanken-Grotesk text-[14px] xl:text-[16px] line-clamp-2 text-[#191C1F] flex items-center">
            {title}
          </h3>

          <div class="hidden lg:flex items-center gap-1 mt-1 h-[18px]">
            <Icon id="star-konfidency" size={14} />
            <span class="font-Hanken-Grotesk text-[12px] text-[#363931] leading-none">
              {(aggregateRating?.ratingValue ?? 4.8).toFixed(1).replace(
                ".",
                ",",
              )}
            </span>
            <span class="font-Hanken-Grotesk text-[12px] text-[#363931] leading-none">
              ({aggregateRating?.reviewCount ?? 263})
            </span>
          </div>

          <div class="flex flex-col gap-y-0.5 items-start mt-[8px] xl:mt-[6px]">
            <div class="flex items-baseline font-Hanken-Grotesk text-[#4D5D49] leading-none">
              <span class="font-medium text-[16px] mr-1">{currency}</span>
              <span class="font-semibold text-[22px]">
                {formattedThousands}
              </span>
              <span class="font-medium text-[16px]">,{centsStr}</span>
            </div>
            {installments && (
              <span class="text-[11px] font-Manrope text-[#4A4A4A] mt-[4px]">
                {installments}
              </span>
            )}
          </div>
        </a>
      </div>
    </div>
  );
}

export default ProductCardBuyTogether;
