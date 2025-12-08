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
    if (!form?.contains(e.target as Node) && !slot?.contains(e.target as Node)) {
      if (slot) slot.innerHTML = "";
    }
  });

  input?.addEventListener("input", () => {
    if (input.value.trim() === "" && slot) {
      slot.innerHTML = "";
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
  { placeholder = "What are you looking for?", loader }: SearchbarProps,
) {
  const slot = useId();
  return (
    <div
      data-cy="searchbar"
      class="w-full grid lg:max-w-[240px] lg:relative lg:mx-auto"
      style={{ gridTemplateRows: "min-content auto" }}
    >
      <form
        id={SEARCHBAR_INPUT_FORM_ID}
        action={ACTION}
        class="join border-b border-[#CCCCCC] rounded-none lg:max-w-[240px] mx-5 lg:mx-[0px] lg:gap-3"
      >
        <button
          data-cy="submit-search"
          type="submit"
          class="btn join-item btn-square no-animation lg:hover:bg-transparent lg:border-none lg:max-w-[14px] bg-transparent"
          aria-label="Search"
          for={SEARCHBAR_INPUT_FORM_ID}
          tabIndex={-1}
        >
          <span class="loading loading-spinner loading-xs hidden [.htmx-request_&]:inline" />
          <Icon width={14} height={14} id="search" class="inline [.htmx-request_&]:hidden" />
        </button>
        <input
          tabIndex={0}
          class="input input-bordered join-item flex-grow border-none focus:outline-none focus:ring-0 focus:border-none lg:px-0"
          name={NAME}
          placeholder={placeholder}
          autocomplete="off"
          hx-target={`#${slot}`}
          hx-post={loader && useComponent<SuggestionProps>(Suggestions, {
            loader: asResolved(loader),
          })}
          hx-trigger="input changed delay:300ms"
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
        <label
          for="search-toggle"
          class="cursor-pointer flex items-center lg:hidden"
          aria-label="fechar busca"
        >
          <Icon id="close" width={20} height={20} />
        </label>
      </form>

      <div
        id={slot}
        class="lg:absolute lg:top-full lg:left-[-25px] lg:z-50 lg:bg-white lg:shadow-md lg:w-[295px]"
      />

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