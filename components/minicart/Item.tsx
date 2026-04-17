import { AnalyticsItem } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import QuantitySelector from "../../islands/QuantitySelectorMinicartInteractive.tsx";
import { useScript } from "@deco/deco/hooks";
export type Item = AnalyticsItem & {
  listPrice: number;
  image: string;
};
export interface Props {
  item: Item;
  index: number;
  locale: string;
  currency: string;
}
const QUANTITY_MAX_VALUE = 100;
const removeItemHandler = () => {
  const itemID = (event?.currentTarget as HTMLButtonElement | null)
    ?.closest("fieldset")
    ?.getAttribute("data-item-id");
  if (typeof itemID === "string") {
    window.STOREFRONT.CART.setQuantity(itemID, 0);
  }
};
function CartItem({ item, index, locale, currency }: Props) {
  const { image, listPrice, price = Infinity, quantity } = item;
  const isGift = price < 0.01;
  // deno-lint-ignore no-explicit-any
  const name = (item as any).item_name;
  return (
    <fieldset
      // deno-lint-ignore no-explicit-any
      data-item-id={(item as any).item_id}
      class="grid grid-rows-1 gap-2 border-b py-3"
      style={{ gridTemplateColumns: "auto 1fr" }}
    >
      <Image
        alt={name}
        src={image}
        width={76}
        height={76}
        class="object-contain"
      />

      {/* Info */}
      <div class="flex flex-col justify-between">
        {/* Name and Remove button */}
        <div class="flex justify-between">

          <legend class="lg:text-[12px] text-[14px] text-black max-w-[182px] min-h-9 line-clamp-2">{name}</legend>
          <button
            class={clx(
              isGift && "hidden",
              "font-Hanken-Grotesk text-[10px] text-[#363931] underline leading-none bg-transparent border-none cursor-pointer p-0 self-start pt-[10px]",
            )}
            hx-on:click={useScript(removeItemHandler)}
          >
            Remover
          </button>
        </div>
        <div class="flex justify-between items-center lg:gap-0 h-[38px]">

        {/* Price Block */}
        <div class="flex items-start flex-col">
          {listPrice > price && (
            <span class="line-through text-sm">
              {formatPrice(listPrice, currency, locale)}
            </span>
          )}
          <span class="font-semibold text-[16px]">
            {isGift ? "Grátis" : formatPrice(price, currency, locale)}
          </span>
        </div>

        {/* Quantity Selector */}
        <div class={clx(isGift && "hidden", "max-w-[116px] w-full")}>
          <QuantitySelector
            min={0}
            max={QUANTITY_MAX_VALUE}
            value={quantity}
            name={`item::${index}`}
          />
        </div>
        </div>
      </div>
    </fieldset>
  );
}
export default CartItem;
