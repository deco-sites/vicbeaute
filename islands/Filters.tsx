import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";
import Avatar from "../components/ui/Avatar.tsx";
import { clx } from "../sdk/clx.ts";
import FilterRange from "../islands/FilterRangePrice.tsx";
import { useState } from "preact/hooks";
import Icon from "../components/ui/Icon.tsx";

interface Props {
  filters: ProductListingPage["filters"];
  sortOptions?: ProductListingPage["sortOptions"];
  url: string;
}

const SORT_QUERY_PARAM = "sort";

const labels: Record<string, string> = {
  "relevance:desc": "Relevância",
  "price:desc": "Maior Preço",
  "price:asc": "Menor Preço",
  "orders:desc": "Mais vendidos",
  "name:desc": "Nome - de Z a A",
  "name:asc": "Nome - de A a Z",
  "release:desc": "Lançamento",
  "discount:desc": "Maior desconto",
};

const getUrl = (href: string, value: string) => {
  const url = new URL(href);
  url.searchParams.delete("page");
  url.searchParams.set(SORT_QUERY_PARAM, value);
  return url.href;
};

function uniq(a: any) {
  return a.sort().filter(function (item: any, pos: any, ary: any) {
    return !pos || item != ary[pos - 1];
  });
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

function ValueItem({ url, selected, label, quantity }: FilterToggleValue) {
  return (
    <a
      data-cy={label}
      href={url}
      rel="nofollow"
      class="flex items-center bg-white h-8 border border-white rounded"
    >
      <div class="w-[10px]"></div>
      <div class="flex items-center gap-[10px]">
        <div aria-checked={selected} class="checkbox w-5 h-5" />
        <span class="text-sm text-black-15">{label}</span>
        {quantity > 0 && <span class="text-sm text-base-400">({quantity})
        </span>}
      </div>
    </a>
  );
}

function FilterValues({ key, values, label }: FilterToggle) {
  const [expanded, setExpanded] = useState(false);

  const avatars = key === "tamanho" || key === "cor";
  const flexDirection = avatars ? "flex-row items-center" : "flex-col";

  if (key === "price") {
    let val: any = values.length;
    let x: any;
    let arr: any = [];
    let min: any;
    let max: any;

    for (let i = 0; i < val; i++) {
      x = values[i].value.split(":");

      for (let j = 0; j < x.length; j++) {
        arr.push(Number(x[j]));
      }
    }

    arr = uniq(arr);

    min = Math.min(...arr);
    max = Math.max(...arr);

    let url: any | undefined = values[0]?.url?.split("&filter.price")[0];
    let urlChanged: any | undefined = values[0]?.url?.split('&filter.price=')[1]
		let minMax: any | undefined = urlChanged?.split('%3A')

    return (
      <FilterRange
        min={min}
        max={max}
        currentUrlFilterPrice={url}
        currentMinFacet={Number(minMax[0])}
        currentMaxFacet={Number(minMax[1])}
      />
    );
  }

  const visibleValues = expanded ? values : values.slice(0, 4);

  return (
    <div class="flex flex-col gap-2">
      <ul class={clx("flex flex-wrap gap-[10px]", flexDirection)}>
        {visibleValues.map((item) => {
          if (avatars) {
            return (
              <a href={item.url} rel="nofollow">
                <Avatar
                  content={item.value}
                  variant={item.selected ? "active" : "default"}
                />
              </a>
            );
          }
          return <ValueItem {...item} />;
        })}
      </ul>

      {values.length > 4 && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          class="flex items-center bg-white h-8 border border-white rounded justify-center text-sm text-black-15"
        >
          {expanded ? "Ver menos" : "Ver mais"}
        </button>
      )}
    </div>
  );
}

function Filters({ filters, sortOptions, url }: Props) {
  const order = ["price", "sort", "brand", "category-2"];

  const sortFilter: FilterToggle | undefined = sortOptions?.length
    ? {
      "@type": "FilterToggle",
      key: "sort",
      label: "Ordenar por",
      quantity: 0,
      values: sortOptions
        .map(({ value, label }): FilterToggleValue => {
          const currentSort = new URL(url).searchParams.get(SORT_QUERY_PARAM) ??
            "";
          const href = getUrl(url, value);
          return {
            value,
            label: labels[label] ?? label,
            selected: value === currentSort,
            quantity: 0,
            url: href,
          };
        })
        .sort((a, b) => (b.selected ? 1 : 0) - (a.selected ? 1 : 0)),
    }
    : undefined;

  const allFilters = [
    ...filters.filter(isToggle),
    ...(sortFilter ? [sortFilter] : []),
  ]
    .filter((f) => order.includes(f.key))
    .sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));

  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});

  const toggleFilter = (key: string) => {
    setOpenFilters((prev) => ({
      ...prev,
      [key]: prev[key] !== undefined ? !prev[key] : false,
    }));
  };

  return (
    <ul class="flex flex-col gap-6 px-5 pb-5 pt-[10px] sm:px-5">
      {allFilters.map((filter) => {
        const isOpen = openFilters[filter.key] !== undefined
          ? openFilters[filter.key]
          : true;
        return (
          <li key={filter.key} class="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => toggleFilter(filter.key)}
              class="flex items-center justify-between"
            >
              <span class="font-semibold text-xl text-black-15">
                {filter.label}
              </span>
              <Icon
                id="arrowdown"
                width={17}
                height={10}
                class={clx(
                  "transition-transform duration-200",
                  isOpen ? "rotate-180" : "rotate-0",
                )}
                alt="abrir/fechar"
              />
            </button>

            {isOpen && <FilterValues {...filter} />}
          </li>
        );
      })}
    </ul>
  );
}

export default Filters;
