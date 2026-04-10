import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { relative } from "../../sdk/url.ts";
import AddToCartButtonPdp from "./AddToCartButtonPdp.tsx";
import OutOfStock from "./OutOfStock.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";
import ProductAccordion from "./ProductAccordion.tsx";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import ColorVariantSelector from "../../islands/ColorVariantSelector.tsx";
import ProductBadges from "./ProductBadges.tsx";

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

  // 🔍 DEBUG — Especificações de Produto
  console.log(
    "📦 isVariantOf.additionalProperty (specs do produto pai):",
    isVariantOf?.additionalProperty,
  );

  const modelSpecs = isVariantOf?.additionalProperty ?? [];
  const selosRaw = modelSpecs.find((s) => s.name === "Selos")?.value || "";
  const badges = selosRaw.split(";").map((s) => s.trim()).filter(Boolean);

  // ── Cores: produto atual + isSimilarTo ──────────────────────
  // A imagem de swatch tem imageLabel = "cor" → name = "cor" na ImageObject
  const getSwatchUrl = (
    images?: { url?: string; name?: string }[] | null,
  ) =>
    images?.find((img) => img.name?.toLowerCase() === "cor")?.url ??
      images?.[0]?.url ??
      "";

  const currentColor = {
    url: relative(product.url) ?? "/",
    name: product.name ?? "",
    subtitle: product.alternateName ?? "",
    imgUrl: getSwatchUrl(product.image),
  };
  const similarColors = (product.isSimilarTo ?? []).map((p) => ({
    url: relative(p.url) ?? "/",
    name: p.name ?? "",
    subtitle: p.alternateName ?? "",
    imgUrl: getSwatchUrl(p.image),
  }));
  const allColors = [currentColor, ...similarColors];
  const hasColors = allColors.length > 1;
  const selectedUrl = relative(product.url) ?? "/";
  // ────────────────────────────────────────────────────────────

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
        <div class="hidden lg:block mb-4 -mt-2 [&_.breadcrumbs]:lg:!pt-0">
          <Breadcrumb itemListElement={breadcrumbList?.itemListElement} />
        </div>
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

              {product.alternateName && (
                <div class="mt-2 flex flex-col font-Hanken-Grotesk">
                  <div
                    class="text-[#4C4C4C] text-[15px] leading-[22px]"
                    dangerouslySetInnerHTML={{ __html: product.alternateName }}
                  />
                  <div class="text-right mt-1">
                    <a
                      href="#product-description"
                      class="underline text-[#4C4C4C] text-[14px]"
                    >
                      Saiba mais
                    </a>
                  </div>
                </div>
              )}

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

        {/* Seletor de cores — abaixo da descrição */}
        {hasColors && (
          <ColorVariantSelector
            colors={allColors}
            selectedUrl={selectedUrl}
          />
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

        {badges.length > 0 && <ProductBadges badges={badges} />}
      </div>

      <div
        {...viewItemEvent}
        class="lg:hidden flex flex-col px-3 product-info-mobile"
        id={id}
      >
        <span class="text-base font-medium text-black-5 pb-2">
          {title}
        </span>

        {product.alternateName && (
          <div class="mt-0 mb-2 flex flex-col font-Hanken-Grotesk">
            <div
              class="text-[#4C4C4C] text-sm leading-[20px]"
              dangerouslySetInnerHTML={{ __html: product.alternateName }}
            />
            <div class="text-right mt-1">
              <a
                href="#product-description"
                class="underline text-[#4C4C4C] text-sm"
              >
                Saiba mais
              </a>
            </div>
          </div>
        )}

        {/* Seletor de cores mobile */}
        {hasColors && (
          <ColorVariantSelector
            colors={allColors}
            selectedUrl={selectedUrl}
          />
        )}

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

        {badges.length > 0 && <ProductBadges badges={badges} />}
      </div>
    </div>
  );
}

export default ProductInfo;
