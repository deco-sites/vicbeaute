import type { Product } from "apps/commerce/types.ts";
import { toReview } from "../../konfidency/utils/transform.ts";

export interface Props {
  products: Product[] | null;
  /**
   * @description Konfidency customer name (e.g. vicbeaute)
   */
  customer?: string;
}

/**
 * @title Konfidency - Product List Ratings Loader
 * @description Enriquece uma lista de produtos com aggregateRating da Konfidency.
 * Use como pipe no loader de produtos de qualquer shelf.
 */
const loader = async (
  props: Props,
): Promise<Product[] | null> => {
  const { products, customer = "vicbeaute" } = props;

  if (!products || products.length === 0) {
    return products;
  }

  const enriched = await Promise.all(
    products.map(async (product) => {
      const sku = product.isVariantOf?.productID || product.sku || product.productID;

      if (!sku) return product;

      try {
        const url = `https://reviews-api.konfidency.com.br/${customer}/${sku}/summary/helpful,desc?page=1&pageSize=1`;
        const response = await fetch(url);

        if (!response.ok) return product;

        const data = await response.json();

        if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
          const { aggregateRating } = toReview(data.reviews[0]);
          return { ...product, aggregateRating };
        }
      } catch {
        // silently skip — não quebra a shelf se a Konfidency falhar
      }

      return product;
    }),
  );

  return enriched;
};

export default loader;
