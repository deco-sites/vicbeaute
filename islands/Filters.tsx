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
      class="flex items-center group py-2"
    >
      <div class="flex items-center gap-[12px]">
        {/* Nova Checkbox UI conforme Print */}
        <div
          class={`w-5 h-5 flex flex-shrink-0 items-center justify-center rounded-[3px] border border-[#d4d4d4] transition-colors ${
            selected
              ? "bg-[#556B50] border-[#556B50]"
              : "bg-white group-hover:border-[#8a8a8a]"
          }`}
        >
          {selected && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          )}
        </div>
        <span
          class={`text-[15px] tracking-wide ${
            selected ? "text-[#191C1F] font-medium" : "text-[#4a4a4a]"
          }`}
        >
          {label}
        </span>
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
    let urlChanged: any | undefined = values[0]?.url?.split(
      "&filter.price=",
    )[1];
    let minMax: any | undefined = urlChanged?.split("%3A");

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
    <div class="flex flex-col gap-1 pb-4">
      <ul class={clx("flex flex-wrap flex-col", flexDirection)}>
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
  // Ignoramos price (Range customizado) e sort (dropdown na tela) no novo mockup
  const allFilters = filters
    .filter(isToggle)
    .filter((f) => f.key !== "price");

  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});

  const toggleFilter = (key: string) => {
    setOpenFilters((prev) => ({
      ...prev,
      [key]: prev[key] !== undefined ? !prev[key] : false,
    }));
  };

  return (
    <ul class="flex flex-col w-full">
      {allFilters.map((filter) => {
        const isOpen = openFilters[filter.key] !== undefined
          ? openFilters[filter.key]
          : false; // O print mostra itens recolhidos por padrão na maioria
        return (
          <li
            key={filter.key}
            class="flex flex-col border-b border-[#E1E1E1] last:border-none"
          >
            <button
              type="button"
              onClick={() => toggleFilter(filter.key)}
              class="flex items-center justify-between w-full py-[18px]"
            >
              <span class="font-medium text-[19px] text-[#191C1F] tracking-wide">
                {filter.label}
              </span>
              <span class="text-[#8a8a8a] text-[24px] font-light leading-none flex items-center justify-center w-6 h-6">
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {isOpen && <FilterValues {...filter} />}
          </li>
        );
      })}
    </ul>
  );
}

export default Filters;
