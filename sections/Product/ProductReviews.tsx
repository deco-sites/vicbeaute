import type { ProductDetailsPage } from "apps/commerce/types.ts";
import KonfidencyReviews from "../../islands/KonfidencyReviews.tsx";

export interface Props {
  /** @title Integração da Página */
  page: ProductDetailsPage | null;
}

export default function ProductReviews({ page }: Props) {
  if (!page || !page.product) return null;

  const product = page.product;
  const reviews = product.review || [];
  const aggregateRating = product.aggregateRating;

  // Renderiza a section apenas se o loader da konfidency adicionou ou se já existe review / rating
  // Mesmo quando houver 0 avaliações, a konfidency retorna um schema de reviewList vazio pra mostrar o count de 0.
  
  return (
    <div class="w-full">
      <KonfidencyReviews reviews={reviews} aggregateRating={aggregateRating} />
    </div>
  );
}
