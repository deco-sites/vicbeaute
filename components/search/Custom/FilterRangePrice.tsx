import { useEffect, useId, useRef, useCallback } from "preact/hooks";
import { RefObject } from "preact";
import { useSignal } from "@preact/signals";
import type { FilterRangeValue } from "apps/commerce/types.ts";
import Icon from "../../ui/Icon.tsx";

const thumbsize = 14;

export interface FilterRangeProps extends FilterRangeValue {
  currentUrlFilterPrice?: string;
  currentMaxFacet?: number;
  currentMinFacet?: number;
}

function applyFilterPrice({
  min,
  max,
  currentUrlFilterPrice,
}: FilterRangeProps & { currentUrlFilterPrice: string }) {
  const searchParams = new URLSearchParams(currentUrlFilterPrice);
  searchParams.set("filter.price", `${min.toFixed(2)}:${max.toFixed(2)}`);
  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
  globalThis.location.href = newUrl;
}

function FilterRange({
  min: minValue,
  max: maxValue,
  currentUrlFilterPrice = "",
  currentMinFacet,
  currentMaxFacet,
}: FilterRangeProps) {
  const id = useId();
  const urlBrowser = globalThis.location.search;
  const debounceTimer = useRef<number | null>(null);

  const slider: RefObject<HTMLDivElement> = useRef(null);
  const minInputRef: RefObject<HTMLInputElement> = useRef(null);
  const maxInputRef: RefObject<HTMLInputElement> = useRef(null);

  const rangeMinGlobal = minValue;
  const rangeMaxGlobal = maxValue;

  const rangemin = useSignal(
    urlBrowser?.includes("filter.price")
      ? (currentMinFacet ?? rangeMinGlobal)
      : rangeMinGlobal,
  );
  const rangemax = useSignal(
    urlBrowser?.includes("filter.price")
      ? (currentMaxFacet ?? rangeMaxGlobal)
      : rangeMaxGlobal,
  );

  const dataValue = useSignal({
    min: rangeMinGlobal,
    max: rangeMaxGlobal,
    rangewitdh: 0,
  });

  function draw(splitvalue: number) {
    if (
      minInputRef.current &&
      maxInputRef.current &&
      slider.current &&
      !!dataValue.value.rangewitdh
    ) {
      minInputRef.current.setAttribute("max", `${rangeMaxGlobal}`);
      maxInputRef.current.setAttribute("min", `${rangeMinGlobal}`);

      const range = rangeMaxGlobal - rangeMinGlobal;
      if (range > 0) {
        minInputRef.current.style.width = `${
          thumbsize +
          ((splitvalue - rangeMinGlobal) / range) *
            (dataValue.value.rangewitdh - 2 * thumbsize)
        }px`;
        maxInputRef.current.style.width = `${
          thumbsize +
          ((rangeMaxGlobal - splitvalue) / range) *
            (dataValue.value.rangewitdh - 2 * thumbsize)
        }px`;
      }

      minInputRef.current.style.left = "0px";
      maxInputRef.current.style.left = minInputRef.current.style.width;
      slider.current.style.height = `${minInputRef.current.offsetHeight}px`;

      rangemin.value = Number(minInputRef.current.value);
      rangemax.value = Number(maxInputRef.current.value);
    }
  }

  const debouncedApplyFilter = useCallback(
    (values: FilterRangeValue) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        const minFiltered = Math.max(values.min, rangeMinGlobal);
        const maxFiltered = Math.min(values.max, rangeMaxGlobal);
        applyFilterPrice({
          min: minFiltered,
          max: maxFiltered,
          currentUrlFilterPrice,
        });
      }, 500);
    },
    [currentUrlFilterPrice, rangeMinGlobal, rangeMaxGlobal],
  );

  function handleSliderInput(props: FilterRangeValue) {
    const minClamped = Math.max(props.min, rangeMinGlobal);
    const maxClamped = Math.min(props.max, rangeMaxGlobal);

    if (minClamped !== rangemin.value) rangemin.value = minClamped;
    if (maxClamped !== rangemax.value) rangemax.value = maxClamped;

    const avgvalue = (rangemin.value + rangemax.value) / 2;
    draw(avgvalue);

    debouncedApplyFilter({ min: rangemin.value, max: rangemax.value });
  }

  useEffect(() => {
    if (slider.current) {
      dataValue.value.rangewitdh = slider.current.offsetWidth;
      const avgvalueprimary = (rangemin.value + rangemax.value) / 2;
      draw(avgvalueprimary);
    }
  }, []);

  return (
    <div class="first:flex first:flex-col-reverse">
      <div ref={slider} class="relative w-full text-center inline-block h-8">
        <label for={`min-${id}`} class="hidden">
          Preço mínimo
        </label>
        <input
          ref={minInputRef}
          id={`min-${id}`}
          class="cursor-pointer absolute filter-range top-0 left-0 Cy-price-initSlider"
          type="range"
          step={0.1}
          min={rangeMinGlobal}
          max={rangeMaxGlobal}
          onInput={(ev) =>
            handleSliderInput({
              min: Math.min(Number(ev.currentTarget.value), rangemax.value),
              max: rangemax.value,
            })
          }
          value={rangemin.value}
        />

        <label for={`max-${id}`} class="hidden">
          Preço máximo
        </label>
        <input
          ref={maxInputRef}
          id={`max-${id}`}
          class="cursor-pointer absolute filter-range top-0 right-0 Cy-price-lastSlider max-w-full"
          type="range"
          step={0.1}
          min={rangeMinGlobal}
          max={rangeMaxGlobal}
          onInput={(ev) =>
            handleSliderInput({
              min: rangemin.value,
              max: Math.max(Number(ev.currentTarget.value), rangemin.value),
            })
          }
          value={rangemax.value}
        />
      </div>

      <div class="flex items-center gap-2 mt-2">
        <div class="relative">
          <span class="absolute left-2 top-1.5 text-[13px]">R$</span>
          <input
            data-cy="filtro-menor-preco"
            type="number"
            class="w-20 h-8 border border-black rounded text-[13px] pl-6"
            value={rangemin.value.toFixed(2)}
            onInput={(ev) => (rangemin.value = Number(ev.currentTarget.value))}
            placeholder="Mín."
            step={0.1}
          />
        </div>

        <div class="relative">
          <span class="absolute left-2 top-1.5 text-[13px]">R$</span>
          <input
            data-cy="filtro-maior-preco"
            type="number"
            class="w-20 h-8 border border-black rounded text-[13px] pl-6"
            value={rangemax.value.toFixed(2)}
            onInput={(ev) => (rangemax.value = Number(ev.currentTarget.value))}
            placeholder="Máx."
            step={0.1}
          />
        </div>

        <button
          type="button"
          class="flex items-center justify-center"
          onClick={() =>
            handleSliderInput({ min: rangemin.value, max: rangemax.value })
          }
        >
          <Icon id="lupa" width={32} height={32} />
        </button>
      </div>
    </div>
  );
}

export default FilterRange;
