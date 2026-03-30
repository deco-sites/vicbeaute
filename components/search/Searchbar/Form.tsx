import { Suggestion } from "apps/commerce/types.ts";
import {
  SEARCHBAR_INPUT_FORM_ID,
  SEARCHBAR_POPUP_ID,
} from "../../../constants.ts";
import { useId } from "../../../sdk/useId.ts";
import { useComponent } from "../../../sections/Component.tsx";
import Icon from "../../ui/Icon.tsx";
import { Props as SuggestionProps } from "./Suggestions.tsx";
import { useScript } from "@deco/deco/hooks";
import { asResolved } from "@deco/deco";
import { type Resolved } from "@deco/deco";

export const ACTION = "/s";
export const NAME = "q";

export interface SearchbarProps {
  placeholder?: string;
  loader: Resolved<Suggestion | null>;
  /** @ignore */
  drawerShelf?: import("@deco/deco/blocks").Section;
}

const script = (
  formId: string,
  name: string,
  popupId: string,
  slotId: string,
) => {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const input = form?.elements.namedItem(name) as HTMLInputElement | null;
  const slot = document.getElementById(slotId);

  form?.addEventListener("submit", () => {
    const search_term = input?.value;
    if (search_term) {
      window.DECO.events.dispatch({
        name: "search",
        params: { search_term },
      });
    }
  });

  document.addEventListener("click", (e) => {
    if (
      !form?.contains(e.target as Node) && !slot?.contains(e.target as Node)
    ) {
      if (slot) slot.innerHTML = "";
    }
  });

  addEventListener("keydown", (e: KeyboardEvent) => {
    const isK = e.key === "k" || e.key === "K" || e.keyCode === 75;
    if (e.metaKey === true && isK) {
      const popup = document.getElementById(popupId) as HTMLInputElement | null;
      if (popup) {
        popup.checked = true;
        input?.focus();
      }
    }
  });
};

const Suggestions = import.meta.resolve("./Suggestions.tsx");

export default function Searchbar(
  { placeholder = "What are you looking for?", loader, drawerShelf }:
    SearchbarProps,
) {
  const slot = useId();
  return (
    <div
      data-cy="searchbar"
      class="w-full grid lg:relative lg:mx-auto pt-vc-10 px-3 lg:px-20"
      style={{ gridTemplateRows: "min-content auto" }}
    >
      <form
        id={SEARCHBAR_INPUT_FORM_ID}
        action={ACTION}
        class="join border border-[#CCCCCC] rounded-none lg:gap-3 h-vc-54"
      >
        <button
          data-cy="submit-search"
          type="submit"
          class="btn join-item btn-square no-animation lg:hover:bg-transparent lg:border-none lg:max-w-[14px] bg-transparent w-6 ml-vc-15"
          aria-label="Search"
          for={SEARCHBAR_INPUT_FORM_ID}
          tabIndex={-1}
        >
          <span class="loading loading-spinner loading-xs hidden [.htmx-request_&]:inline" />
          <Icon
            width={24}
            height={24}
            id="search-drawer"
            class="inline [.htmx-request_&]:hidden"
          />
        </button>
        <input
          tabIndex={0}
          class="input px-vc-10 input-bordered join-item flex-grow border-none focus:outline-none focus:ring-0 focus:border-none lg:px-0 placeholder:font-Manrope placeholder:font-medium placeholder:text-sm placeholder:text-black-5"
          name={NAME}
          placeholder={placeholder}
          autocomplete="off"
          hx-target={`#${slot}`}
          hx-post={loader && useComponent<SuggestionProps>(Suggestions, {
            loader: asResolved(loader),
          })}
          hx-trigger="input changed delay:300ms, focus, intersect"
          hx-indicator={`#${SEARCHBAR_INPUT_FORM_ID}`}
          hx-swap="innerHTML"
        />
        <label
          type="button"
          class="join-item btn btn-ghost btn-square hidden sm:inline-flex no-animation lg:hidden"
          for={SEARCHBAR_POPUP_ID}
          aria-label="Toggle searchbar"
        >
        </label>
      </form>

      <div class="flex flex-col lg:flex-row w-full flex-grow overflow-hidden lg:pt-10 pt-6">
        <div
          id={slot}
          class="flex-grow lg:flex-shrink-0 lg:flex-grow-0 lg:w-[350px] overflow-y-auto" // Suggestions renderiza com lg:max-w-[264px]
        />

        {drawerShelf && (
          <div class="hidden lg:block flex-grow overflow-y-auto lg:pl-10">
            <drawerShelf.Component {...drawerShelf.props} />
          </div>
        )}
      </div>

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            script,
            SEARCHBAR_INPUT_FORM_ID,
            NAME,
            SEARCHBAR_POPUP_ID,
            slot,
          ),
        }}
      />
    </div>
  );
}
