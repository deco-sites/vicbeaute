import { AnalyticsItem } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import QuantitySelector from "../../islands/QuantitySelectorMinicartInteractive.tsx";
import { useScript } from "@deco/deco/hooks";
export type Item = AnalyticsItem & {
  listPrice: number;
  image: string;
  // deno-lint-ignore no-explicit-any
  vtexItem?: any;
  colorImageExtracted?: string;
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
  // Fallback visual para variantes até receber a cor
  // deno-lint-ignore no-explicit-any
  const rawVariant = (item as any).item_variant;
  const variantName = typeof rawVariant === "string" ? rawVariant.split("-").pop()?.trim() : rawVariant;

  // Busca imagem pela label "cor" extraída via catálogo no loader
  // deno-lint-ignore no-explicit-any
  const colorImageUrl = (item as any).colorImageExtracted;

  return (
    <fieldset
      // deno-lint-ignore no-explicit-any
      data-item-id={(item as any).item_id}
      class="flex gap-4 border border-[#ECECEC] rounded-[8px] p-2 mb-3 bg-[#ffffff] relative min-h-[104px]"
    >
      <div class="relative flex-shrink-0">
        <Image
          alt={name}
          src={image}
          width={76}
          height={76}
          class="object-cover rounded-[5px] bg-[#F4F0EB]"
        />
      </div>

      {/* Info */}
      <div class="flex flex-col flex-grow relative pt-1 pb-1">
        {/* Title & Remover */}
        <div class="flex justify-between items-start pe-2">
          <legend class="text-[13px] font-semibold text-[#183935] max-w-[140px] leading-snug line-clamp-2">
            {name}
          </legend>
          <button
            class={clx(
              isGift && "hidden",
              "absolute top-0 right-1 font-Inter text-[11px] text-[#363931] underline bg-transparent border-none cursor-pointer p-0",
            )}
            hx-on:click={useScript(removeItemHandler)}
          >
            Remover
          </button>
        </div>

        <div class="flex items-start flex-col mt-[2px]">
          {listPrice > price && (
            <span class="line-through text-xs text-gray-400">
              {formatPrice(listPrice, currency, locale)}
            </span>
          )}
          <span class="font-semibold text-[14px] text-[#191C1F]">
            {isGift ? "Grátis" : formatPrice(price, currency, locale)}
          </span>
        </div>

        {/* Bottom Area: Variant & Quantity */}
        <div class="flex justify-between items-end mt-auto pt-2 min-h-[28px]">
          <div class="flex items-center gap-[6px]">
            {/* Fake Color Bullet based on variant presence */}
            {variantName && (
              <>
                {colorImageUrl ? (
                  <img src={colorImageUrl} alt={variantName} class="w-[12px] h-[12px] rounded-full object-cover shadow-sm" />
                ) : (
                  <span class="w-[10px] h-[10px] rounded-full bg-[#8E2C3D] inline-block shadow-sm"></span>
                )}
                <span class="text-[#363931] text-[12px] font-medium max-w-[120px] truncate">
                  {variantName}
                </span>
              </>
            )}
          </div>

          {/* Quantity Selector scoped style to match tiny print size */}
          <div
            class={clx(
              isGift && "hidden",
              "w-[84px] quantity-minicart-wrapper",
            )}
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `
              .quantity-minicart-wrapper .quantity-box { height: 28px !important; border: 1px solid #E1E1E1 !important; border-radius: 4px !important; background: #F9F9F9 !important; gap: 0 !important; justify-content: space-between !important; }
              .quantity-minicart-wrapper .minus-signal, .quantity-minicart-wrapper .plus-signal { font-size: 20px !important; width: 28px !important; }
              .quantity-minicart-wrapper .quantity-zero { font-size: 14px !important; padding: 0 !important; margin: 0 !important; }
            `,
              }}
            />
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
