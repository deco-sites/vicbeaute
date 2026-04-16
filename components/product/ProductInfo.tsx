import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { relative } from "../../sdk/url.ts";
import AddToCartButtonPdp from "../../components/product/AddToCartButtonPdp.tsx";
import WishlistButton from "../wishlist/WishlistButton.tsx";
import Icon from "../ui/Icon.tsx";
import AddToCartSticky from "./AddToCartSticky.tsx";
import OutOfStock from "./OutOfStock.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";
import ProductAccordion from "./ProductAccordion.tsx";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import ColorVariantSelector from "../../islands/ColorVariantSelector.tsx";
import ProductBadges from "./ProductBadges.tsx";
import ShippingSimulation from "../shipping/Form.tsx";

interface Props {
  page: ProductDetailsPage | null;
}

function formatPriceWithStyledSymbol(value: number, currency?: string) {
  const fullPrice = formatPrice(value, currency);
  const match = fullPrice?.match(/^(R\$)(.*)$/);
  if (!match) return fullPrice;
  return (
    <>
      <span class="text-[20px] text-xl text-green-10 lg:font-bold">
        {match[1]}&nbsp;
      </span>
      <span class="items-start flex font-bold text-[26px] text-green-10">
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

  // Remover DEBUG antigo do ProductInfo

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

  const similars = product.isSimilarTo ?? [];
  let allProducts = similars.length > 0
    ? [product, ...similars]
    : (product.isVariantOf?.hasVariant ?? [product]);

  // Deduplicar por productID (único por produto). Usar Set para preservar a PRIMEIRA ocorrência,
  // garantindo que o produto atual (primeiro da lista) nunca seja substituído por um similar com mesmo nome.
  const seenIds = new Set<string>();
  allProducts = allProducts.filter((p) => {
    const key = p.productID ?? p.sku ?? p.name ?? "";
    if (seenIds.has(key)) return false;
    seenIds.add(key);
    return true;
  });

  // Extrai a cor do SKU (spec "Cor" no nível de SKU)
  const getSkuColor = (p: typeof product) =>
    p.additionalProperty?.find((a) => a.name === "Cor")?.value ?? p.name ?? "";

  // Extrai o atributo "Cores" do produto (spec no nível de produto)
  const getProductCores = (p: typeof product) =>
    (p.isVariantOf?.additionalProperty ?? p.additionalProperty ?? [])
      .find((a) => a.name === "Cores")?.value ?? "";

  const allColors = allProducts
    .filter((p) => {
      const url = relative(p.url);
      return url && url !== "/"; // Apenas produtos com URL válida e não-raiz
    })
    .map((p) => ({
      url: relative(p.url)!,
      name: getSkuColor(p), // Cor do SKU  (ex: "Preto", "Corada")
      subtitle: getProductCores(p), // Atributo "Cores" do produto (ex: "Coral")
      imgUrl: getSwatchUrl(p.image),
    }));
  const hasColors = allColors.length > 1; // Exibe seletor apenas quando há mais de 1 cor
  const selectedUrl = relative(product.url) ?? "/";
  // ────────────────────────────────────────────────────────────

  const { price = 0, listPrice = 0, seller = "1", availability, installments } =
    useOffer(
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
        class="lg:flex hidden flex-col product-info max-w-[350px]"
        id={id}
      >
        <div class="hidden lg:block mb-[30px] -mt-2 [&_.breadcrumbs]:lg:!pt-0">
          <Breadcrumb itemListElement={breadcrumbList?.itemListElement} />
        </div>
        {product.gtin && (
          <>
            <span class="text-[10px] text-black-10">
              Ref.: {product.gtin}
            </span>

            {/* NOVA DIV envolvendo título + preços */}
            <div>
              <h1
                class={clx(
                  "text-3xl text-pink-5 font-semibold lg:font-normal lg:font-Queens",
                  "pt-[30px]",
                )}
              >
                {title}
              </h1>

              {product.alternateName && (
                <div class="flex flex-col font-Hanken-Grotesk">
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

              {/* Preços originais removidos daqui. Agora estão dentro do AddToCartBox abaixo. */}
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

        {/* ADD TO CART BOX */}
        <div class="mt-4 sm:mt-[14px] bg-green-15 p-4 rounded-md flex flex-col gap-4">
          <div class="flex flex-col gap-1 items-center justify-center">
            <div class="flex items-center gap-2">
              {listPrice > price && (
                <span class="line-through text-sm text-gray-5">
                  {formatPrice(listPrice, offers?.priceCurrency)}
                </span>
              )}
              <span class="text-[26px] font-bold text-green-10 flex justify-center items-center">
                {formatPrice(price, offers?.priceCurrency)}
              </span>
              {percent > 0 && (
                <span class="text-[10px] font-bold text-white bg-[#EE3730] rounded px-[6px] py-[2px] ml-1">
                  -{percent}% OFF
                </span>
              )}
            </div>
            {installments && (
              <span class="text-xs text-green-10 text-center sm:text-left mt-[-4px] font-Hanken-Grotesk">
                {installments}
              </span>
            )}
            <div class="flex items-center gap-1 justify-center">
              <span class="text-xs text-green-10 text-center font-Hanken-Grotesk">
                Tenha 5% de desconto no PIX
              </span>
              <Icon
                id="pdpPix"
                size={13}
                strokeWidth={1}
                class="text-black-20"
              />
            </div>
          </div>

          <div class="flex items-center gap-2 w-full">
            {availability === "https://schema.org/InStock"
              ? (
                <>
                  <AddToCartButtonPdp
                    item={item}
                    seller={seller}
                    product={product}
                    class="btn btn-primary no-animation flex-1 bg-green-10 hover:bg-green-10 text-white border-none min-h-[45px]"
                    disabled={false}
                  />
                  <WishlistButton variant="pdp" item={item} />
                </>
              )
              : <OutOfStock productID={productID} />}
          </div>
        </div>

        {badges.length > 0 && <ProductBadges badges={badges} />}

        <ShippingSimulation
          items={[
            {
              id: Number(product.sku),
              quantity: 1,
              seller: seller,
            },
          ]}
        />
      </div>

      <div
        {...viewItemEvent}
        class="lg:hidden flex flex-col px-3 product-info-mobile"
        id={id}
      >
        <div>
          <h1
            class={clx(
              "text-3xl text-pink-5 font-normal font-Queens"
            )}
          >
            {title}
          </h1>

          {product.alternateName && (
            <div class="flex flex-col font-Hanken-Grotesk">
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

          {/* Preços originais removidos daqui. Agora estão dentro do AddToCartBox abaixo. */}
        </div>

        {/* Seletor de cores mobile */}
        {hasColors && (
          <ColorVariantSelector
            colors={allColors}
            selectedUrl={selectedUrl}
          />
        )}

        {hasValidVariants && (
          <div className="mt-[14px] sm:mt-8 hidden">
            <ProductSelector product={product} />
          </div>
        )}

        {/* ADD TO CART BOX MOBILE */}
        <div class="mt-4 sm:mt-[14px] bg-green-15 p-4 rounded-md flex flex-col gap-4">
          <div class="flex flex-col gap-1 items-center justify-center">
            <div class="flex items-center gap-2">
              {listPrice > price && (
                <span class="line-through text-sm text-gray-5">
                  {formatPrice(listPrice, offers?.priceCurrency)}
                </span>
              )}
              <span class="text-[26px] font-bold text-green-10 flex justify-center items-center">
                {formatPrice(price, offers?.priceCurrency)}
              </span>
              {percent > 0 && (
                <span class="text-[10px] font-bold text-white bg-[#EE3730] rounded px-[6px] py-[2px] ml-1">
                  -{percent}% OFF
                </span>
              )}
            </div>
            {installments && (
              <span class="text-xs text-green-10 text-center sm:text-left mt-[-4px] font-Hanken-Grotesk">
                {installments}
              </span>
            )}
            <div class="flex items-center gap-1 justify-center">
              <span class="text-xs text-green-10 text-center font-Hanken-Grotesk">
                Tenha 5% de desconto no PIX
              </span>
              <Icon
                id="pdpPix"
                size={13}
                strokeWidth={1}
                class="text-black-20"
              />
            </div>
          </div>

          <div class="flex items-center gap-2 w-full">
            {availability === "https://schema.org/InStock"
              ? (
                <>
                  <AddToCartButtonPdp
                    item={item}
                    seller={seller}
                    product={product}
                    class="btn btn-primary no-animation flex-1 bg-green-10 hover:bg-green-10 text-white border-none min-h-[45px]"
                    disabled={false}
                  />
                  <WishlistButton variant="pdp" item={item} />
                </>
              )
              : <OutOfStock productID={productID} />}
          </div>
        </div>

        {badges.length > 0 && <ProductBadges badges={badges} />}

        <ShippingSimulation
          items={[
            {
              id: Number(product.sku),
              quantity: 1,
              seller: seller,
            },
          ]}
        />
      </div>
      <AddToCartSticky
        item={item}
        product={product}
        seller={seller}
        price={price}
        listPrice={listPrice}
        percent={percent}
        installments={installments}
      />
    </div>
  );
}

export default ProductInfo;
