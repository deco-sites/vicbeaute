import { Product, ProductDetailsPage } from "apps/commerce/types.ts";
import ProductCardBuyTogether from "../../components/product/ProductCardBuyTogether.tsx";
import AddToCartBuyTogether from "../../islands/AddToCartBuyTogether.tsx";
import { useOffer } from "../../sdk/useOffer.ts";

export interface Props {
  /** @title Título da Seção */
  title?: string;
  /** @title Integração da Página */
  page: ProductDetailsPage | null;
  /**
   * @title Produtos do Mostrar Junto
   * @description Conectar ao loader "Buy Together - Mostrar Junto (VTEX)" para puxar automaticamente os produtos configurados na VTEX
   */
  productTogether?: Product[] | null;
}

export default function ProductBuyTogether(
  { title = "Compre Junto", page, productTogether }: Props,
) {
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
    <div id="compre-junto" class="w-full bg-[#FAF9F5] py-12 lg:py-16">
      <div class="container flex flex-col items-center w-full px-5 sm:px-0 max-w-[960px]">
        <h2 class="text-[36px] md:text-[40px] text-[#CE9680] font-Queens leading-[1.1] mb-8 lg:mb-12 text-center w-full">
          {title}
        </h2>

        <div class="flex flex-col lg:flex-row items-center lg:items-stretch justify-center w-full gap-[14px] lg:gap-0 lg:justify-between px-2 lg:px-10">
          {/* Container dos Produtos (Lado a Lado) */}
          <div class="flex flex-row items-stretch justify-center gap-2 lg:gap-14 relative w-full lg:w-auto">
            {allProducts.map((p, index) => (
              <>
                {index > 0 && (
                  <div class="z-10 absolute left-1/2 top-[40%] -translate-x-1/2 lg:static lg:translate-x-0 lg:self-center w-10 h-10 lg:w-10 lg:h-10 shrink-0 bg-[#363931] text-white-15 rounded-full flex items-center justify-center text-xl font-light border-2 lg:border-none border-[#FAF9F5] pointer-events-none">
                    +
                  </div>
                )}
                <div class="flex-1 lg:flex-none w-1/2 lg:w-[287px] flex justify-center">
                  <ProductCardBuyTogether
                    key={p.productID}
                    product={p}
                    index={index}
                    class="w-full h-full"
                  />
                </div>
              </>
            ))}
          </div>

          {/* Desktop divider: | = | */}
          <div class="hidden lg:flex items-center gap-8 self-center mx-4">
            <div class="w-[1px] h-10 bg-[#D1927D] opacity-40"></div>
            <div class="w-10 h-10 shrink-0 bg-[#363931] text-white rounded-full flex items-center justify-center text-xl font-light">
              =
            </div>
            <div class="w-[1px] h-10 bg-[#D1927D] opacity-40"></div>
          </div>

          {/* Botão Container Embaixo (Mobile) ou Direita (Desktop) */}
          <div class="w-full lg:mt-0 lg:w-[260px] flex flex-col items-center lg:items-start lg:justify-center self-center">
            <AddToCartBuyTogether
              products={allProducts}
              totalPrice={totalPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
