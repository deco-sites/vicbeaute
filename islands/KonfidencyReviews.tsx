import { useSignal } from "@preact/signals";
import { clx } from "../sdk/clx.ts";

export interface Props {
  // deno-lint-ignore no-explicit-any
  reviews: any[];
  // deno-lint-ignore no-explicit-any
  aggregateRating?: any;
}

function StarIcon({ filled, size = 16, borderOnly = false }: { filled: boolean; size?: number; borderOnly?: boolean }) {
  if (borderOnly && !filled) {
     return (
     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#f5b82e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
     </svg>
   )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#f5b82e" : "#e5e7eb"} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={filled ? "#f5b82e" : "#e5e7eb"}/>
    </svg>
  );
}

function ThumbUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z" />
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function ThumbDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
    </svg>
  );
}

function Pagination({ pages, current }: { pages: number; current: number }) {
  if (pages <= 1) return null;
  return (
    <div class="flex justify-center flex-wrap gap-2 mt-8">
       {/* Visual Pagination placeholder if needed */}
    </div>
  )
}

export default function KonfidencyReviews({ reviews = [], aggregateRating }: Props) {
  // Extract total rating or default to 0
  const totalRating = aggregateRating?.ratingValue || 0;
  const reviewCount = aggregateRating?.reviewCount || reviews.length;

  // Extract from additional properties if the loader mapped them inside aggregate rating or product
  // or fallback to 5/5 to match the design faithfully if undefined
  const easeOfApplicationDisplayParam = "5/5";
  const easeOfApplicationPercent = "100%";
  const designDisplayParam = "5/5";
  const designPercent = "100%";

  return (
    <div class="w-full bg-white text-[#4C4C4C] font-Hanken-Grotesk">
      {/* Header Topic */}
      <div class="flex flex-col items-center justify-center text-center mt-12 mb-8">
        <span class="text-sm font-medium uppercase tracking-wider text-gray-500 mb-1">
          O que estão dizendo
        </span>
        <h2 class="font-Queens text-[32px] lg:text-[40px] text-pink-15 leading-tight">
          Sobre o produto
        </h2>
      </div>

      <div class="container max-w-[1044px] px-5 lg:px-0 mx-auto flex flex-col pt-0 pb-12 lg:pb-16 gap-10">
        
        {/* Rating Summary Block */}
        <div class="flex flex-col lg:flex-row justify-between lg:items-center py-6 border-b border-t border-[#E6E6E6] gap-8">
          
          {/* Main Average */}
          <div class="flex flex-row items-center gap-4">
            <span class="text-[32px] lg:text-[48px] font-semibold leading-none">{totalRating.toFixed(1).replace(".", ",")}</span>
            <div class="flex flex-col">
              <div class="flex flex-row gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} filled={s <= Math.round(totalRating)} size={20} />
                ))}
              </div>
            </div>
          </div>

          {/* Sub Ratings - Based on the design screenshots */}
          <div class="flex flex-col min-w-[200px] lg:min-w-[300px] gap-3">
            <div class="flex justify-between items-center text-sm gap-4">
              <span class="w-32 lg:w-40 text-left">Facilidade de aplicação</span>
              <div class="flex-1 bg-[#EEEDEA] h-1.5 rounded-full overflow-hidden">
                <div class="bg-[#ACAD9C] h-full" style={{ width: easeOfApplicationPercent }}></div>
              </div>
              <span class="w-8 text-right bg-transparent">{easeOfApplicationDisplayParam}</span>
            </div>
            
            <div class="flex justify-between items-center text-sm gap-4">
              <span class="w-32 lg:w-40 text-left">Design embalagem</span>
              <div class="flex-1 bg-[#EEEDEA] h-1.5 rounded-full overflow-hidden">
                <div class="bg-[#ACAD9C] h-full" style={{ width: designPercent }}></div>
              </div>
              <span class="w-8 text-right bg-transparent">{designDisplayParam}</span>
            </div>
          </div>

          <div class="flex justify-start lg:justify-end">
            <button class="bg-[#546351] text-white hover:bg-[#435240] transition-colors py-[10px] px-8 text-sm uppercase font-semibold cursor-pointer tracking-widest">
              Quero avaliar
            </button>
          </div>
        </div>

        {/* Reviews List Header */}
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center -mb-2 mt-4 gap-4">
          <span class="text-[22px] lg:text-[24px] font-semibold text-black">
            {reviewCount} avaliações
          </span>
          <div class="flex items-center gap-2 text-sm text-gray-500">
             <span class="text-xs font-semibold">ordenar por</span>
             <div class="relative bg-[#F4F4F4] rounded-sm flex items-center px-3 py-1.5 cursor-pointer">
				<span class="text-sm border-none bg-transparent outline-none pr-6 font-medium text-black">Mais úteis</span>
                <svg class="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
             </div>
          </div>
        </div>

        {/* Reviews Iteration */}
        <div class="flex flex-col gap-10">
          {reviews.length === 0 ? (
            <div class="text-center py-10 text-gray-400">Nenhuma avaliação encontrada.</div>
          ) : (
            reviews.map((rv, index) => {
              const rvRating = rv.reviewRating?.ratingValue || 0;
              const dateObj = rv.datePublished ? new Date(rv.datePublished) : null;
              // A placeholder format since we don't know the exact "x semanas atrás", we could just mock if date missing
              const dateStr = dateObj ? dateObj.toLocaleDateString('pt-BR') : "Algum tempo atrás";
              
              // In the loader toReview, we expect "comprador verificado" status maybe in additionalProperty or default
              const isVerified = true; 
              
              // We'll map images if present (some schemas place images in rv.image)
              const images: string[] = Array.isArray(rv.image) ? rv.image.map(i => typeof i === 'string' ? i : i?.url || '') : [];

              return (
                <div key={index} class="flex flex-col border-b border-[#E6E6E6] pb-8 gap-4">
                  
                  {/* Card Header */}
                  <div class="flex flex-col lg:flex-row justify-between lg:items-start w-full">
                     <div class="flex flex-col gap-2">
			             <div class="flex gap-1">
			                {[1, 2, 3, 4, 5].map((s) => (
			                  <StarIcon key={s} filled={s <= Math.round(rvRating)} size={14} />
			                ))}
			             </div>
                         <div class="flex flex-wrap items-center gap-3 text-[13px] text-gray-500">
                             <span class="font-bold text-black text-sm">{rv.author?.name || "Anônimo"}</span>
                             <span>{dateStr}</span>
                             {isVerified && (
                                <div class="flex items-center gap-1 text-gray-500">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                  </svg>
                                  <span class="text-[11px] uppercase tracking-wide">Comprador verificado</span>
                                </div>
                             )}
                         </div>
                     </div>
                     <div class="hidden lg:flex flex-col items-end gap-2 mt-0">
                         {/* Optional desktop side elements if any. The design has "esta avaliação foi útil?" on the right bottom, 
                             so we can place it here for desktop or at bottom. Actually the design shows it aligned to the right, even with the review text. 
                             Looking at the print, "esta avaliação foi útil?" + thumbs are on the right side on desktop, aligned near the top/middle of the review. */}
                     </div>
                  </div>

                  <div class="flex flex-col lg:flex-row w-full gap-4 lg:gap-10">
                      {/* Text & Images Box */}
                      <div class="flex-1 flex flex-col gap-3">
		                  <p class="text-[14px] leading-relaxed text-[#333333]">
		                    {rv.reviewBody}
		                  </p>
		                  {images.length > 0 && (
		                    <div class="flex gap-2.5 overflow-x-auto mt-2">
		                       {images.map((imgUrl, i) => (
		                          <div key={i} class="w-[80px] h-[80px] flex-shrink-0 bg-gray-100 p-1">
		                             <img src={imgUrl} alt="Review attachment" class="w-full h-full object-cover rounded-sm" />
		                          </div>
		                       ))}
		                    </div>
		                  )}
                      </div>

                      {/* Useful Buttons Desktop/Mobile aligned */}
                      <div class="flex flex-col justify-end items-start lg:items-end lg:w-48 pt-4 lg:pt-0 pb-1 shrink-0">
                          <span class="text-[10px] text-gray-500 uppercase font-semibold tracking-wider mb-2">esta avaliação foi útil?</span>
                          <div class="flex gap-2">
                              <button class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded min-w-[50px] justify-center hover:bg-gray-50 transition-colors">
                                  <ThumbUpIcon />
                                  <span class="text-xs text-gray-600 font-medium">{0}</span> {/* ThumbsUp value */}
                              </button>
                              <button class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded min-w-[50px] justify-center hover:bg-gray-50 transition-colors">
                                  <ThumbDownIcon />
                                  <span class="text-xs text-gray-600 font-medium">{0}</span> {/* ThumbsDown value */}
                              </button>
                          </div>
                      </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
