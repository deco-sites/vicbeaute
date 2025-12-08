import { useState } from "preact/hooks";
import { type JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
const onClick = (delta: number) => {
  // doidera!
  event!.stopPropagation();
  const button = event!.currentTarget as HTMLButtonElement;
  const input = button.parentElement
    ?.querySelector<HTMLInputElement>('input[type="number"]')!;
  const min = Number(input.min) || -Infinity;
  const max = Number(input.max) || Infinity;
  input.value = `${Math.min(Math.max(input.valueAsNumber + delta, min), max)}`;
  input.dispatchEvent(new Event("change", { bubbles: true }));
};

function QuantitySelector(
  {
    id = useId(),
    disabled,
    min = 1,
    max = Infinity,
    value,
    defaultValue,
    onChange,
    ...props
  }: JSX.IntrinsicElements["input"] & {
    min?: number;
    max?: number;
  },
) {
  const initial =
  value !== undefined
    ? Number(value)
    : defaultValue !== undefined
    ? Number(defaultValue)
    : 1; 

  const [val, setVal] = useState(initial);

  const handleChange = (newVal: number) => {
    const clamped = Math.min(Math.max(newVal, Number(min)), Number(max));
    setVal(clamped);

    if (typeof onChange === "function") {
      const event = new Event("change", { bubbles: true }) as unknown as JSX.TargetedEvent<
        HTMLInputElement,
        Event
      >;
      Object.defineProperty(event, "target", { value: { value: String(clamped) } });
      onChange(event);
    }
  };

  return (
    <div
      data-cy="quantity-selector-pdp"
      class={clx(
        "flex items-center justify-between",
        "w-full max-w-[116px] lg:max-w-[278px] h-[40px]",
        "bg-[#F3F3F3] border border-gray-15 rounded-md quantity-box",
        "lg:bg-gray-15 lg:border-none lg:gap-[12px] lg:justify-center quantity-selector",
      )}
    >
      <button
        type="button"
        data-cy="decrease-quantity-pdp"
        class={clx(
          "w-[35px] h-full flex items-center justify-center",
          "text-3xl font-semibold text-gray-600 hover:text-black",
          "transition-colors duration-200",
          "disabled:opacity-40 minus-signal",
        )}
        onClick={() => {
          onClick(-1)
        }}
        disabled={disabled || val <= Number(min)}
      >
        –
      </button>

      <input
        aria-label="quantity-to-cart"
        id={id}
        class={clx(
          "text-center text-base lg:text-xl font-medium font-Inter",
          "w-full max-w-[30px] bg-transparent quantity-zero outline-none pointer-events-none",
        )}
        disabled={disabled}
        inputMode="numeric"
        type="number"
        min={1}
        max={max}
        value={val}
        onInput={(e) => handleChange(Number((e.currentTarget as HTMLInputElement).value))}
        {...props}
      />

      <button
        type="button"
        data-cy="increase-quantity-pdp"
        class={clx(
          "w-[35px] h-full flex items-center justify-center",
          "text-3xl font-semibold text-gray-600 hover:text-black",
          "transition-colors duration-200",
          "disabled:opacity-40 plus-signal",
        )}
        onClick={() => {
          onClick(1)
        }}
        disabled={disabled || val >= Number(max)}
      >
        +
      </button>
    </div>
  );
}

export default QuantitySelector;
