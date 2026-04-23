import type { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { formatPrice } from "../../sdk/format.ts";
import Image from "apps/website/components/Image.tsx";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";
import { clx } from "../../sdk/clx.ts";
import AddToCartButtonPdp from "./AddToCartButtonPdp.tsx";

interface Props {
  product: Product;
  price: number;
  listPrice?: number;
  installments?: string | null;
  percent: number;
  item: AnalyticsItem;
  seller: string;
}

function formatPriceWithStyledSymbol(value: number, currency?: string) {
  const fullPrice = formatPrice(value, currency);
  const match = fullPrice?.match(/^(R\$)(.*)$/);
  if (!match) return fullPrice;
  return (
    <>
      <span class="text-[13px] sm:text-[15px] font-bold text-green-10 self-center">
        {match[1]}&nbsp;
      </span>
      <span class="text-xl sm:text-[22px] font-bold text-green-10 lowercase">
        {match[2]}
      </span>
    </>
  );
}

const setupObserver = (deskId: string, mobId: string, stickyId: string) => {
  const sticky = document.getElementById(stickyId);
  if (!sticky) return;

  const state = { desk: false, mob: false };

  const updateSticky = () => {
    // If either active observed element is above viewport, show sticky
    if (state.desk || state.mob) {
      sticky.classList.remove("translate-y-full");
      sticky.classList.add("translate-y-0");
    } else {
      sticky.classList.remove("translate-y-0");
      sticky.classList.add("translate-y-full");
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Ignore hidden elements
      if (
        entry.boundingClientRect.width === 0 &&
        entry.boundingClientRect.height === 0
      ) {
        if (entry.target.id === deskId) state.desk = false;
        if (entry.target.id === mobId) state.mob = false;
        return;
      }

      const isOutTop = !entry.isIntersecting &&
        entry.boundingClientRect.top < 0;
      if (entry.target.id === deskId) state.desk = isOutTop;
      if (entry.target.id === mobId) state.mob = isOutTop;
    });
    updateSticky();
  }, { rootMargin: "0px", threshold: 0 });

  const deskEl = document.getElementById(deskId);
  const mobEl = document.getElementById(mobId);
  if (deskEl) observer.observe(deskEl);
  if (mobEl) observer.observe(mobEl);
};

export default function AddToCartSticky(
  { product, price, listPrice, installments, percent, item, seller }: Props,
) {
  const id = useId();
  const [front] = product.image ?? [];
  const { name } = product;

  return (
    <div
      id={id}
      class="fixed bottom-0 left-0 w-full z-[999] bg-[#ffffff] border-t border-gray-200 shadow-[0_-4px_6px_rgba(0,0,0,0.05)] flex justify-center py-2 sm:py-3 transition-transform duration-300 translate-y-full"
    >
      <div class="flex items-center justify-between w-full mx-auto max-w-[1220px] px-4 sm:px-8 sm:w-auto">
        {/* Desktop Let Side: Image and Title */}
        <div class="hidden sm:flex items-center gap-4 pr-8 sm:pr-10 border-r border-[#E5E5E5]">
          {front?.url && (
            <Image
              src={front.url}
              alt={front.alternateName}
              width={64}
              height={64}
              class="rounded-md object-cover h-[52px] w-[52px] bg-gray-15"
            />
          )}
          <span class="font-bold text-[15px] text-green-10 line-clamp-2 max-w-[300px]">
            {name}
          </span>
        </div>

        {/* Right Side: Prices and Button */}
        <div class="flex items-center justify-between sm:justify-start pl-0 sm:pl-10 gap-4 sm:gap-8 w-full sm:w-auto">
          {/* Prices block */}
          <div class="flex flex-col items-start gap-0">
            {listPrice && listPrice > price && (
              <span class="line-through text-[13px] text-[#737373] font-Hanken-Grotesk leading-none mb-1">
                {formatPrice(listPrice)}
              </span>
            )}
            <div class="flex items-center gap-2 leading-none">
              <span class="flex items-baseline text-green-10">
                {formatPriceWithStyledSymbol(price)}
              </span>
              {percent > 0 && (
                <span class="text-[10px] font-bold text-[#ffffff] bg-[#EE3730] rounded px-[6px] py-[2px] leading-none flex items-center">
                  -{percent}% OFF
                </span>
              )}
            </div>
            {installments && (
              <span class="text-xs text-[#4D5D49] font-Hanken-Grotesk mt-1 leading-none">
                {installments}
              </span>
            )}
          </div>

          {/* Action Button */}
          <div class="shrink-0 w-[140px] sm:w-auto">
            {/* Mobile view uses "Adicionar", Desktop uses default "Adicionar ao carrinho" via label prop manipulation */}
            <div class="sm:hidden w-full">
              <AddToCartButtonPdp
                item={item}
                seller={seller}
                product={product}
                class="btn btn-primary no-animation bg-green-10 hover:bg-green-10 text-[#ffffff] border-none h-11 min-h-0 w-full px-2"
                label="Adicionar"
              />
            </div>
            <div class="hidden sm:block w-[240px]">
              <AddToCartButtonPdp
                item={item}
                seller={seller}
                product={product}
                class="btn btn-primary no-animation bg-green-10 hover:bg-green-10 text-[#ffffff] border-none h-11 min-h-0 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            setupObserver,
            "add-to-cart-box-desktop",
            "add-to-cart-box-mobile",
            id,
          ),
        }}
      />
    </div>
  );
}
