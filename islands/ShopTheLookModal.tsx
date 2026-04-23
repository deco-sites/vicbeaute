import { useEffect, useState } from "preact/hooks";
import { Product } from "apps/commerce/types.ts";
import Icon from "../components/ui/Icon.tsx";
import { formatPrice } from "../sdk/format.ts";

export interface LookModalData {
  imageDesk: string;
  imageMobile?: string;
  imageAlt?: string;
  modalImage?: string;
  modalImageMobile?: string;
  cardType?: string;
  title: string;
  subtitle: string;
  products?: Product[] | null;
}

const useAddToCartProps = (product: Product, platform: string) => {
  const { additionalProperty = [], isVariantOf, productID } = product;
  const productGroupID = isVariantOf?.productGroupID;

  // Emulando a captura de seller basico se VTEX
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
  // Default fallback similar a vnda/shopify...
  return { quantity: 1, itemId: productID };
};

export default function ShopTheLookModal(
  { looks, platform = "vtex" }: { looks?: LookModalData[]; platform?: string },
) {
  const [activeLook, setActiveLook] = useState<LookModalData | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const handleOpen = (e: CustomEvent<{ index: number }>) => {
      if (!looks || !looks[e.detail.index]) return;
      setActiveLook(looks[e.detail.index]);
      setSelectedProductIds(new Set()); // zera a selecao e abre com eles vazios
      document.body.style.overflow = "hidden"; // previne scroll da pagina traseira
    };

    window.addEventListener("open-look-modal", handleOpen as EventListener);

    return () => {
      window.removeEventListener(
        "open-look-modal",
        handleOpen as EventListener,
      );
    };
  }, []);

  const closeModal = () => {
    setActiveLook(null);
    document.body.style.overflow = "auto";
  };

  if (!activeLook) return null;

  const toggleProduct = (productId: string) => {
    const newSet = new Set(selectedProductIds);
    if (newSet.has(productId)) newSet.delete(productId);
    else newSet.add(productId);
    setSelectedProductIds(newSet);
  };

  const handleAddToCart = () => {
    if (selectedProductIds.size === 0) return;

    const itemsToAdd = (activeLook.products || []).filter((p) =>
      selectedProductIds.has(p.productID)
    );

    itemsToAdd.forEach((product) => {
      const price = product.offers?.offers[0]?.price || 0;
      const item = { item_id: product.productID, quantity: 1, price: price };
      const platformProps = useAddToCartProps(product, platform);

      // @ts-ignore - Chamada global ao Cart nativo da implementacao da Vtex/Wake do projeto
      if (window.STOREFRONT?.CART?.addToCart) {
        // @ts-ignore
        window.STOREFRONT.CART.addToCart(item, platformProps);
      }
    });

    closeModal();
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-0">
      {/* Backdrop */}
      <div
        class="absolute inset-0 bg-black/60 transition-opacity"
        onClick={closeModal}
      />

      {/* Modal Container */}
      <div class="bg-[#ffffff] xl:px-[30px] xl:py-[30px] w-full max-w-[850px] max-h-[90vh] overflow-hidden flex flex-col lg:flex-row relative z-10 rounded-sm shadow-2xl animate-fade-in gap-[18px] xl:gap-[25px]">
        <button
          class="absolute xl:top-[30px] xl:right-[30px] top-5 right-5 z-20 text-[#191C1F] hover:opacity-70 transition-opacity bg-white/50 lg:bg-transparent rounded-full p-1"
          onClick={closeModal}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Left Side: Header (Mobile) + Image */}
        <div class="w-full flex flex-col relative xl:gap-4">
          {/* Header visivel no topo da imagem no Desktop, em cima no Mobile? Fica melhor integrado no topo da img */}
          <div class="bg-white px-5 pt-5 pb-[13px] xl:px-0 xl:py-0 z-10 flex flex-col lg:shadow-none">
            <h2 class="text-[26px] xl:text-[32px] text-[#455C42] xl:text-[#CE9680] font-Manrope xl:font-Hanken-Grotesk">
              {activeLook.title}
            </h2>
            <span class="text-[13px] text-gray-500 mt-1">
              {activeLook.subtitle}
            </span>
          </div>

          <div class="lg:flex-grow lg:overflow-hidden px-6 lg:px-0 lg:py-0 w-full">
            <picture>
              {activeLook.modalImageMobile && (
                <source
                  media="(max-width: 1023px)"
                  srcSet={activeLook.modalImageMobile}
                />
              )}
              <img
                src={activeLook.modalImage || activeLook.imageDesk}
                alt={activeLook.imageAlt || "Look"}
                class="w-full lg:h-full lg:object-cover lg:object-top rounded-sm"
              />
            </picture>
          </div>
        </div>

        {/* Right Side: Products List */}
        <div class="w-full lg:w-[55%] flex flex-col flex-grow relative">
          <div class="overflow-y-auto px-6 xl:px-0 xl:pt-[70px] pb-24 lg:pb-32 flex flex-col gap-6 xl:gap-[12px] custom-scrollbar h-full">
            {(activeLook.products || []).map((product) => {
              const price = product.offers?.offers[0]?.price || 0;
              const colorAttr = product.additionalProperty?.find((attr) =>
                attr.name?.toLowerCase() === "cor"
              );
              const corStr = colorAttr ? `Cor: ${colorAttr.value}` : "";

              const isSelected = selectedProductIds.has(product.productID);

              return (
                <div
                  key={product.productID}
                  class="flex items-center gap-5 xl:gap-3 border-b border-gray-100 pb-5 xl:pb-[12px] last:border-0 last:pb-0"
                >
                  {/* Checkbox custom */}
                  <button
                    class={`w-[22px] h-[22px] xl:w-[26px] xl:h-[26px] rounded-sm flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected
                        ? "bg-[#EAE8E2] border-[#455C42] border border-opacity-30"
                        : "bg-[#EAE8E2] border-transparent border hover:border-gray-300"
                    }`}
                    onClick={() => toggleProduct(product.productID)}
                    aria-label="Selecionar produto"
                  >
                    {/* Como não sei se o design pede icon, vou usar um verde musgo ao preencher */}
                    {isSelected && (
                      <div class="w-3 h-3 bg-[#455C42] rounded-sm"></div>
                    )}
                  </button>

                  <div class="w-[80px] h-[80px] bg-[#F4F4F4] rounded-sm overflow-hidden flex-shrink-0 flex items-center justify-center xl:p-0 p-1">
                    {product.image?.[0]?.url && (
                      <img
                        src={product.image[0].url}
                        class="w-full h-full xl:w-[80px] xl:h-[80px] object-contain mix-blend-multiply"
                        alt={product.name}
                      />
                    )}
                  </div>

                  <div class="flex flex-col gap-1 pr-2">
                    <span class="text-[14px] line-clamp-2 leading-snug font-Manrope text-[#4D5D49]">
                      {product.name}
                    </span>
                    {corStr && (
                      <span class="text-[14px] font-Manrope text-[#4D5D49]">{corStr}</span>
                    )}
                    <span class="text-[14px] mt-1 font-Manrope text-[#4D5D49]">
                       {formatPrice(price)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fixed Bottom Action */}
          <div class="xl:pt-[10px] xl:rounded-full absolute bottom-0 left-0 w-full border-gray-100 xl:px-0 xl:py-0 px-6 py-5 z-20">
            <button
              class={`w-full xl:rounded-full py-[14px] xl:px-8 text-[14px] font-bold tracking-widest uppercase transition-all rounded-sm flex items-center justify-center xl:justify-between gap-3 shadow-md ${
                selectedProductIds.size > 0
                  ? "bg-[#556b50] text-[#FAFAFA] hover:bg-[#455C42]"
                  : "bg-[#e5e5e5] text-white-15 pointer-events-none"
              }`}
              onClick={handleAddToCart}
            >
              <span class="xl:whitespace-nowrap flex items-center font-Manrope font-bold font[14px] gap-1">
                ADICIONAR PRODUTOS
              </span>
              <div class="xl:-translate-y-[3px]">
                <Icon id="bag-shop-the-look" size={24} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
