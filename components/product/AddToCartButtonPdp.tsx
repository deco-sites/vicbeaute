import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import QuantitySelector from "../../islands/QuantitySelectorInteractive.tsx";
import { useScript } from "@deco/deco/hooks";
import Icon from "../../components/ui/Icon.tsx";

export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
  label?: string;
}

const onClick = () => {
  event?.stopPropagation();
  const button = event?.currentTarget as HTMLButtonElement | null;
  const container = button!.closest<HTMLDivElement>("div[data-cart-item]")!;
  const { item, platformProps } = JSON.parse(
    decodeURIComponent(container.getAttribute("data-cart-item")!),
  );

  const productID = container.getAttribute("data-item-id")!;
  const input = container.querySelector<HTMLInputElement>(
    'input[type="number"]',
  );
  const qty = input ? Number(input.value) || 1 : 1;

  const currentQty = window.STOREFRONT.CART.getQuantity(productID) || 0;

  if (currentQty > 0) {
    window.STOREFRONT.CART.setQuantity(productID, currentQty + qty);
  } else {
    const itemToAdd = {
      ...item,
      quantity: qty, // força sobrescrita correta
    };

    // também atualiza platformProps se precisar
    const updatedPlatformProps = { ...platformProps };

    if ("orderItems" in updatedPlatformProps) {
      updatedPlatformProps.orderItems[0].quantity = qty;
    }
    if ("quantity" in updatedPlatformProps) {
      updatedPlatformProps.quantity = qty;
    }
    if ("lines" in updatedPlatformProps) {
      updatedPlatformProps.lines.quantity = qty;
    }

    window.STOREFRONT.CART.addToCart(itemToAdd, updatedPlatformProps);
  }
};

const onChange = () => {
  // só para manter validade no input (ex: impedir negativos)
  const input = event!.currentTarget as HTMLInputElement;
  if (!input.validity.valid) {
    input.value = "1";
  }
};

const onLoad = (id: string) => {
  window.STOREFRONT.CART.subscribe(() => {
    const container = document.getElementById(id);

    container?.querySelectorAll<HTMLButtonElement>("button").forEach((node) =>
      node.disabled = false
    );
    container?.querySelectorAll<HTMLInputElement>("input").forEach((node) =>
      node.disabled = false
    );
  });
};

const useAddToCart = ({ product, seller }: Props) => {
  const platform = usePlatform();
  const { additionalProperty = [], isVariantOf, productID } = product;
  const productGroupID = isVariantOf?.productGroupID;

  if (platform === "vtex") {
    return {
      allowedOutdatedData: ["paymentData"],
      orderItems: [{ quantity: 1, seller: seller, id: productID }],
    };
  }
  if (platform === "shopify") {
    return { lines: { merchandiseId: productID } };
  }
  if (platform === "vnda") {
    return {
      quantity: 1,
      itemId: productID,
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value]),
      ),
    };
  }
  if (platform === "wake") {
    return {
      productVariantId: Number(productID),
      quantity: 1,
    };
  }
  if (platform === "nuvemshop") {
    return {
      quantity: 1,
      itemId: Number(productGroupID),
      add_to_cart_enhanced: "1",
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value]),
      ),
    };
  }
  if (platform === "linx") {
    return {
      ProductID: productGroupID,
      SkuID: productID,
      Quantity: 1,
    };
  }
  return null;
};

function AddToCartButtonPdp(props: Props) {
  const { product, item, class: _class } = props;
  const platformProps = useAddToCart(props);
  const id = useId();

  return (
    <div
      id={id}
      class="flex items-center bg-gray-15 lg:bg-white flex-col-reverse"
      data-item-id={product.productID}
      data-cart-item={encodeURIComponent(
        JSON.stringify({ item, platformProps }),
      )}
    >
      <button
        disabled
        class={clx(
          "w-full rounded-md font-medium text-base flex items-center justify-center gap-2 h-[45px]",
          _class?.toString(),
        )}
        hx-on:click={useScript(onClick)}
      >
        {props.label || "Adicionar ao carrinho"}
        {props.label !== "Adicionar" && <Icon id="bagpdp" width={24} height={24} />}
      </button>

      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </div>
  );
}

export default AddToCartButtonPdp;
