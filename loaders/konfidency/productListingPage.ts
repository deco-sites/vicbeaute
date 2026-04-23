import type { ProductListingPage } from "apps/commerce/types.ts";
import { toReview } from "../../konfidency/utils/transform.ts";

export interface Props {
  page: ProductListingPage | null;
  /**
   * @description Konfidency customer name (e.g. vicbeaute)
   */
  customer?: string;
}

/**
 * @title Konfidency - Product Listing Page Ratings Loader
 * @description Enriquece uma página de listagem de categoria/busca com aggregateRating da Konfidency.
 */
const loader = async (
  props: Props,
): Promise<ProductListingPage | null> => {
  const { page, customer = "vicbeaute" } = props;

  if (!page || !page.products || page.products.length === 0) {
    return page;
  }

  const enrichedProducts = await Promise.all(
    page.products.map(async (product) => {
      const sku = product.isVariantOf?.productID || product.sku ||
        product.productID;

      if (!sku) return product;

      try {
        const url =
          `https://reviews-api.konfidency.com.br/${customer}/${sku}/summary/helpful,desc?page=1&pageSize=1`;
        const response = await fetch(url);

        if (!response.ok) return product;

        const data = await response.json();

        if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
          const { aggregateRating } = toReview(data.reviews[0]);
          return { ...product, aggregateRating };
        }
      } catch {
        // silently skip — não quebra a página se a Konfidency falhar
      }

      return product;
    }),
  );

  return {
    ...page,
    products: enrichedProducts,
  };
};

export default loader;
