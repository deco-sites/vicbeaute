import { useSignal } from "@preact/signals";
import Image from "apps/website/components/Image.tsx";
import type { ProductDetailsPage } from "apps/commerce/types.ts";
import Icon from "../ui/Icon.tsx";

interface Props {
  page: ProductDetailsPage;
}

function ProductGallery({ page }: Props) {
  const images = page.product.image ?? [];
  const selectedIndex = useSignal(0);

  if (!images.length) return null;

  return (
    <div class="flex gap-4">
      <div class="hidden md:flex flex-col items-center">
        <div class="flex flex-col gap-2 max-h-[500px] overflow-hidden">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => selectedIndex.value = index}
              class={`border rounded-lg overflow-hidden ${
                selectedIndex.value === index
                  ? "border-primary"
                  : "border-transparent"
              }`}
            >
              <Image
                src={img.url!}
                alt={img.alternateName ?? "Thumbnail"}
                width={80}
                height={80}
                class="object-cover"
              />
            </button>
          ))}
        </div>

        <div class="flex flex-col gap-2 mt-2">
          <button
            onClick={() =>
              selectedIndex.value = selectedIndex.value > 0
                ? selectedIndex.value - 1
                : images.length - 1}
            class="p-2 rounded-full border hover:bg-gray-100"
          >
            <Icon id="ChevronUp" size={16} />
          </button>

          <button
            onClick={() =>
              selectedIndex.value = selectedIndex.value < images.length - 1
                ? selectedIndex.value + 1
                : 0}
            class="p-2 rounded-full border hover:bg-gray-100"
          >
            <Icon id="ChevronDown" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductGallery;
