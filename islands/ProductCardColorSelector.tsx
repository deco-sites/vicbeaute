import { Product } from "apps/commerce/types.ts";
import { relative } from "../sdk/url.ts";
import { Ring } from "../components/product/ProductVariantSelector.tsx"; // we can reuse Ring for styles if we want, or make custom circles

export interface Props {
  products: Product[];
  currentProductId: string;
}

export default function ProductCardColorSelector({ products, currentProductId }: Props) {
  if (products.length <= 1) return null;

  // Render max 3 circles
  const maxVisible = 3;
  const visibleProducts = products.slice(0, maxVisible);
  const remainingCount = products.length - maxVisible;

  const handleOpenModal = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Dispatch event to structural modal
    window.dispatchEvent(
      new CustomEvent("open-shelf-color-modal", {
        detail: { products, initialProductId: currentProductId },
      })
    );
  };

  return (
    <div class="flex items-center justify-start z-20" onClick={(e) => e.preventDefault() /* prevent card click if clicking colors */}>
      <div class="flex items-center gap-1">
        {visibleProducts.map((p) => {
          const colorName = p.additionalProperty?.find(attr => attr.name?.toLowerCase() === "cor")?.value || p.name?.split("-").pop()?.trim() || "";
          const imgUrl = p.image?.find((img) => img.name?.toLowerCase() === "cor")?.url ?? p.image?.[0]?.url;
          const isSelected = p.productID === currentProductId;

          return (
            <a 
              href={relative(p.url)} 
              class="cursor-pointer group flex items-center justify-center outline-none"
              title={colorName}
              onClick={(e) => { e.stopPropagation(); }} // let the standard <a> behavior happen
            >
              <div class={`w-[18px] h-[18px] rounded-full overflow-hidden transition-all duration-200 border border-[#e5e5e5] ${isSelected ? 'border-[#4c4c4c] p-[1.5px]' : 'border-transparent group-hover:border-gray-300 p-[1.5px]'}`}>
                <div class="w-full h-full rounded-full overflow-hidden flex items-center justify-center text-[7px] bg-[#f4f4f4]">
                  {imgUrl ? (
                    <img src={imgUrl} alt={colorName} class="w-full h-full object-cover" />
                  ) : (
                    colorName.substring(0, 2).toUpperCase()
                  )}
                </div>
              </div>
            </a>
          );
        })}

        {/* Botao de mais Cores (+N) */}
        {remainingCount > 0 && (
          <button 
            type="button"
            onClick={handleOpenModal}
            class="w-[18px] h-[18px] rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#4c4c4c] hover:border-[#808080] transition-colors"
            aria-label={`Ver mais ${remainingCount} cores`}
          >
            <svg width="6" height="6" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 1v8M1 5h8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
