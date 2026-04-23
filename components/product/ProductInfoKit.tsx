import { Product, ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { relative } from "../../sdk/url.ts";
import AddToCartSticky from "./AddToCartSticky.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import ColorVariantSelector from "../../islands/ColorVariantSelector.tsx";
import ProductBadges from "./ProductBadges.tsx";
import ShippingSimulation from "../shipping/Form.tsx";
import { useSection } from "@deco/deco/hooks";
import KitAddToCart from "../../islands/KitAddToCart.tsx";

interface Props {
  page: ProductDetailsPage | null;
  kitProducts?: Product[] | null;
}

function ProductInfoKit({ page, kitProducts }: Props) {
  const id = useId();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { breadcrumbList, product } = page;
  const { offers, isVariantOf } = product;
  const title = isVariantOf?.name ?? product.name;

  const modelSpecs = isVariantOf?.additionalProperty ?? [];
  const selosRaw = modelSpecs.find((s) => s.name === "Selos")?.value || "";
  const badges = selosRaw.split(";").map((s) => s.trim()).filter(Boolean);

  const getSwatchUrl = (
    images?: { url?: string; name?: string }[] | null,
  ) =>
    images?.find((img) => img.name?.toLowerCase() === "cor")?.url ??
      images?.[0]?.url ??
      "";

  const builColorAllProducts = () => {
    const similars = product.isSimilarTo ?? [];
    let allProducts = similars.length > 0
      ? [product, ...similars]
      : (product.isVariantOf?.hasVariant ?? [product]);

    const seenIds = new Set<string>();
    return allProducts.filter((p) => {
      const key = p.productID ?? p.sku ?? p.name ?? "";
      if (seenIds.has(key)) return false;
      seenIds.add(key);
      return true;
    });
  };

  const allProducts = builColorAllProducts();

  const getSkuColor = (p: typeof product) =>
    p.additionalProperty?.find((a) => a.name === "Cor")?.value ?? p.name ?? "";

  const getProductCores = (p: typeof product) =>
    (p.isVariantOf?.additionalProperty ?? p.additionalProperty ?? [])
      .find((a) => a.name === "Cores")?.value ?? "";

  const allColors = allProducts
    .filter((p) => {
      const url = relative(p.url);
      return url && url !== "/";
    })
    .map((p) => {
      const urlStr = relative(p.url)!;
      return {
        url: urlStr,
        name: getSkuColor(p),
        subtitle: getProductCores(p),
        imgUrl: getSwatchUrl(p.image),
        sectionUrl: useSection({ href: urlStr }),
      };
    });
  const hasColors = allColors.length > 1;
  const selectedUrl = relative(product.url) ?? "/";

  const { price = 0, listPrice = 0, seller = "1", installments } = useOffer(
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

  const kitComponents = kitProducts?.map((p) => {
    const similars = p.isSimilarTo ?? [];
    let allVariants = similars.length > 0
      ? [p, ...similars]
      : (p.isVariantOf?.hasVariant ?? [p]);

    const seenIds = new Set<string>();
    allVariants = allVariants.filter((vr) => {
      const key = vr.productID ?? vr.sku ?? vr.name ?? "";
      if (seenIds.has(key)) return false;
      seenIds.add(key);
      return true;
    });

    const variants = allVariants.map((vr) => {
      const largeImageUrl = vr.image?.find((img) => {
        const name = img.name?.toLowerCase();
        const alt = img.alternateName?.toLowerCase();
        return name === "descrição" || alt === "descrição" ||
          name === "decricao" || alt === "decricao";
      })?.url ?? vr.image?.[2]?.url ?? vr.image?.[0]?.url ?? "";

      return {
        productID: vr.productID,
        url: vr.url ?? "",
        name: getSkuColor(vr),
        subtitle: getProductCores(vr),
        imgUrl: getSwatchUrl(vr.image),
        largeImageUrl: largeImageUrl,
        seller: vr.offers?.offers[0]?.seller || seller || "1",
      };
    });

    return {
      productID: p.productID,
      name: p.isVariantOf?.name ?? p.name ?? "",
      aggregateRating: p.aggregateRating
        ? {
          ratingValue: p.aggregateRating.ratingValue,
          reviewCount: p.aggregateRating.reviewCount,
        }
        : null,
      variants,
    };
  }) || [];

  return (
    <div>
      <div
        {...viewItemEvent}
        class="lg:flex hidden flex-col product-info w-[350px]"
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
            </div>
          </>
        )}

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

        {/* NEW KIT MODAL */}
        <div class="mt-4 sm:mt-[14px]">
          <KitAddToCart
            price={price}
            listPrice={listPrice}
            percent={percent}
            kitComponents={kitComponents}
            seller={seller}
          />
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
              "text-3xl text-pink-5 font-normal font-Queens",
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
        </div>

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

        {/* NEW KIT MODAL MOBILE */}
        <div class="mt-4 sm:mt-[14px]">
          <KitAddToCart
            price={price}
            listPrice={listPrice}
            percent={percent}
            kitComponents={kitComponents}
            seller={seller}
          />
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

export default ProductInfoKit;
