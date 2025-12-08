import { invoke } from "../runtime.ts";
import { useSignal } from "@preact/signals";

export interface Form {
  placeholder?: string;
  buttonText?: string;
  buttonColor?: "bg-blue-0 text-white-0" | "bg-gold-0 text-white-0";
  /** @format html */
  helpText?: string;
}
export interface Props {
  content: {
    title?: string;
    /** @format textarea */
    description?: string;
    form?: Form;
  };
  layout?: {
    tiled?: boolean;
  };
  device: "mobile";
}

function Newsletter({ content = {}, device }: Props) {
  const loading = useSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      loading.value = true;
      const form = e.currentTarget as HTMLFormElement | null;
      const name = form?.elements.namedItem("name")
        ? (form.elements.namedItem("name") as RadioNodeList).value
        : "";
      const email = form?.elements.namedItem("email")
        ? (form.elements.namedItem("email") as RadioNodeList).value
        : "";
      const terms = form?.elements.namedItem("terms")
        ? (form.elements.namedItem("terms") as HTMLInputElement).checked
        : false;

      await invoke.site.actions.newsletter.submit({
        data: {
          nome: name,
          email: email,
          aceite: terms,
        },
        acronym: "NL",
      });
    } finally {
      (document.getElementById("form-newsletter") as HTMLFormElement).reset();
      setTimeout(() => {
        loading.value = false;
      }, 2500);
    }
  };

  return (
    <div class="flex flex-col gap-y-3.5 bg-gray-9 w-full py-8 px-4 bg-gray-15 lg:h-[230px]">
      <div class="w-full max-w-[1130px] m-auto">
        <div class="flex flex-col max-w-ft-337 w-full mx-auto lg:max-w-[unset] lg:mx-0 lg:w-auto items-center lg:items-start text-center lg:text-start gap-2 lg:gap-0">
          {content?.title && (
            <h4 class="flex flex-row items-center gap-x-1 lg:text-2xl text-[28px] text-gray-0 font-medium font-Poppins ">
              {content?.title}
            </h4>
          )}
          {content?.description && (
            <div class="text-gray-20 lg:text-sm font-normal font-Poppins text-center lg:text-start text-lg">
              {content?.description}
            </div>
          )}
        </div>

        <div class="flex flex-col gap-4 mt-3">
          <form
            id="form-newsletter"
            class="flex flex-col gap-4 form-control relative"
            onSubmit={handleSubmit}
          >
            <div class="lg:grid justify-between gap-4 grid-cols-[37%_37%_23%] full-phone:grid-cols-1 lg:items-end flex flex-col">
              <div class="form-group relative">
                <label class="font-Poppins text-xs text-black-10 absolute top-[-8px] left-3 bg-gray-15 w-[115px] justify-center flex">
                  {content?.form?.placeholder || "Digite seu nome"}
                </label>
                <input
                  name="name"
                  placeholder="Ex: Maria Silveira"
                  class="w-full h-[38px] text-base-content outline-none px-3 placeholder:text-gray-20 bg-transparent border border-black-10 border-opacity-50 placeholder:text-xs font-black-10 placeholder:font-Poppins"
                  required
                />
              </div>

              <div class="form-group peer relative">
                <label class="font-Poppins text-xs text-black-10 absolute top-[-8px] left-3 bg-gray-15 w-[115px] justify-center flex">
                  {content?.form?.placeholder || "Digite seu e-mail"}
                </label>
                <input
                  name="email"
                  placeholder="Ex: maria@mail.com"
                  class="w-full h-[38px] text-base-content outline-none px-3 placeholder:text-gray-20 bg-transparent border border-black-10 border-opacity-50 placeholder:text-xs font-black-10 placeholder:font-Poppins"
                  type="email"
                  required
                />

                {content?.form?.helpText && device === "mobile" && (
                  <div class="checkbox-newsletter flex flex-row lg:hidden items-center gap-2 mt-2">
                    <label class="relative flex items-center cursor-pointer">
                      <input
                        class="aceite"
                        type="checkbox"
                        id="aceite-mobile"
                        name="terms"
                      />
                      <span class="check-aceite"></span>
                    </label>
                    <label
                      for="aceite-mobile"
                      class="text-sm cursor-pointer"
                      dangerouslySetInnerHTML={{
                        __html: content?.form?.helpText,
                      }}
                    />
                  </div>
                )}
              </div>

              {content?.form?.helpText && (
                <div class="hidden checkbox-newsletter flex-row items-center gap-2">
                  <label class="relative flex items-center cursor-pointer">
                    <input
                      class="aceite"
                      type="checkbox"
                      id="aceite"
                      name="terms"
                      required
                    />
                    <span class="check-aceite"></span>
                  </label>
                  <label
                    for="aceite"
                    class="text-sm cursor-pointer"
                    dangerouslySetInnerHTML={{ __html: content?.form?.helpText }}
                  />
                </div>
              )}

              <button
                type="submit"
                class={`disabled:loading h-10 min-h-10 font-normal text-xs rounded w-full bg-gray-25 text-white font-Poppins lg:max-w-ft-200 ${
                  content?.form?.buttonColor ?? "btn"
                }`}
                disabled={loading}
              >
                {content?.form?.buttonText || "Cadastrar"}
              </button>
            </div>

            {content?.form?.helpText && (
              <div class="hidden lg:flex checkbox-newsletter flex-row items-center gap-2">
                <label class="relative flex items-center cursor-pointer">
                  <input
                    class="aceite"
                    type="checkbox"
                    id="aceite-lg"
                    name="terms"
                    required
                  />
                  <span class="check-aceite"></span>
                </label>
                <label
                  for="aceite-lg"
                  class="text-sm cursor-pointer"
                  dangerouslySetInnerHTML={{ __html: content?.form?.helpText }}
                />
              </div>
            )}

            <div
              class={`${
                loading.value ? "flex" : "hidden"
              } message-success items-center justify-center bg-gray-9 font-semibold text-green-0 text-2xl absolute left-0 -top-1.5 right-0 h-full w-full`}
            >
              Cadastrado com sucesso!
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Newsletter;
