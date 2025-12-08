import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductSlider from "../../components/product/ProductSlider.tsx";
import Section, {
  Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { type LoadingFallbackProps } from "@deco/deco";

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

export default function ProductShelf({
  products,
  title,
  cta,
  arrows, // Adicionando a prop arrows
  dots, // Adicionando a prop dots
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

      <ProductSlider
        products={products}
        itemListName={title}
        arrows={arrows} // Passando a prop arrows
        dots={dots} // Passando a prop dots
      />
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