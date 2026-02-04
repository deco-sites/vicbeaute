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
    <div class="flex flex-col gap-y-3.5 bg-gray-9 w-full py-10 px-4 lg:h-[230px] bg-green-5">
      <div class="w-full max-w-[1130px] m-auto">
        <div class="flex flex-col max-w-vc-319 w-full lg:max-w-[unset] lg:mx-0 lg:w-auto items-center lg:items-start lg:text-start gap-2 lg:gap-0">
          {content?.title && (
            <h4 class="flex flex-row items-start gap-x-1 lg:text-2xl text-[28px] text-black-25 font-medium font-Queens leading-none text-vc-32 tracking-normal">
              {content?.title}
            </h4>
          )}
          
        </div>

        <div class="flex flex-col gap-4 mt-8">
          <form
            id="form-newsletter"
            class="flex flex-col gap-4 form-control relative"
            onSubmit={handleSubmit}
          >
            <div class="lg:grid justify-between gap-4 grid-cols-[37%_37%_23%] full-phone:grid-cols-1 lg:items-end flex flex-col">
              <div class="form-group relative">
                <input
                  name="name"
                  placeholder="Digite seu nome"
                  class="w-full h-vc-45 text-base-content outline-none placeholder:text-black-25 bg-transparent border-b border-black-35 placeholder:text-sm font-black-10 placeholder:font-Manrope placeholder:font-medium"
                  required
                />
              </div>

              <div class="form-group peer relative">
                <input
                  name="email"
                  placeholder="Digite seu e-mail"
                  class="w-full h-vc-45 text-base-content outline-none placeholder:text-black-25 bg-transparent border-b border-black-35 placeholder:text-sm font-black-10 placeholder:font-Manrope placeholder:font-medium"
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
                      class="font-Manrope text-xs leading-normal tracking-wider  cursor-pointer text-black-25 font-medium"
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
                class={`disabled:loading min-h-10 text-sm w-full bg-gray-25 text-white lg:max-w-vc-200 flex max-w-vc-169 h-vc-45 bg-green-20 text-white-5 justify-center items-center rounded-full font-Manrope font-bold mt-6 tracking-wider ${
                  content?.form?.buttonColor ?? "btn"
                }`}
                disabled={loading}
              >
                {content?.form?.buttonText || "JUNTE-SE A NÓS"}
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
