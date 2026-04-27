import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductSliderSimilarsMinicart from "../../components/product/ProductSliderSimilarsMinicart.tsx";
import Section, {
  Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { type LoadingFallbackProps } from "@deco/deco";
import ShelfColorModal from "../../islands/ShelfColorModal.tsx";

export interface Props extends SectionHeaderProps {
  products: Product[] | null;
  /**
   * @description Exibe setas de navegação.
   * @default true
   */
  arrows?: boolean;
  /**
   * @description Exibe pontos de navegação.
   * @default true
   */
  dots?: boolean;
}

export default function ProductShelfSimilarsMinicart({
  products,
  title,
  cta,
  arrows = true,
  dots = true,
}: Props) {
  if (!products || products.length === 0) {
    return null;
  }
  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        item_list_name: title,
        items: products.map((product, index) =>
          mapProductToAnalyticsItem({
            index,
            product,
            ...(useOffer(product.offers)),
          })
        ),
      },
    },
  });

  return (
    <Section.Container {...viewItemListEvent}>
      <Section.Header title={title} cta={cta} />

      <ProductSliderSimilarsMinicart
        products={products}
        itemListName={title}
        arrows={arrows}
        dots={dots}
      />

      {
        /* Modal is injected once per shelf grid.
          When a card dispatches the open-shelf-color-modal event, this component handles it. */
      }
      <ShelfColorModal />
    </Section.Container>
  );
}

export const LoadingFallback = (
  { title, cta }: LoadingFallbackProps<Props>,
) => (
  <Section.Container>
    <Section.Header title={title} cta={cta} />
    <Section.Placeholder height="471px" />
  </Section.Container>
);
