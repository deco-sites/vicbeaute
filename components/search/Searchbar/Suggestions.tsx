import { Suggestion } from "apps/commerce/types.ts";
import type { AppContext } from "../../../apps/site.ts";
import { clx } from "../../../sdk/clx.ts";
import { ComponentProps } from "../../../sections/Component.tsx";
import ProductCard from "../../product/ProductCard.tsx";
import Icon from "../../ui/Icon.tsx";
import Slider from "../../ui/Slider.tsx";
import { ACTION, NAME } from "./Form.tsx";
import { type Resolved } from "@deco/deco";

export interface Props {
  /**
   * @title Suggestions Integration
   * @todo: improve this typings ({query: string, count: number}) => Suggestions
   */
  loader: Resolved<Suggestion | null>;
}

export const action = async (props: Props, req: Request, ctx: AppContext) => {
  const { loader: { __resolveType, ...loaderProps } } = props;
  const form = await req.formData();
  const query = `${form.get(NAME ?? "q")}`;
  
  if (!query || query.trim() === "") {
    return { suggestion: null };
  }

  // @ts-expect-error This is a dynamic resolved loader
  const suggestion = await ctx.invoke(__resolveType, {
    ...loaderProps,
    query,
  }) as Suggestion | null;
  return { suggestion };
};

export const loader = async (props: Props, req: Request, ctx: AppContext) => {
  const { loader: { __resolveType, ...loaderProps } } = props;
  const query = new URL(req.url).searchParams.get(NAME ?? "q");
  
  if (!query || query.trim() === "") {
    return { suggestion: null };
  }

  // @ts-expect-error This is a dynamic resolved loader
  const suggestion = await ctx.invoke(__resolveType, {
    ...loaderProps,
    query,
  }) as Suggestion | null;
  return { suggestion };
};

function Suggestions(
  { suggestion }: ComponentProps<typeof loader, typeof action>,
) {
  const { products = [], searches = [] } = suggestion ?? {};
  const hasProducts = Boolean(products.length);
  const hasTerms = Boolean(searches.length);

  if (!hasProducts && !hasTerms) {
    return <div class="hidden"></div>;
  }

  return (
    <div
      class={clx(`overflow-y-scroll lg:overflow-visible`, !hasProducts && !hasTerms && "hidden")}
    >
      <div class="gap-4 grid-cols-1 sm:grid-rows-1 sm:grid-cols-[150px_1fr] flex flex-col lg:bg-white">
        <ul class="flex-col gap-6 hidden">
          {searches.map(({ term }) => (
            <li>
              <a
                href={`${ACTION}?${NAME}=${term}`}
                class="flex gap-4 items-center"
              >
                <span>
                  <Icon id="search" />
                </span>
                <span dangerouslySetInnerHTML={{ __html: term }} />
              </a>
            </li>
          ))}
        </ul>
        <div class="flex flex-col gap-6 overflow-x-hidden pt-4 lg: lg:pt-12 pb-7 px-4">
          <ul class="flex flex-col gap-3">
            {products.map((product, index) => (
              <li key={product.productID} class="flex gap-4 items-center">
                <a href={product.url} class="flex-shrink-0 w-12 h-12">
                  <img
                    src={product.image?.[0]?.url ?? ""}
                    alt={product.image?.[0]?.alternateName ?? product.name}
                    class="w-full h-full object-contain"
                  />
                </a>
                <div class="flex flex-col">
                  <a
                    href={product.url}
                    class="text-sm font-medium line-clamp-2 hover:underline font-Inter"
                  >
                    {product.name}
                  </a>
                  {product.offers?.offers?.[0]?.price && (
                    <span class="text-sm font-semibold font-Inter">
                      R$ {product.offers.offers[0].price.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Suggestions;