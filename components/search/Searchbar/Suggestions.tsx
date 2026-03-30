import { Suggestion } from "apps/commerce/types.ts";
import type { AppContext } from "../../../apps/site.ts";
import { clx } from "../../../sdk/clx.ts";
import { ComponentProps } from "../../../sections/Component.tsx";
import Icon from "../../ui/Icon.tsx";
import { ACTION, NAME } from "./Form.tsx";
import { type Resolved } from "@deco/deco";

export interface Props {
  loader: Resolved<Suggestion | null>;
}

export const action = async (props: Props, req: Request, ctx: AppContext) => {
  const { loader: { __resolveType, ...loaderProps } } = props;
  const form = await req.formData();

  const query = `${form.get(NAME ?? "q") ?? ""}`;

  // chama o loader SEM bloquear query vazia
  const suggestion = await ctx.invoke(__resolveType, {
    ...loaderProps,
    query,
  }) as Suggestion | null;

  return { suggestion };
};

export const loader = async (props: Props, req: Request, ctx: AppContext) => {
  const { loader: { __resolveType, ...loaderProps } } = props;

  const query = new URL(req.url).searchParams.get(NAME ?? "q") ?? "";

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
  const hasProducts = products.length > 0;
  const hasTerms = searches.length > 0;

  if (!hasProducts && !hasTerms) {
    return null;
  }

  return (
    <div class={clx("overflow-y-scroll lg:overflow-visible lg:max-w-[264px]")}>
      <div class="flex flex-col gap-vc-14 lg:bg-white">
        {hasTerms && (
          <>
            <span class="font-Manrope font-bold text-lg text-black-5 pt-5">
              Mais pesquisados
            </span>
            <ul class="flex flex-col gap-vc-10">
              {searches.map(({ term }, index) => (
                <li key={term}>
                  <a
                    href={`${ACTION}?${NAME}=${term}`}
                    class="flex gap-2 items-center"
                  >
                    <span class="font-Manrope font-medium text-sm text-black-5 opacity-50">
                      {index + 1}º
                    </span>
                    <span
                      class="font-Manrope font-medium text-sm text-black-5"
                      dangerouslySetInnerHTML={{ __html: term }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}

        {hasProducts && (
          <div class="">
            <ul class="flex flex-col gap-3">
              {products.map((product) => (
                <li key={product.productID} class="flex gap-4 items-center">
                  <a href={product.url} class="w-12 h-12 flex-shrink-0">
                    <img
                      src={product.image?.[0]?.url ?? ""}
                      alt={product.image?.[0]?.alternateName ?? product.name}
                      class="w-full h-full object-contain"
                    />
                  </a>

                  <div class="flex flex-col">
                    <a
                      href={product.url}
                      class="text-sm font-medium line-clamp-2 hover:underline"
                    >
                      {product.name}
                    </a>

                    {product.offers?.offers?.[0]?.price && (
                      <span class="text-sm font-semibold">
                        R$ {product.offers.offers[0].price
                          .toFixed(2)
                          .replace(".", ",")}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Suggestions;
