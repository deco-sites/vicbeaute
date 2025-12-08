import { useEffect, useState } from "preact/hooks";
import Icon from "../../ui/Icon.tsx";

function NotFoundSearch() {
  const [noBreadcrumbs, setNoBreadcrumbs] = useState(false);

  useEffect(() => {
    const hasBreadcrumb = document.querySelector(".Cy-breadcrumbs-busca-vazia");
    setNoBreadcrumbs(!hasBreadcrumb);
  }, []);

  return (
    <div
      class={`w-full flex justify-center items-center py-1 ${
        noBreadcrumbs ? "pt-[177px]" : ""
      }`}
    >
      <div class="flex flex-col items-center justify-center full-phone:mb-2">
        <span class="flex justify-center font-quicksand text-black text-bigger text-center mb-6 font-black text-5xl flex-col gap-5">
          ERROR <br /> 404 <br />{" "}
          <span class="flex justify-center font-quicksand text-black text-bigger text-center font-light text-base lg:hidden">
            Não encontramos essa página. <br /> Faça uma nova busca abaixo.
          </span>
        </span>
        <form
          action="/s"
          class="w-[306px] relative flex flex-col items-center gap-3"
        >
          <div class="relative w-full">
            <input
              type="text"
              placeholder="O que você está procurando?"
              name="q"
              class="Cy-input-main placeholder:p-3 placeholder:font-normal placeholder:text-sm placeholder:text-gray outline-0 w-full h-10 rounded-3xl border border-black pl-10"
            />
            <Icon
              id="lupa-busca-vazia"
              size={14}
              strokeWidth={1}
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray"
            />
          </div>

          <button
            type="submit"
            class="w-full max-w-[306px] h-10 bg-[#006EFF] text-white text-base rounded-3xl font-medium"
          >
            Procurar
          </button>
        </form>
        <div class="flex items-center justify-center gap-2 mt-6">
          <button
            type="button"
            class="flex items-center justify-center h-10 text-sm text-gray-5 mt-3 w-[148px] border rounded-3xl border-gray-5 font-light gap-3"
            onClick={() => history.back()}
          >
            <Icon id="arrow-back-search-error" width={15} height={13} />
            Voltar
          </button>
          <a
            href="/"
            class="flex items-center justify-center w-[148px] h-10 text-xs text-white border solid-black rounded-3xl mt-3 bg-gray-5"
          >
            Página inicial
          </a>
        </div>
      </div>
    </div>
  );
}

export default NotFoundSearch;
