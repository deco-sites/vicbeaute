import type {
  Product,
  ProductDetailsPage,
  ProductGroup,
} from "apps/commerce/types.ts";
import Accordion from "../ui/Accordion.tsx";

interface Specification {
  name: string;
  values: string[];
}

export interface Props {
  page: ProductDetailsPage | null;
}

export default function ProductAccordion({ page }: Props) {
  if (!page || !page.product) return null;

  const product = page.product;
  const baseProduct: Product | ProductGroup = product.isVariantOf ?? product;

  let specifications: string[] = [];

  if (
    "additionalProperty" in baseProduct &&
    Array.isArray(baseProduct.additionalProperty)
  ) {
    const seen = new Set<string>();
    specifications = baseProduct.additionalProperty
      .filter((spec) => spec.name !== "sellerId")
      .map((spec) => `${spec.name}: ${spec.value}`)
      .filter((text) => {
        if (seen.has(text)) return false;
        seen.add(text);
        return true;
      });
  }

  if (specifications.length === 0) {
    specifications = ["Não há especificações"];
  }

  let description: string | undefined = product.description;

  if (!description && "description" in baseProduct) {
    description = baseProduct.description;
  }

  if (!description && "hasVariant" in baseProduct) {
    description = baseProduct.hasVariant?.find((v) => v.description)
      ?.description;
  }

  description = description ?? "Sem descrição";

  const items = [
    {
       title: (
        <span className="text-base text-black-5 lg:font-bold">
          Descrição
        </span>
      ),
      subtitle: (
        <div className="text-sm">
          {description.split("\n").map((line, i, arr) => (
            <div
              key={i}
              className={i !== arr.length - 1
                ? "border-b border-neutral-200 py-2 text-lg text-black-5"
                : "py-2 text-lg text-black-5"}
              dangerouslySetInnerHTML={{ __html: line }}
            />
          ))}
        </div>
      ),
    },
    {
      title: (
        <span className="text-base text-black-5 lg:font-bold">
          Especificações
        </span>
       ),
      subtitle: (
        <div className="text-sm">
          {specifications.map((line, i) => {
            const [label, value] = line.split(":");
            return (
              <div
                key={i}
                className={i !== specifications.length - 1
                  ? "border-b border-neutral-200 py-2 flex text-lg text-black-5"
                  : "py-2 flex text-lg text-black-5"}
              >
                <span className="lg:w-[400px] w-[200px]">{label}:</span>
                <span className="ml-2">{value}</span>
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  return <Accordion children={items} />;
}
