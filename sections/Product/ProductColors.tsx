import type { Product, ProductDetailsPage } from "apps/commerce/types.ts";
import ColorDetailsIsland from "../../islands/ColorDetails.tsx";

export interface Props {
  /** @title Título da Seção */
  title?: string;
  /**
   * @title ID do Produto Base (Opcional)
   * @description Digite o ID do SKU (ex: 11) para forçar o carregamento de cores dos similares desse produto específico ignorando a página atual.
   */
  skuId?: string;
  /** @ignore */
  page?: ProductDetailsPage | null;
  /** @ignore */
  customProductHook?: Product | null;
}

export const loader = async (
  props: Props,
  _req: Request,
  ctx: { invoke: any },
) => {
  if (props.skuId && props.skuId.trim() !== "") {
    try {
      // 1. Busca o produto base pelo SKU ID inserido
      const products = await ctx.invoke(
        "vtex/loaders/intelligentSearch/productList.ts",
        {
          ids: [props.skuId.trim()],
          count: 1,
        },
      );
      const baseProduct = products?.[0];

      if (baseProduct) {
        // 2. Busca ativamente os Similares (crossSelling) deste produto via API nativa da VTEX
        const productId = baseProduct.isVariantOf?.productGroupID ||
          baseProduct.productID;
        try {
          const similars = await ctx.invoke(
            "vtex/loaders/legacy/relatedProductsLoader.ts",
            {
              crossSelling: "similars",
              id: productId,
            },
          );

          if (similars && similars.length > 0) {
            baseProduct.isSimilarTo = similars;
          }
        } catch (err) {
          console.warn(
            "[ProductColors] Aviso: Não foi possível carregar os similares.",
            err,
          );
        }

        return { ...props, customProductHook: baseProduct };
      }
    } catch (e) {
      console.error("[ProductColors] Erro ao buscar produto customizado:", e);
    }
  }
  return { ...props, customProductHook: null };
};

export default function ProductColors({
  title = "Cores",
  page,
  customProductHook,
  skuId,
}: Props) {
  // A prioridade será o produto carregado via skuId no loader da section
  const baseProduct = customProductHook || page?.product;

  if (!baseProduct) return null;

  const product = baseProduct;

  // Agrupar variantes e produtos similares
  const similars = product.isSimilarTo ?? [];

  // Como o VTEX pode retornar as opções como Similars (Cross-selling) OU Variantes,
  // nós preferimos os 'similars' se eles tiverem sido configurados e carregados
  let allProducts: Product[] = [];

  if (similars.length > 0) {
    allProducts = [product, ...similars];
  } else {
    // Fallback: se não tiver similares, usamos as próprias variações do produto
    allProducts = product.isVariantOf?.hasVariant ?? [product];
  }

  // Deduplicar produtos pelo nome ou ID real para evitar que o VTEX Legacy e o IS retornem o mesmo produto com IDs (SKU vs Product ID) diferentes
  allProducts = Array.from(
    new Map(allProducts.map((p: Product) => [p.name, p])).values(),
  );

  const colorTabs = allProducts.map((p: Product) => {
    // 1. Swatch image (label "cor")
    const swatchUrl = p.image?.find((img) =>
      img.name?.toLowerCase() === "cor"
    )?.url ??
      p.image?.[0]?.url ??
      "";

    // 2. Large image (label "descrição" or 3rd image or fallback)
    const largeImageUrl = p.image?.find((img) => {
      const name = img.name?.toLowerCase();
      const alt = img.alternateName?.toLowerCase();
      return name === "descrição" || alt === "descrição" ||
        name === "decricao" || alt === "decricao";
    })?.url ?? p.image?.[2]?.url ?? p.image?.[0]?.url ?? "";

    // 3. Texts — mesma lógica do ColorVariantSelector:
    //    name    = spec "Cor" no nível do SKU   (ex: "Preto", "Corada")
    //    subtitle = spec "Cores" no nível do produto (ex: "Coral")
    const name = p.additionalProperty?.find((a) => a.name === "Cor")?.value ??
      p.name ??
      "";
    const subtitle =
      (p.isVariantOf?.additionalProperty ?? p.additionalProperty ?? [])
        .find((a) => a.name === "Cores")?.value ?? "";

    // 4. Description HTML -> from Cartela De Cores
    // The "isVariantOf" stores the specifications (additionalProperty) generally.
    const baseP = p.isVariantOf ?? p;
    const specs = baseP.additionalProperty ?? [];
    const cartela = specs.find((s) =>
      s.name === "Cartela De Cores" || s.name === "Cartela de Cores"
    )?.value ?? "";

    return {
      id: p.productID,
      name,
      subtitle,
      swatchUrl,
      largeImageUrl,
      descriptionHtml: cartela,
    };
  }); // Remove o filtro de requires descriptionHtml para deixar todos os similares aparecerem

  // Se não houver produtos na lista atual, não exibe a seção
  if (colorTabs.length === 0) return null;

  return <ColorDetailsIsland title={title} colors={colorTabs} />;
}
