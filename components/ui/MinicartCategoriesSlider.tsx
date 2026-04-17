import type { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useScript } from "@deco/deco/hooks";

function Dot({ index, ...props }: {
  index: number;
} & JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      data-dot={index}
      aria-label={`go to slider item ${index}`}
      class={clx(
        "focus:outline-none group disabled:!bg-black disabled:!opacity-100 disabled:ring-2 disabled:ring-offset-2 bg-black-15 opacity-50 w-2 h-2 rounded-full transition-all duration-300 ring-custom",
        props.class?.toString(),
      )}
    />
  );
}

function MinicartCategoriesSlider(
  { class: _class, ...props }: JSX.IntrinsicElements["ul"],
) {
  return (
    <ul
      data-slider
      class={clx(
        "ll no-scrollbar flex snap-x snap-start scroll-x-mandatory overflow-x-scroll no-scrollbar",
        "gap-vc-6 xl:gap-[10px]",
        "lg:grid-cols-5 md:grid-cols-5",
        _class?.toString(),
      )}
      {...props}
    />
  );
}

function Item(
  { index, class: _class, ...props }: JSX.IntrinsicElements["li"] & {
    index: number;
  },
) {
  return (
    <li
      data-slider-item={index}
      class={clx(
        "flex-grow-0 lg:flex-shrink-0 flex-shrink-0 md:flex-shrink-[unset]",
        "snap-start",
        _class?.toString(),
      )}
      {...props}
    />
  );
}

function NextButton(props: JSX.IntrinsicElements["button"]) {
  return (
    <button
      data-slide="next"
      aria-label="Next item"
      {...props}
    />
  );
}

function PrevButton(props: JSX.IntrinsicElements["button"]) {
  return <button data-slide="prev" aria-label="Previous item" {...props} />;
}

export interface Props {
  rootId: string;
  scroll?: "smooth" | "auto";
  interval?: number;
  infinite?: boolean;
  /**
   * @description Show dots for navigation
   */
  dots?: boolean;
  /**
   * @description Show arrows for navigation
   */
  arrows?: boolean;
}

const onLoad = ({ rootId, scroll, interval, infinite }: Props) => {
  function init() {
    const THRESHOLD = 0.6;
    const intersectionX = (element: DOMRect, container: DOMRect): number => {
      const delta = container.width / 1000;
      if (element.right < container.left - delta) {
        return 0.0;
      }
      if (element.left > container.right + delta) {
        return 0.0;
      }
      if (element.left < container.left - delta) {
        return element.right - container.left + delta;
      }
      if (element.right > container.right + delta) {
        return container.right - element.left + delta;
      }
      return element.width;
    };
    const isHTMLElement = (x: Element): x is HTMLElement =>
      typeof (x as any).offsetLeft === "number";
    const root = document.getElementById(rootId);
    const slider = root?.querySelector<HTMLElement>("[data-slider]");
    const items = root?.querySelectorAll<HTMLElement>("[data-slider-item]");
    const prev = root?.querySelector<HTMLElement>('[data-slide="prev"]');
    const next = root?.querySelector<HTMLElement>('[data-slide="next"]');
    const dots = root?.querySelectorAll<HTMLElement>("[data-dot]");

    if (!root || !slider || !items || items.length === 0) {
      console.warn(
        "Missing necessary slider attributes. It will not work as intended. Necessary elements:",
        { root, slider, items, rootId },
      );
      return;
    }

    const getElementsInsideContainer = () => {
      const indices: number[] = [];
      const sliderRect = slider.getBoundingClientRect();
      for (let index = 0; index < items.length; index++) {
        const item = items.item(index);
        const rect = item.getBoundingClientRect();
        const ratio = intersectionX(rect, sliderRect) / rect.width;
        if (ratio > THRESHOLD) {
          indices.push(index);
        }
      }
      return indices;
    };

    const goToItem = (to: number) => {
      const item = items.item(to);
      if (!isHTMLElement(item)) {
        console.warn(
          `Element at index ${to} is not an html element. Skipping carousel`,
        );
        return;
      }
      slider.scrollTo({
        top: 0,
        behavior: scroll,
        left: item.offsetLeft - slider.offsetLeft,
      });
    };

    const onClickPrev = (e: Event) => {
      e.stopPropagation();
      const indices = getElementsInsideContainer();
      const itemsPerPage = indices.length;
      const isShowingFirst = indices[0] === 0;
      const pageIndex = Math.floor(indices[indices.length - 1] / itemsPerPage);
      goToItem(
        isShowingFirst ? items.length - 1 : (pageIndex - 1) * itemsPerPage,
      );
    };

    const onClickNext = (e: Event) => {
      e.stopPropagation();
      const indices = getElementsInsideContainer();
      const itemsPerPage = indices.length;
      const isShowingLast = indices[indices.length - 1] === items.length - 1;
      const pageIndex = Math.floor(indices[0] / itemsPerPage);
      goToItem(isShowingLast ? 0 : (pageIndex + 1) * itemsPerPage);
    };

    prev?.addEventListener("click", onClickPrev);
    next?.addEventListener("click", onClickNext);

    const observer = new IntersectionObserver(
      (elements) =>
        elements.forEach((e) => {
          const item = e.target.getAttribute("data-slider-item");
          const index = Number(item) || 0;
          const pageIndex = Math.floor(
            index / getElementsInsideContainer().length,
          );
          const dot = dots?.item(pageIndex);

          if (e.isIntersecting) {
            dot?.setAttribute("disabled", "");
          } else {
            dot?.removeAttribute("disabled");
          }
          if (!infinite) {
            if (index === 0) {
              if (e.isIntersecting) {
                prev?.setAttribute("disabled", "");
              } else {
                prev?.removeAttribute("disabled");
              }
            }
            if (index === items.length - 1) {
              if (e.isIntersecting) {
                next?.setAttribute("disabled", "");
              } else {
                next?.removeAttribute("disabled");
              }
            }
          }
        }),
      { threshold: THRESHOLD, root: slider },
    );

    items.forEach((item) => observer.observe(item));

    for (let it = 0; it < (dots?.length ?? 0); it++) {
      dots?.item(it).addEventListener("click", () => {
        const itemsPerPage = getElementsInsideContainer().length;
        goToItem(it * itemsPerPage);
      });
    }

    prev?.addEventListener("click", onClickPrev);
    next?.addEventListener("click", onClickNext);

    if (interval) {
      setInterval(onClickNext, interval);
    }
  }

  if (document.readyState === "complete") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
};

function JS({ rootId, scroll = "smooth", interval, infinite = false }: Props) {
  return (
    <script
      type="module"
      dangerouslySetInnerHTML={{
        __html: useScript(onLoad, { rootId, scroll, interval, infinite }),
      }}
    />
  );
}

MinicartCategoriesSlider.Dot = Dot;
MinicartCategoriesSlider.Item = Item;
MinicartCategoriesSlider.NextButton = NextButton;
MinicartCategoriesSlider.PrevButton = PrevButton;
MinicartCategoriesSlider.JS = JS;

export default MinicartCategoriesSlider;
