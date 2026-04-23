import { useScript } from "@deco/deco/hooks";
import { formatPrice } from "../sdk/format.ts";
import Icon from "../components/ui/Icon.tsx";
import { clx } from "../sdk/clx.ts";
import { useId } from "../sdk/useId.ts";

export interface KitVariant {
  productID: string;
  url: string;
  name: string;
  subtitle: string;
  imgUrl: string;
  largeImageUrl: string;
  seller: string;
}

export interface KitProductComponent {
  productID: string;
  name: string;
  aggregateRating: { ratingValue: number; reviewCount: number } | null;
  variants: KitVariant[];
}

interface Props {
  price: number;
  listPrice: number;
  percent: number;
  kitComponents: KitProductComponent[];
  seller: string;
}

// Single global handler for variant selection — reads data attrs from clicked button
const onSelectVariantClick = () => {
  const button = (event as MouseEvent)
    .currentTarget as HTMLElement | null;
  if (!button) return;

  const variantIndex = Number(button.getAttribute("data-variant-index"));
  const itemId = button.getAttribute("data-item-id")!;
  const item = document.querySelector(
    `[data-kit-item-id="${itemId}"]`,
  ) as HTMLElement | null;
  if (!item) return;

  // Update selected state on buttons
  item.querySelectorAll<HTMLElement>("[data-variant-btn]").forEach(
    (btn, i) => {
      if (i === variantIndex) {
        btn.setAttribute("data-selected", "true");
        btn.classList.add("bg-[#F4F0EB]");
        btn.classList.remove("hover:bg-[#FAFAFA]", "bg-white");
      } else {
        btn.removeAttribute("data-selected");
        btn.classList.remove("bg-[#F4F0EB]");
        btn.classList.add("hover:bg-[#FAFAFA]");
      }
    },
  );

  // Update displayed image
  const variantData = JSON.parse(
    item.getAttribute("data-variants")!,
  ) as KitVariant[];
  const variant = variantData[variantIndex];
  if (!variant) return;

  const img = item.querySelector<HTMLImageElement>("[data-kit-img]");
  if (img) img.src = variant.largeImageUrl || variant.imgUrl;

  // Update color label
  const colorLabel = item.querySelector<HTMLElement>("[data-color-label]");
  if (colorLabel) colorLabel.textContent = `Cor: ${variant.name}`;

  // Update swatch border highlights in summary
  item.querySelectorAll<HTMLElement>("[data-swatch]").forEach((sw, i) => {
    sw.style.borderColor = i === variantIndex ? "#CE9680" : "#D5D8C2";
  });

  // Store selected index
  item.setAttribute("data-selected-index", String(variantIndex));

  // Close details dropdown
  const details = button.closest("details");
  if (details) details.removeAttribute("open");
};

// Global handler for Add To Cart
const onAddToCartClick = () => {
  const button = (event as MouseEvent)
    .currentTarget as HTMLElement | null;
  if (!button) return;

  const containerId = button.getAttribute("data-container-id")!;
  const price = Number(button.getAttribute("data-price") || 0);
  const container = document.getElementById(containerId);
  if (!container) return;

  const items = container.querySelectorAll<HTMLElement>("[data-kit-item-id]");
  const orderItems: { id: string; seller: string; quantity: number }[] = [];

  items.forEach((item) => {
    const selectedIndex = Number(
      item.getAttribute("data-selected-index") || 0,
    );
    const variants = JSON.parse(
      item.getAttribute("data-variants")!,
    ) as KitVariant[];
    const variant = variants[selectedIndex];
    if (variant) {
      orderItems.push({
        id: variant.productID,
        seller: variant.seller,
        quantity: 1,
      });
    }
  });

  if (orderItems.length === 0) return;

  const platformProps = {
    allowedOutdatedData: ["paymentData"],
    orderItems,
  };

  const analyticsItem = {
    item_id: orderItems.map((o) => o.id).join(","),
    quantity: orderItems.length,
    price,
  };

  // @ts-ignore: Standard VTEX storefront injection
  window.STOREFRONT.CART.addToCart(analyticsItem, platformProps);
};

export default function KitAddToCart(
  { kitComponents, price, listPrice, percent }: Props,
) {
  const id = useId();

  // Pre-compute scripts before any conditional return (rules of hooks)
  const selectScript = useScript(onSelectVariantClick);
  const addToCartScript = useScript(onAddToCartClick);

  if (!kitComponents || kitComponents.length === 0) {
    return null;
  }

  return (
    <div id={id} class="flex flex-col gap-4">
      {/* Kit product list */}
      <div class="flex flex-col gap-3">
        {kitComponents.map((p) => {
          const hasVariants = p.variants.length > 1;
          const firstVariant = p.variants[0];
          const swatchImage = firstVariant?.largeImageUrl ||
            firstVariant?.imgUrl || "";
          const aggregateRating = p.aggregateRating;

          return (
            <div
              key={p.productID}
              data-kit-item-id={p.productID}
              data-selected-index="0"
              data-variants={JSON.stringify(p.variants)}
              class="bg-white rounded-[10px] p-3 flex flex-col gap-3 w-full shadow-sm border border-[#E9E9E9]"
            >
              <div class="flex gap-4 w-full">
                {/* Thumbnail */}
                <div class="w-[88px] h-[88px] shrink-0 bg-[#FAF9F5] rounded-[5px] overflow-hidden relative">
                  {swatchImage && (
                    <img
                      data-kit-img
                      src={swatchImage}
                      alt={p.name}
                      width={88}
                      height={88}
                      class="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div class="flex flex-col flex-1 pl-1">
                  {/* Konfidency stars */}
                  <div class="flex items-center gap-1 h-[18px] mb-1">
                    {aggregateRating && (aggregateRating.ratingValue ?? 0) > 0
                      ? (
                        <>
                          <Icon
                            id="star-konfidency"
                            size={14}
                            class="text-[#fac915]"
                          />
                          <span class="font-Hanken-Grotesk text-[12px] text-[#363931] leading-none">
                            {(aggregateRating.ratingValue ?? 0).toFixed(1)
                              .replace(".", ",")}
                          </span>
                          <span class="font-Hanken-Grotesk text-[12px] text-[#717171] leading-none">
                            ({aggregateRating.reviewCount})
                          </span>
                        </>
                      )
                      : <span class="h-[14px]"></span>}
                  </div>

                  <h3 class="font-Hanken-Grotesk text-[16px] text-[#363931] font-semibold leading-tight mb-2">
                    {p.name}
                  </h3>

                  {/* Color dropdown */}
                  {hasVariants && (
                    <details class="overflow-hidden w-full group mt-auto">
                      <summary class="flex items-center justify-between px-[10px] py-[6px] bg-white cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                        <div class="flex flex-col items-start gap-1">
                          <span
                            data-color-label
                            class="font-Hanken-Grotesk text-[12px] text-[#717171]"
                          >
                            Cor: {firstVariant?.name}
                          </span>
                          {/* Mini swatches preview */}
                          <div class="flex items-center gap-[5px]">
                            {p.variants.slice(0, 5).map((vr, i) => (
                              <div
                                key={vr.productID}
                                data-swatch
                                class="w-4 h-4 rounded-full overflow-hidden border-[1.5px]"
                                style={`border-color: ${
                                  i === 0 ? "#CE9680" : "#D5D8C2"
                                }`}
                              >
                                <img
                                  src={vr.imgUrl}
                                  class="w-full h-full rounded-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <span class="text-[#444] flex-shrink-0 transition-transform duration-200 rotate-0 group-open:rotate-180">
                          <Icon id="arrowdown" size={16} />
                        </span>
                      </summary>

                      {/* Color list */}
                      <div class="border-t border-[#EBEBEB] max-h-[240px] overflow-y-auto w-full">
                        {p.variants.map((color, variantIndex) => (
                          <button
                            key={color.productID}
                            type="button"
                            data-variant-btn
                            data-variant-index={variantIndex}
                            data-item-id={p.productID}
                            data-selected={variantIndex === 0
                              ? "true"
                              : undefined}
                            hx-on:click={selectScript}
                            class={clx(
                              "w-full flex items-center gap-3 px-3 py-[8px] transition-colors text-left",
                              variantIndex > 0
                                ? "border-t border-[#F2F2F2]"
                                : "",
                              variantIndex === 0
                                ? "bg-[#F4F0EB]"
                                : "hover:bg-[#FAFAFA]",
                            )}
                          >
                            <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-[#F0F0F0]">
                              <img
                                src={color.imgUrl}
                                alt={color.name}
                                width={32}
                                height={32}
                                class="w-full h-full object-cover"
                              />
                            </div>
                            <div class="flex flex-col text-left overflow-hidden">
                              <span class="text-[13px] font-semibold text-[#212121] leading-tight truncate">
                                {color.name}
                              </span>
                              {color.subtitle && (
                                <span class="text-[11px] text-[#777] leading-tight truncate mt-[2px]">
                                  {color.subtitle}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add to cart box */}
      <div class="bg-[#F2EFEB] p-5 rounded-[12px] mt-2">
        <div class="flex flex-col items-center justify-center text-center">
          <div class="flex items-end justify-center gap-2">
            {listPrice > price && (
              <span class="line-through text-[16px] text-[#717171] mb-[3px] font-Hanken-Grotesk">
                {formatPrice(listPrice, "BRL")}
              </span>
            )}
            <span class="text-[32px] font-bold text-[#455C42] font-Hanken-Grotesk leading-none">
              {formatPrice(price, "BRL")}
            </span>
            {percent > 0 && (
              <span class="text-[12px] font-bold text-white bg-[#EE3730] rounded-[3px] px-[6px] py-[3px] mb-1 font-Hanken-Grotesk">
                -{percent}% OFF
              </span>
            )}
          </div>

          <div class="flex items-center gap-[6px] justify-center mt-2 mb-5">
            <span class="text-[14px] text-[#455C42] font-Hanken-Grotesk font-medium">
              Tenha 5% de desconto no PIX
            </span>
            <Icon id="pdpPix" size={13} class="text-[#455C42]" />
          </div>

          <div class="flex items-center gap-3 w-full">
            <button
              type="button"
              data-container-id={id}
              data-price={price}
              hx-on:click={addToCartScript}
              class="flex-1 bg-[#455C42] hover:bg-[#3d513a] text-[#FAF9F5] rounded-[6px] h-[52px] flex items-center justify-center gap-2 font-Hanken-Grotesk font-semibold text-[16px] transition-colors"
            >
              Adicionar ao carrinho
              <Icon id="bagpdp" size={18} class="text-[#FAF9F5]" />
            </button>
            <button
              type="button"
              class="w-[52px] h-[52px] bg-white rounded-full flex items-center justify-center shadow-sm text-[#455C42]"
            >
              <Icon id="heartpdp" size={24} />
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-end pr-2">
        <button
          type="button"
          class="w-[42px] h-[42px] border border-[#D5D8C2] rounded-full flex items-center justify-center text-[#717171]"
        >
          <Icon id="share" size={20} />
        </button>
      </div>
    </div>
  );
}
