import type { InstitutionalMenuItem } from "../../components/Institutional/interface/interface.ts";
import InstitutionalMobileMenu from "../../islands/InstitutionalMobileMenu.tsx";
import Icon from "../ui/Icon.tsx";

export interface Props {
  /**
   * @title Título da Página
   */
  pageTitle?: string;
  /**
   * @title Menu Institucional
   */
  institutionalMenu?: InstitutionalMenuItem[];
  /**
   * @title Texto Institucional
   * @format rich-text
   * @default
   */
  institutionalText?: string;
}

const InstitutionalMain = (
  { pageTitle, institutionalMenu, institutionalText }: Props,
) => {
  return (
    <div class="bg-[#fff] w-full">
      <div class="max-w-[1340px] xl:mr-[350px] xl:ml-[250px] institutional-wrapper pt-5">
      
      <div class="flex items-start md:items-center justify-between md:justify-center flex-col pt-5">
        <div class="institutional-text flex justify-center md:items-center flex-col px-3 md:text-center">
          <h1 class="text-[#CE9680] w-full max-w-[351px] md:max-w-none h-fit text-[36px] leading-[36px] font-Queens mobile-text institutional-main-title">
            {pageTitle}
          </h1>
          
          {institutionalText && (
            <div
              class="w-full text-big mobile-text institutionalText md:max-w-none md:flex md:flex-col md:items-center"
              dangerouslySetInnerHTML={{ __html: institutionalText }}
            />
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default InstitutionalMain;
