import type { Product, ProductDetailsPage } from "apps/commerce/types.ts";
import { AppContext } from "apps/vtex/mod.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { relative } from "../../sdk/url.ts";
import AddToCartButtonPdp from "../../components/product/AddToCartButtonPdp.tsx";
import ColorVariantSelector from "../../islands/ColorVariantSelector.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Slider from "../../components/ui/Slider.tsx";
import SliderJS from "../../islands/SliderJS.tsx";
import Image from "apps/website/components/Image.tsx";
import { useSection } from "@deco/deco/hooks";

export interface Props {
  /** @title Título Customizado */
  title?: string;
  /** @title Subtítulo Customizado */
  subtitle?: string;
  /** 
   * @title ID do Produto Base (SKU)
   * @description Puxa os similares e monta o bloco de compra. Deixe em branco para usar o da página.
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
  ctx: { invoke: any }
) => {
  // Ignora o loader customizado se o HTMX esvaziou o skuId durante a navegação
  if (props.skuId && props.skuId.trim() !== "") {
    try {
      const products = await ctx.invoke("vtex/loaders/intelligentSearch/productList.ts", {
        ids: [props.skuId.trim()],
        count: 1
      });
      const baseProduct = products?.[0];

      if (baseProduct) {
        const productId = baseProduct.isVariantOf?.productGroupID || baseProduct.productID;
        try {
          const similars = await ctx.invoke("vtex/loaders/legacy/relatedProductsLoader.ts", {
            crossSelling: "similars",
            id: productId,
          });
          if (similars && similars.length > 0) {
            baseProduct.isSimilarTo = similars;
          }
        } catch (err) {
          console.warn("[FeaturedProduct] Aviso: Não foi possível carregar os similares.", err);
        }
        return { ...props, customProductHook: baseProduct };
      }
    } catch (e) {
      console.error("[FeaturedProduct] Erro:", e);
    }
  }
  return { ...props, customProductHook: null };
};

export default function FeaturedProduct({ 
  title = "Se maquiar pode ser simples", 
  subtitle = "O Stick Tudo foi feito para facilitar sua rotina e valorizar sua beleza real.",
  page, 
  customProductHook 
}: Props) {
  // A prioridade: Se há customProductHook, use-o. Mas se o usuário clicar na cor, 
  // o HTMX remove a tag skuId das props forçando o useSection nativo a trazer o page?.product.
  const currentProduct = customProductHook || page?.product;

  if (!currentProduct) return null;

  const product = currentProduct;

  // Montagem das variações e cores
  const similars = product.isSimilarTo ?? [];
  let allProducts: Product[] = similars.length > 0 ? [product, ...similars] : (product.isVariantOf?.hasVariant ?? [product]);

  const seenIds = new Set<string>();
  allProducts = allProducts.filter((p) => {
    const key = p.productID ?? p.sku ?? p.name ?? "";
    if (seenIds.has(key)) return false;
    seenIds.add(key);
    return true;
  });

  const getSwatchUrl = (images?: { url?: string; name?: string }[] | null) =>
    images?.find((img) => img.name?.toLowerCase() === "cor")?.url ?? images?.[0]?.url ?? "";

  const allColors = allProducts
    .filter((p) => relative(p.url) && relative(p.url) !== "/")
    .map((p) => {
      const urlStr = relative(p.url)!;
      return {
        url: urlStr,
        name: p.additionalProperty?.find((a) => a.name === "Cor")?.value ?? p.name ?? "",
        subtitle: (p.isVariantOf?.additionalProperty ?? p.additionalProperty ?? []).find((a) => a.name === "Cores")?.value ?? "",
        imgUrl: getSwatchUrl(p.image),
        // Como estamos em uma Landing Page e não temos o contexto "page" global,
        // não podemos confiar no "href" para resolver o produto. 
        // Solução: mandamos o ID exato dessa variação de cor para o nosso próprio loader!
        sectionUrl: useSection({ props: { skuId: p.productID || p.sku } }),
      };
    });

  const { price = 0, listPrice = 0, seller = "1", availability, installments } = useOffer(product.offers);
  const percent = listPrice && price ? Math.round(((listPrice - price) / listPrice) * 100) : 0;

  // Imagens limpas para o slider (exclui swatch de cor)
  const images = (product.image ?? []).filter(img => img.name?.toLowerCase() !== "cor");

  // Analytics simplificado (stub) para o add to cart
  const item = { item_id: product.sku, item_name: product.name, price, discount: listPrice - price };

  return (
    <div class="relative w-full py-10 lg:py-16">
      <div class="max-w-[1140px] mx-auto border border-[#B0D3BB] bg-white-15 rounded-[20px] overflow-hidden flex flex-col lg:flex-row p-6 lg:p-12 gap-8 lg:gap-14 shadow-sm items-center">
        
        {/* Lado Esquerdo - Slider de Imagem */}
        <div class="w-full lg:w-1/2 relative bg-[#F9F7F5] rounded-xl flex items-center justify-center p-8 aspect-square" id="featured-buybox-img">
          
          <Slider class="carousel carousel-center w-full min-h-[300px]">
             {images.map((img, idx) => (
                <Slider.Item index={idx} class="carousel-item w-full flex items-center justify-center">
                   <Image 
                     src={img.url!}
                     alt={img.alternateName || product.name}
                     width={400}
                     height={400}
                     class="w-full max-w-[400px] h-auto object-contain mix-blend-multiply"
                   />
                </Slider.Item>
             ))}
          </Slider>

          {images.length > 1 && (
            <>
              <div class="absolute inset-y-0 left-4 flex items-center justify-start z-10">
                <Slider.PrevButton class="btn btn-circle bg-white-15 border-white-15 shadow-md hover:bg-gray-50 flex items-center justify-center min-h-0 h-10 w-10 btn-sm disabled:opacity-30">
                  <Icon class="text-black pointer-events-none rotate-180" size={16} id="chevron-right" strokeWidth={3} />
                </Slider.PrevButton>
              </div>
              <div class="absolute inset-y-0 right-4 flex items-center justify-end z-10">
                <Slider.NextButton class="btn btn-circle bg-white-15 border-white-15 shadow-md hover:bg-gray-50 flex items-center justify-center min-h-0 h-10 w-10 btn-sm disabled:opacity-30">
                  <Icon class="text-black pointer-events-none" size={16} id="chevron-right" strokeWidth={3} />
                </Slider.NextButton>
              </div>
            </>
          )}
          <SliderJS rootId="featured-buybox-img" />
        </div>

        {/* Lado Direito - Conteúdo e Compra */}
        <div class="w-full lg:w-1/2 flex flex-col">
          
          <div class="text-center mb-6">
            <h2 
              class="font-Queens text-[36px] lg:text-[42px] leading-tight text-pink-15 mb-3"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p 
              class="font-Inter text-[16px] text-gray-500 max-w-[400px] mx-auto"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          </div>

          <div class="flex-grow flex flex-col justify-end w-full max-w-[440px] mx-auto">
            {allColors.length > 1 && (
              <div class="mb-4">
                 <ColorVariantSelector 
                   colors={allColors}
                   selectedUrl={relative(product.url) ?? "/"}
                   pushUrl={false}
                 />
              </div>
            )}

            {availability === "https://schema.org/InStock" ? (
              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-2 justify-center mb-1">
                  {listPrice > price && (
                    <span class="line-through text-sm text-gray-400 font-Inter">
                      {formatPrice(listPrice, product.offers?.priceCurrency)}
                    </span>
                  )}
                  <span class="text-[26px] font-bold text-[#4D5D49] flex justify-center items-center font-Inter leading-none">
                    {formatPrice(price, product.offers?.priceCurrency)}
                  </span>
                  {percent > 0 && (
                    <span class="text-[11px] font-bold text-white-15 bg-[#EE3730] rounded-md px-2 py-[2px] ml-1 uppercase leading-tight mt-[2px]">
                      -{percent}% OFF
                    </span>
                  )}
                </div>
                
                <div class="flex items-center gap-1 justify-center mb-2">
                  <span class="text-[13px] text-gray-500 font-Inter">
                    Tenha 5% de desconto no PIX
                  </span>
                  <Icon id="pdpPix" size={12} strokeWidth={1} class="text-black mx-1" />
                </div>

                <AddToCartButtonPdp
                  item={item as any}
                  seller={seller}
                  product={product}
                  class="btn w-full h-[50px] min-h-[50px] bg-[#4D5D49] hover:bg-[#3D4C3A] text-white-15 rounded text-[16px] font-medium border-none shadow-sm transition-colors"
                  label="Adicionar ao carrinho"
                />
              </div>
            ) : (
              <div class="mt-4 p-4 text-center bg-gray-50 border border-gray-200 rounded text-gray-600 font-medium">
                Produto indisponível
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
