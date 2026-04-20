import type { Product } from "apps/commerce/types.ts";
import { AppContext } from "../../apps/site.ts";
import { useComponent } from "../../sections/Component.tsx";

export interface Props {
  productID: Product["productID"];
}

export const action = async (props: Props, req: Request, ctx: AppContext) => {
  const form = await req.formData();

  const name = `${form.get("name") ?? ""}`;
  const email = `${form.get("email") ?? ""}`;

  // deno-lint-ignore no-explicit-any
  await (ctx as any).invoke("vtex/actions/notifyme.ts", {
    skuId: props.productID,
    name,
    email,
  });

  return props;
};

export default function Notify({ productID }: Props) {
  return (
    <form
      class="form-control justify-start gap-[10px] w-full bg-green-15 p-5 rounded-[4px]"
      hx-sync="this:replace"
      hx-indicator="this"
      hx-swap="none"
      hx-post={useComponent<Props>(import.meta.url, { productID })}
    >
      <div class="flex flex-col gap-[10px]">
        <span class="text-[32px] text-black-10 font-Queens">
          Esgotado
        </span>
        <span class="text-sm sm:text-[16px] text-[#4D5D49] font-Hanken-Grotesk">
          Preencha os campos abaixo com os seus dados e te avisaremos assim que
          o produto estiver disponível.
        </span>
      </div>

      <div class="flex flex-col gap-6 mt-2">
        <input
          placeholder="Nome"
          class="w-full bg-transparent border-b border-black-10 pb-1.5 outline-none font-Hanken-Grotesk text-black-10 placeholder:text-black-10 focus:border-black-10 text-[15px] sm:text-[16px]"
          name="name"
        />
        <input
          placeholder="Digite seu e-mail"
          class="w-full bg-transparent border-b border-black-10 pb-1.5 outline-none font-Hanken-Grotesk text-black-10 placeholder:text-black-10 focus:border-black-10 text-[15px] sm:text-[16px]"
          name="email"
        />
      </div>

      <div class="flex flex-row gap-5 mt-1 relative mr-[49px]">
        <button class="rounded-[4px] bg-green-10 flex flex-1 sm:flex-none items-center justify-center font-medium font-Hanken-Grotesk text-sm text-white-15 group">
          <span class="[.htmx-request_&]:hidden inline px-5 py-[10px]">
            Avise-me
          </span>
          <span class="[.htmx-request_&]:inline hidden loading loading-spinner loading-sm" />
        </button>
        <button
          type="button"
          class="px-5 py-[10px] rounded-[4px] bg-transparent border border-green-10 flex flex-1 sm:flex-none items-center justify-center font-medium font-Hanken-Grotesk text-sm text-green-10"
        >
          Ver similares
        </button>
      </div>

      <div class="mt-1">
        <span class="text-black-10 leading-[1.3] block font-Manrope font-medium text-xs">
          Ao se inscrever você aceita a{" "}
          <a href="/politicas" class="underline">
            Política de <br /> Privacidade
          </a>{" "}
          e <a href="/termos-de-uso" class="underline">Termos de Uso</a>.
        </span>
      </div>
    </form>
  );
}
