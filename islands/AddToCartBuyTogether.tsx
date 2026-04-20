import { Product } from "apps/commerce/types.ts";
import { formatPrice } from "../sdk/format.ts";

export interface Props {
  products: Product[];
  platform?: string;
  totalPrice?: number;
}

export default function AddToCartBuyTogether(
  { products, platform = "vtex", totalPrice = 0 }: Props,
) {
  const handleAddToCart = () => {
    if (platform === "vtex") {
      // Para VTEX, combina todos os produtos num único orderItems
      // e faz UMA SÓ chamada ao carrinho — evita race conditions
      const orderItems = products.map((product) => ({
        id: product.productID,
        seller: product.offers?.offers[0]?.seller || "1",
        quantity: 1,
      }));

      const platformProps = {
        allowedOutdatedData: ["paymentData"],
        orderItems,
      };

      // item de analytics simplificado para a chamada (obrigatório na assinatura)
      const analyticsItem = {
        item_id: products.map((p) => p.productID).join(","),
        quantity: products.length,
        price: totalPrice,
      };

      // @ts-ignore
      if (window.STOREFRONT?.CART?.addToCart) {
        // @ts-ignore
        window.STOREFRONT.CART.addToCart(analyticsItem, platformProps);
      }
      return;
    }

    // Para outras plataformas (wake, vnda, shopify), adiciona um por um
    products.forEach((product) => {
      const price = product.offers?.offers[0]?.price || 0;
      const analyticsItem = { item_id: product.productID, quantity: 1, price };

      let platformProps: Record<string, unknown> = {
        quantity: 1,
        itemId: product.productID,
      };

      if (platform === "wake") {
        platformProps = {
          productVariantId: Number(product.productID),
          quantity: 1,
        };
      }

      // @ts-ignore
      if (window.STOREFRONT?.CART?.addToCart) {
        // @ts-ignore
        window.STOREFRONT.CART.addToCart(analyticsItem, platformProps);
      }
    });
  };

  const formattedPrice = formatPrice(totalPrice);

  return (
    <div class="flex flex-col items-center gap-4 lg:gap-5 w-full mx-auto max-w-[375px] lg:max-w-none px-4 lg:px-[18px]">
      <div class="text-center w-full flex flex-row lg:flex-col items-center justify-center gap-1 lg:gap-0">
        <p class="text-[14px] text-[#000000] font-Hanken-Grotesk xl:text-[20px] xl:leading-normal leading-tight">
          Compre os <span class="font-bold">{products.length}</span>{" "}
          produtos por:
        </p>
        <p class="font-bold text-[18px] lg:text-[26px] text-[#363931] mt-0 lg:mt-2 font-Hanken-Grotesk leading-none">
          {formattedPrice}
        </p>
      </div>

      <button
        class="w-full py-[12px] lg:py-[15px] text-[14px] lg:text-[16px] text-[#FAF9F5] transition-all rounded px-4 flex items-center justify-center bg-[#455C42] hover:bg-[#3d513a] font-medium font-Hanken-Grotesk tracking-wide"
        onClick={handleAddToCart}
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}
