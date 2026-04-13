import { Product, ProductDetailsPage } from "apps/commerce/types.ts";
import ProductCardBuyTogether from "../../components/product/ProductCardBuyTogether.tsx";
import AddToCartBuyTogether from "../../islands/AddToCartBuyTogether.tsx";
import { useOffer } from "../../sdk/useOffer.ts";

export interface Props {
  /** @title Integração da Página */
  page: ProductDetailsPage | null;
  /**
   * @title Produtos do Mostrar Junto
   * @description Conectar ao loader "Buy Together - Mostrar Junto (VTEX)" para puxar automaticamente os produtos configurados na VTEX
   */
  productTogether?: Product[] | null;
}

export default function ProductBuyTogether({ page, productTogether }: Props) {
  if (!page || !page.product) {
    return null;
  }

  const { product: mainProduct } = page;

  // productTogether vem do loader customizado buyTogetherSuggestions que chama o endpoint /crossselling/suggestions da VTEX
  let together = productTogether && productTogether.length > 0
    ? productTogether
    : null;

  // Se não tiver suggestions, não renderiza a seção
  if (!together || together.length === 0) {
    return null;
  }

  // Limitar a 1 produto de sugestão para manter o design (produto principal + 1)
  together = together.slice(0, 1);

  // Juntando para cálculo e render
  const allProducts = [mainProduct, ...together];

  let totalPrice = 0;

  allProducts.forEach((p) => {
    const { price } = useOffer(p.offers);
    totalPrice += Number(price ?? 0);
  });

  return (
    <div id="compre-junto" class="w-full bg-[#f4f2ee] py-12 lg:py-16">
      <div class="container flex flex-col items-center w-full px-5 sm:px-0 max-w-[1044px]">
        <h2 class="text-[32px] text-[#D1927D] font-Queens leading-[1.1] mb-8 lg:mb-12 text-center w-full">
          Compre Junto
        </h2>

        <div class="flex flex-col items-center justify-center w-full">
          {/* Container dos Produtos (Lado a Lado) */}
          <div class="flex flex-row items-center justify-center gap-2 lg:gap-6 w-full max-w-[650px] relative px-2">
            {allProducts.map((p, index) => (
              <>
                {index > 0 && (
                  <div class="z-10 absolute left-1/2 top-[40%] -translate-x-1/2 w-8 h-8 lg:w-10 lg:h-10 shrink-0 bg-[#455C42] text-white rounded-full flex items-center justify-center text-lg lg:text-xl font-light border-2 lg:border-4 border-[#f4f2ee] pointer-events-none">
                    +
                  </div>
                )}
                <div class="flex-1 w-[50%] flex justify-center">
                  <ProductCardBuyTogether
                    key={p.productID}
                    product={p}
                    index={index}
                    class="w-full max-w-[287px]"
                  />
                </div>
              </>
            ))}
          </div>

          {/* Botão Container Embaixo */}
          <div class="w-full mt-4 lg:mt-6 flex flex-col items-center">
            <AddToCartBuyTogether products={allProducts} totalPrice={totalPrice} />
          </div>
        </div>
      </div>
    </div>
  );
}
