import type { ProductDetailsPage } from "apps/commerce/types.ts";
import ColorDetailsIsland from "../../islands/ColorDetails.tsx";

export interface Props {
  /** @title Título da Seção */
  title?: string;
  page: ProductDetailsPage | null;
}

export default function ProductColors({ title = "Cores", page }: Props) {
  if (!page || !page.product) return null;

  const { product } = page;
  
  // Agrupar variantes e produtos similares
  const similars = product.isSimilarTo ?? [];
  
  // Como o VTEX pode retornar as opções como Similars (Cross-selling) OU Variantes, 
  // nós preferimos os 'similars' se eles tiverem sido configurados e carregados
  let allProducts: ReturnType<typeof similars.map> = [];
  
  if (similars.length > 0) {
    allProducts = [product, ...similars];
  } else {
    // Fallback: se não tiver similares, usamos as próprias variações do produto
    allProducts = product.isVariantOf?.hasVariant ?? [product];
  }

  // Deduplicar produtos pelo nome ou ID real para evitar que o VTEX Legacy e o IS retornem o mesmo produto com IDs (SKU vs Product ID) diferentes
  allProducts = Array.from(new Map(allProducts.map(p => [p.name, p])).values());

  const colorTabs = allProducts.map((p) => {
    // 1. Swatch image (label "cor")
    const swatchUrl = p.image?.find((img) => img.name?.toLowerCase() === "cor")?.url ??
      p.image?.[0]?.url ??
      "";

    // 2. Large image (label "descrição" or 3rd image or fallback)
    const largeImageUrl = p.image?.find((img) => {
      const name = img.name?.toLowerCase();
      const alt = img.alternateName?.toLowerCase();
      return name === "descrição" || alt === "descrição" || name === "decricao" || alt === "decricao";
    })?.url ?? p.image?.[2]?.url ?? p.image?.[0]?.url ?? "";

    // 3. Texts
    const name = p.name ?? "";
    const subtitle = p.alternateName ?? "";

    // 4. Description HTML -> from Cartela De Cores
    // The "isVariantOf" stores the specifications (additionalProperty) generally.
    const baseP = p.isVariantOf ?? p;
    const specs = baseP.additionalProperty ?? [];
    const cartela = specs.find((s) => s.name === "Cartela De Cores" || s.name === "Cartela de Cores")?.value ?? "";

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
