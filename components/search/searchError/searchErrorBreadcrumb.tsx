export interface Props {
  /**
   * @title Título da Brandcrumb
   * @description Insira o título que será exibido na Breadcrumb
   */
  titleBreadcrumb?: string;
}

const ErrorBreadcrumbs = ({ titleBreadcrumb }: Props) => {
  return (
    <div class="Cy-breadcrumbs-busca-vazia breadcrumbs max-w[1460px] mt-2 font-quicksand mx-auto px-8 full-desktop:mt-18 full-desktop:px-28 pt-[104px] pb-6 max-w-[1130px]">
      <ul>
        <li class="text-small text-gray-5">
          <a
            class="Cy-breadcrumbs-inicio-busca-vazia text-xs text-gray-35"
            href="/"
          >
            Início
          </a>
        </li>
        <li class="text-small text-gray-5 font-bold">
          <a
            class="Cy-breadcrumbs-page-busca-vazia text-xs font-semibold text-black-5"
            href="/"
          >
            {titleBreadcrumb ?? "Error 404"}
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ErrorBreadcrumbs;
