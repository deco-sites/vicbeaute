import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";

interface Props {
  total: number;
  target: number;
  locale: string;
  currency: string;
}

function FreeShippingProgressBar({ target, total, currency, locale }: Props) {
  const id = useId();
  const remaining = target - total;
  const percent = Math.floor((total / target) * 100);

  return (
    <div class="flex flex-col w-full gap-2">
      <div class="flex items-center gap-2 font-Inter text-sm text-[#363931]">
        {remaining > 0
          ? (
            <label for={id}>
              Faltam <b>{formatPrice(remaining, currency, locale)}</b> para conseguir frete grátis
            </label>
          )
          : <label for={id} class="font-bold">Você ganhou frete grátis!</label>}
      </div>
      <progress
        id={id}
        class="progress progress-primary w-full h-[3px]"
        value={percent}
        max={100}
      />
    </div>
  );
}

export default FreeShippingProgressBar;
