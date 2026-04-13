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

      let platformProps: Record<string, unknown> = { quantity: 1, itemId: product.productID };

      if (platform === "wake") {
        platformProps = { productVariantId: Number(product.productID), quantity: 1 };
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
    <div class="flex flex-col items-center gap-3 w-full max-w-[500px] mx-auto mt-6">
      <p class="text-[15px] text-[#4a4a4a] text-center">
        Compre os <span class="font-bold">{products.length}</span> produtos por:{" "}
        <span class="font-bold text-[18px] text-[#343a30]">{formattedPrice}</span>
      </p>

      <button
        class="w-full py-[14px] text-[14px] text-white transition-all rounded-sm flex items-center justify-center bg-[#343a30] hover:bg-[#2b3027]"
        onClick={handleAddToCart}
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}
