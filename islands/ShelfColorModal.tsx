import { useEffect, useState } from "preact/hooks";
import { Product } from "apps/commerce/types.ts";
import Icon from "../components/ui/Icon.tsx";
import { formatPrice } from "../sdk/format.ts";
import { useId } from "../sdk/useId.ts";
import { MINICART_DRAWER_ID } from "../constants.ts";
function LocalBag() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // @ts-ignore
    const cartSdk = window.STOREFRONT?.CART;
    if (cartSdk) {
      setCount(cartSdk.getCart()?.items.length ?? 0);
      cartSdk.subscribe((sdk: any) => {
        setCount(sdk.getCart()?.items.length ?? 0);
      });
    }
  }, []);

  return (
    <label
      for={MINICART_DRAWER_ID}
      class="w-[52px] h-[52px] xl:h-[42px] xl:w-[42px] bg-[#51614C] rounded-sm flex items-center justify-center cursor-pointer hover:bg-[#3f4b3a] transition-colors relative flex-shrink-0"
      aria-label="Abrir carrinho"
    >
      <span
        class={`absolute -right-2 -top-2 bg-white-15 text-[#51614C] text-[10px] sm:text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-gray-200 shadow-sm ${
          count === 0 ? "hidden" : ""
        }`}
      >
        {count > 9 ? "9+" : count}
      </span>
      <Icon
        id="minicart"
        class="text-white fill-white"
        width={19}
        height={21}
      />
    </label>
  );
}

// Helper for cart properties
const useAddToCartProps = (product: Product, platform: string) => {
  const { productID } = product;
  const seller = product.offers?.offers[0]?.seller || "1";

  if (platform === "vtex") {
    return {
      allowedOutdatedData: ["paymentData"],
      orderItems: [{ quantity: 1, seller: seller, id: productID }],
    };
  }
  if (platform === "wake") {
    return {
      productVariantId: Number(productID),
      quantity: 1,
    };
  }
  return { quantity: 1, itemId: productID };
};

export default function ShelfColorModal(
  { platform = "vtex" }: { platform?: string },
) {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  useEffect(() => {
    const handleOpen = (
      e: CustomEvent<{ products: Product[]; initialProductId: string }>,
    ) => {
      setProducts(e.detail.products);
      setActiveProductId(e.detail.initialProductId);
      setIsOpen(true);
      document.body.style.overflow = "hidden"; // previne scroll
    };

    window.addEventListener(
      "open-shelf-color-modal",
      handleOpen as EventListener,
    );

    return () => {
      window.removeEventListener(
        "open-shelf-color-modal",
        handleOpen as EventListener,
      );
    };
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      document.body.style.overflow = "auto";
      setProducts([]);
      setActiveProductId(null);
    }, 300);
  };

  if (!isOpen || !activeProductId || products.length === 0) return null;

  const activeProduct = products.find((p) => p.productID === activeProductId) ||
    products[0];
  const price = activeProduct.offers?.offers[0]?.price || 0;
  const listPrice = activeProduct.offers?.offers[0]?.priceSpecification.find(
    (p) => p.priceType === "https://schema.org/ListPrice",
  )?.price;

  const handleAddToCart = () => {
    const item = {
      item_id: activeProduct.productID,
      quantity: 1,
      price: price,
    };
    const platformProps = useAddToCartProps(activeProduct, platform);

    // @ts-ignore
    if (window.STOREFRONT?.CART?.addToCart) {
      // @ts-ignore
      window.STOREFRONT.CART.addToCart(item, platformProps);
    }

    closeModal();
  };

  // Getting images — all except color swatch (label "cor")
  const allImages = (activeProduct.image || []).filter(
    (img) => img.name?.toLowerCase() !== "cor",
  );

  // Description
  const description = activeProduct.description ||
    activeProduct.isVariantOf?.description || "";

  // Custom Color Subtitle derived from additional properties (from VTEX specs)
  const colorSpec =
    activeProduct.additionalProperty?.find((attr) =>
      attr.name?.toLowerCase() === "cor"
    )?.value || "";

  // Atributo "Cores" no nível de produto (igual ao subtitle do seletor da PDP)
  const coresSpec = (activeProduct.isVariantOf?.additionalProperty ??
    activeProduct.additionalProperty ?? [])
    .find((attr) => attr.name === "Cores")?.value || "";

  return (
    <div class="fixed inset-0 z-50 flex items-end lg:items-center justify-center animate-fade-in lg:p-4">
      {/* Backdrop */}
      <div
        class="absolute inset-0 bg-black/50 transition-opacity"
        onClick={closeModal}
      />

      {/* Modal Container */}
      <div class="bg-[#ffffff] w-full xl:max-w-[500px] h-[90vh] lg:h-auto lg:max-h-[85vh] rounded-t-[32px] lg:rounded-2xl overflow-hidden flex flex-col relative z-10 shadow-2xl animate-slide-up lg:animate-fade-in">
        {/* Top Header - Barra Branca Fullwidth */}
        <div class="w-full bg-white px-5 pt-4 flex items-center z-20 shrink-0">
          <button
            class="p-1 px-[3px] text-[#191919] hover:opacity-70 transition-opacity rounded-full border border-[#4c4c4c] flex items-center justify-center w-[38px] h-[38px] bg-white"
            onClick={closeModal}
            aria-label="Voltar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>

        {/* Content Scrollable Area */}
        <div class="flex-grow overflow-y-auto px-6 pt-[14px] pb-28 custom-scrollbar">
          {/* Fileira Horizontal de Imagens Topo (130x130, gap 5px) */}
          <div class="flex flex-row overflow-x-auto gap-[5px] pb-4 mb-2 scrollbar-none snap-x w-[calc(100%+48px)] -ml-6 px-6">
            {allImages.map((img) => (
              <div class="w-[130px] h-[130px] shrink-0 bg-[#f4f4f4] rounded-[4px] overflow-hidden flex items-center justify-center snap-start">
                <img
                  src={img.url}
                  alt={img.alternateName}
                  class="w-full h-full object-cover mix-blend-multiply"
                />
              </div>
            ))}
          </div>

          <h2 class="text-[17px] font-bold text-[#191919] leading-[1.2] mt-4 font-Manrope xl:text-[20px]">
            {activeProduct.isVariantOf?.name || activeProduct.name}
            <span class="font-normal font-Manrope text-[#363931] ml-1.5 opacity-90">
              {coresSpec || colorSpec ||
                activeProduct.name?.split("-").pop()?.trim()}
            </span>
          </h2>
          <div class="flex gap-2 items-center">
            <span class="font-Hanken-Grotesk text-[14px] text-[#363931] font-medium xl:text-[16px]">
              {formatPrice(price)}
            </span>
            {listPrice && listPrice > price && (
              <span class="text-[13px] text-gray-400 line-through">
                R$ {formatPrice(listPrice)}
              </span>
            )}
          </div>

          <div>
            <details class="group first:border-t-0 border-t border-b border-[#f2f2f2] pt-5 pb-3">
              <summary class="flex justify-between items-center font-medium cursor-pointer list-none text-[20px] lg:text-[24px] text-[#CE9680] font-Queens">
                Descrição
                <span class="transition group-open:rotate-180">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-[#D1927D] group-open:hidden"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-[#D1927D] hidden group-open:block"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </span>
              </summary>
              <div
                class="text-gray-600 mt-3 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </details>
          </div>

          <h3 class="text-[20px] lg:text-[24px] text-[#CE9680] font-Queens mt-[10px] mb-2">
            Cores
          </h3>

          {/* Bolinhas de Cores */}
          <div class="grid grid-cols-4 sm:grid-cols-5 gap-y-4 gap-x-2 pb-5">
            {products.map((p) => {
              const pCor = p.additionalProperty?.find((attr) =>
                attr.name?.toLowerCase() === "cor"
              )?.value || p.name?.split("-").pop()?.trim() || "";
              const pCores =
                (p.isVariantOf?.additionalProperty ?? p.additionalProperty ??
                  [])
                  .find((attr) =>
                    attr.name === "Cores"
                  )?.value || "";
              const pImage = p.image?.find((img) =>
                img.name?.toLowerCase() === "cor"
              )?.url ?? p.image?.[0]?.url;
              const isSelected = p.productID === activeProductId;

              return (
                <button
                  onClick={() => setActiveProductId(p.productID)}
                  class="flex flex-col items-center group outline-none"
                  aria-label={`Selecionar cor ${pCor}`}
                >
                  <div
                    class={`w-[30px] h-[30px] sm:w-14 sm:h-14 rounded-full overflow-hidden transition-all duration-200 border border-[#e5e5e5] ${
                      isSelected
                        ? "border-[#4c4c4c] p-[2px]"
                        : "border-transparent group-hover:border-gray-300 p-[2px]"
                    }`}
                  >
                    <div class="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#f4f4f4] border border-[#f0f0f0]">
                      {pImage
                        ? (
                          <img
                            src={pImage}
                            alt={pCor}
                            class="w-full h-full object-cover"
                          />
                        )
                        : (
                          <span class="text-[10px] text-gray-500 font-medium tracking-tighter uppercase">
                            {pCor?.substring(0, 2)}
                          </span>
                        )}
                    </div>
                  </div>
                  <span
                    class={`font-Hanken-Grotesk font-normal text-[10px] leading-[10px] tracking-normal text-center line-clamp-2 px-0.5 text-[#13100D] mt-1${
                      isSelected ? "opacity-100" : "opacity-75"
                    }`}
                  >
                    {pCor}
                  </span>
                  {pCores && (
                    <span class="font-Hanken-Grotesk font-normal text-[10px] leading-[10px] tracking-normal text-center line-clamp-1 px-0.5 text-[#13100D] opacity-75">
                      {pCores}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div class="absolute bottom-0 left-0 w-full bg-white-15 border-t border-gray-100 pt-[10px] pb-2 px-4 z-20 flex flex-col gap-2">
          <div class="flex items-center gap-3 w-full">
            <button
              class="flex-grow py-[14px] xl:py-4 xl:px-[75px] text-[15px] text-white-15 transition-all rounded-[3px] flex items-center justify-center bg-[#51614C] font-Manrope font-medium text-sm leading-[10px] "
              onClick={handleAddToCart}
            >
              Adicionar ao carrinho
            </button>
            <LocalBag />
          </div>

          <div class="flex justify-center items-center gap-3 text-[14px] font-Manrope opacity-90">
            <a
              href={activeProduct.url}
              class="font-medium text-[#000000] hover:opacity-70 transition-opacity font-Manrope text-[12px] underline-offset-4"
              style={{ textDecoration: "underline" }}
            >
              Ver mais detalhes
            </a>
            <span class="text-[#808080] text-[13px] mx-1">ou</span>
            <button
              onClick={closeModal}
              class="font-medium text-[#191919] hover:opacity-70 transition-opacity underline-offset-4"
              style={{ textDecoration: "underline" }}
            >
              Continuar comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
