import { HTMLWidget } from "apps/admin/widgets.ts";
import FaqMap from "../../islands/FaqInstitutionalInteractive.tsx";
import type { FaqCard } from "../../islands/FaqInstitutionalInteractive.tsx";

export interface Props {
  /** @title Título Principal */
  title?: string;
  /** @title Placeholder da Busca */
  searchPlaceholder?: string;
  /** @title Perguntas Frequentes */
  cards?: FaqCard[];
}

export default function FaqInstitutional({
  title = "Perguntas Frequentes",
  searchPlaceholder = "O que você procura?",
  cards = [],
}: Props) {
  return (
    <FaqMap title={title} searchPlaceholder={searchPlaceholder} cards={cards} />
  );
}
