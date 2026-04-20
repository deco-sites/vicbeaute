import type { Product, ProductDetailsPage } from "apps/commerce/types.ts";
import { AppContext } from "../../apps/site.ts";
import { AppContext as AppContextVTEX } from "apps/vtex/mod.ts";

export interface Props {
  /** @title Integração da Página */
  page: ProductDetailsPage | null;
  /**
   * @title Quantidade máxima de produtos
   * @default 1
   */
  count?: number;
}

/**
 * @title Buy Together - Mostrar Junto (VTEX)
 * @description Busca os produtos configurados como "Mostrar Junto" na VTEX para exibir na seção Compre Junto
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<Product[] | null> => {
  const { page, count = 1 } = props;

  if (!page?.product) {
    return null;
  }

  const product = page.product;
  const productId = product.isVariantOf?.productGroupID;

  if (!productId) {
    console.warn("[BuyTogether] Sem productGroupID para:", product.name);
    return null;
  }

  try {
    const vtex = ctx as unknown as AppContextVTEX;

    const products = await vtex.invoke(
      "vtex/loaders/legacy/relatedProductsLoader.ts",
      {
        crossSelling: "showtogether",
        id: productId,
        count,
      },
    );

    console.log(
      `[BuyTogether] Encontrados: ${products?.length ?? 0} produto(s)`,
      products?.map((p: Product) => p.name),
    );

    return products ?? null;
  } catch (e) {
    console.error("[BuyTogether] Erro ao buscar showtogether:", e);
    return null;
  }
};

export default loader;
