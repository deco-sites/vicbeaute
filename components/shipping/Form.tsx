import type { SKU } from "apps/vtex/utils/types.ts";
import { useId } from "../../sdk/useId.ts";
import { useComponent } from "../../sections/Component.tsx";
import Icon from "../ui/Icon.tsx";

export interface Props {
  items: SKU[];
}

export default function Form({ items }: Props) {
  const slot = useId();

  return (
    <div class="flex flex-col gap-[10px] mt-6 pt-6 border-t border-[#E5E5E5] w-full pb-[40px] sm:pb-[80px]">
      <div class="flex items-center gap-2">
        <Icon id="home_pin" width={22} height={22} class="text-black-20" />
        <span class="text-black-20 text-[18px] font-medium font-Hanken-Grotesk">
          Calcular o frete
        </span>
      </div>

      <form
        class="flex w-full sm:max-w-md join"
        hx-target={`#${slot}`}
        hx-swap="innerHTML"
        hx-sync="this:replace"
        hx-post={useComponent(import.meta.resolve("./Results.tsx"), {
          items,
        })}
      >
        <input
          as="input"
          type="text"
          class="input bg-[#ffffff] text-sm text-[#A3A3A3] rounded-none border border-[#E5E5E5] join-item w-full h-[45px] focus:outline-none"
          placeholder="Digite seu CEP"
          name="postalCode"
          maxLength={9}
          size={9}
        />
        <button type="submit" class="btn no-animation rounded-none bg-[#EBEBE2] border border-[#E5E5E5] border-l-0 text-black-20 font-medium px-6 hover:bg-[#DEDEDA] h-[45px] min-h-[45px] join-item">
          <span class="[.htmx-request_&]:hidden inline">Calcular</span>
          <span class="[.htmx-request_&]:inline hidden loading loading-spinner loading-xs" />
        </button>
      </form>

      <div class="">
        <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer" class="text-[11px] text-[#616B6B] underline font-Hanken-Grotesk">
          Não sei meu CEP
        </a>
      </div>

      {/* Results Slot */}
      <div id={slot} />
    </div>
  );
}
