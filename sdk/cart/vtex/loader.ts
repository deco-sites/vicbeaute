import { itemToAnalyticsItem } from "apps/vtex/hooks/useCart.ts";
import type a from "apps/vtex/loaders/cart.ts";
import { AppContext } from "apps/vtex/mod.ts";
import { Minicart } from "../../../components/minicart/Minicart.tsx";

export type Cart = Awaited<ReturnType<typeof a>>;

export const cartFrom = (form: Cart, url: string): Minicart => {
  const { items, totalizers } = form ?? { items: [] };
  const total = totalizers?.find((item) => item.id === "Items")?.value || 0;
  const discounts =
    (totalizers?.find((item) => item.id === "Discounts")?.value || 0) * -1;
  const locale = form?.clientPreferencesData.locale ?? "pt-BR";
  const currency = form?.storePreferencesData.currencyCode ?? "BRL";
  const coupon = form?.marketingData?.coupon ?? undefined;

  return {
    platformCart: form as unknown as Record<string, unknown>,
    storefront: {
      items: items.map((item, index) => {
        const detailUrl = new URL(item.detailUrl, url).href;

        return {
          ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
          image: item.imageUrl,
          listPrice: item.listPrice / 100,
          price: item.price / 100,
          // deno-lint-ignore no-explicit-any
          colorImageExtracted: (item as any).colorImageFromCatalog,
          vtexItem: item,
        };
      }),

      total: (total - discounts) / 100,
      subtotal: total / 100,
      discounts: discounts / 100,
      coupon: coupon,
      locale,
      currency,
      freeShippingTarget: 1000,
      checkoutHref: "/checkout",
    },
  };
};

async function loader(
  _props: unknown,
  req: Request,
  ctx: AppContext,
): Promise<Minicart> {
  const response = await ctx.invoke("vtex/loaders/cart.ts");

  // Augment items with Catalog Data to get the exact color image
  const skuIds = response?.items?.map((i: any) => i.id) || [];
  // deno-lint-ignore no-explicit-any
  let catalogProducts: any[] = [];
  if (skuIds.length > 0) {
    try {
      catalogProducts = await ctx.invoke("vtex/loaders/intelligentSearch/productList.ts", {
        ids: skuIds
      }) || [];
    } catch {
      // ignore silently to not break cart
    }
  }

  if (response?.items && catalogProducts.length > 0) {
    // deno-lint-ignore no-explicit-any
    response.items = response.items.map((item: any) => {
      // deno-lint-ignore no-explicit-any
      const catalogInfo = catalogProducts.find((p: any) => p.sku === item.id || p.productID === item.id);
      if (catalogInfo) {
        // Find image labeled "cor"
        // deno-lint-ignore no-explicit-any
        const colorImg = catalogInfo.image?.find((img: any) => img.name?.toLowerCase() === "cor" || img.alternateName?.toLowerCase() === "cor")?.url;
        if (colorImg) {
          item.colorImageFromCatalog = colorImg;
        }
      }
      return item;
    });
  }

  return cartFrom(response, req.url);
}

export default loader;
