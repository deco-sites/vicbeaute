import type { BreadcrumbList } from "apps/commerce/types.ts";
import { relative } from "../../sdk/url.ts";

interface Props {
  itemListElement: BreadcrumbList["itemListElement"];
}

function Breadcrumb({ itemListElement = [] }: Props) {
  const items = [
    { name: "Home", item: "/" },
    ...itemListElement.map((el) => {
      if (typeof el.item === "string") {
        return { name: el.name, item: el.item };
      }
      return { name: el.item?.name ?? el.name, item: el.item?.["@id"] };
    }),
  ].filter(({ name, item }) => name && item);

  const mobileItems =
    items.length > 3
      ? [items[0], items[items.length - 2], items[items.length - 1]]
      : items;

  return (
    <div class="breadcrumbs !pl-0 py-0 text-xs font-normal text-base-400 lg:pt-20">
      {/* Mobile */}
      <ul class="!flex lg:!hidden gap-1">
        {mobileItems.map(({ name, item }, index, arr) => {
          const isLast = index === arr.length - 1;
          return (
            <li class="gap-2" key={item}>
              {isLast
                ? <span class="font-semibold font-Hanken-Grotesk text-xs text-black-10">{name}</span>
                : <a class="text-xs font-Hanken-Grotesk text-gray-35 no-underline" href={relative(item)}>{name}</a>}
            </li>
          );
        })}
      </ul>

      {/* Desktop */}
      <ul class="!hidden lg:!flex gap-1">
        {items.map(({ name, item }, index, arr) => {
          const isLast = index === arr.length - 1;
          return (
            <li key={item}>
              {isLast
                ? <span class="font-Hanken-Grotesk font-semibold text-xs text-black-10">{name}</span>
                : <a class="font-Hanken-Grotesk text-xs text-gray-35 no-underline" href={relative(item)}>{name}</a>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Breadcrumb;
