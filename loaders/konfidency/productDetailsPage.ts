import type { ProductDetailsPage } from "apps/commerce/types.ts";
import { AppContext } from "../../apps/site.ts";
import { toReview } from "../../konfidency/utils/transform.ts";

export interface Props {
  page: ProductDetailsPage | null;
  /**
   * @description Konfidency customer name (e.g. vicbeaute)
   */
  customer?: string;
}

/**
 * @title Konfidency - Product Details Page Loader
 */
const loader = async (
  props: Props,
  _req: Request,
  _ctx: AppContext,
): Promise<ProductDetailsPage | null> => {
  const { page, customer } = props;
  const konfidencyCustomer = customer || "vicbeaute";

  if (!page || !page.product) {
    return page;
  }

  const { product } = page;

  // Use Product Group ID (isVariantOf.productID) if available, fallback to SKU ID
  // This ensures reviews for all variants (colors) of the same product are grouped.
  const sku = product.isVariantOf?.productID || product.sku ||
    product.productID;

  console.log(
    `[Konfidency] Fetching reviews for SKU/ProdID: ${sku}, Customer: ${konfidencyCustomer}`,
  );

  if (!sku) {
    console.log("[Konfidency] No ID found for product to fetch reviews");
    return page;
  }

  try {
    const url =
      `https://reviews-api.konfidency.com.br/${konfidencyCustomer}/${sku}/summary/helpful,desc?page=1&pageSize=10`;
    console.log(`[Konfidency] API URL: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      console.log(
        `[Konfidency] API error: ${response.status} ${response.statusText}`,
      );
      return page;
    }

    const data = await response.json();
    console.log(
      `[Konfidency] API Response for ${sku}:`,
      JSON.stringify(data).slice(0, 500),
    );

    if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
      const productReviewData = data.reviews[0];
      const reviewCount = productReviewData.reviewCount ?? 0;

      console.log(
        `[Konfidency] reviewCount=${reviewCount}, aggregateRating=${productReviewData.aggregateRating} for SKU ${sku}`,
      );

      // toReview handles both empty and populated review data
      const { aggregateRating, review } = toReview(productReviewData);

      return {
        ...page,
        product: {
          ...product,
          review: review,
          aggregateRating: aggregateRating,
        },
      };
    } else {
      console.log(
        `[Konfidency] API returned empty reviews array for SKU ${sku}`,
      );
    }
  } catch (e) {
    console.error("Konfidency loader error:", e);
  }

  return page;
};

export default loader;
