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
    <div class="max-w-[1340px] xl:mr-[350px] xl:ml-[250px] institutional-wrapper mt-5 max-lg-laptop:px-8 max-[1199px]:px-4">
      <div class="breadcrumbs">
        <ul class="flex gap-2.5">
          <li class="last:text-black-2 font-wix text-gray-1 last:font-semibold">
            <a href="/">Home</a>
          </li>
          <li class="last:text-black-2 font-wix text-gray-1 last:font-semibold gap-3">
            {pageTitle}
          </li>
        </ul>
      </div>
      <div class="flex items-start justify-between flex-col lg:flex-row pt-5 pb-10">
        <div class="institutional-menu w-full lg:w-[unset] mb-4 lg:mb-0 xl:pr-[100px]">
          <div class="gap-3 flex-col hidden lg:flex bg-[#F2F2F2]">
            <div className= "justify-center w-full flex bg-orange-10 rounded max-w-[300px] h-[45px] items-center">
              <span className="text-center size-lg text-white w-full font-medium">
                Institucional
              </span>
            </div>
            {institutionalMenu?.map((item: any, index: number) => {
              return (
                <a
                  href={item?.menuLink}
                  key={index}
                  class={`${
                    pageTitle === item?.menuItem ? "bg-orange-15" : ""
                  } min-w-[250px] py-2 flex justify-left items-center pl-7 bg-[#F2F2F2]`}
                >
                  <span
                    class={`text-bigger font-wix`}
                  >
                    {item?.menuItem}
                  </span>
                </a>
              );
            })}
          </div>
          <InstitutionalMobileMenu
            institutionalMenu={institutionalMenu}
            pageTitle={pageTitle}
          />
        </div>
        <div class="institutional-text flex justify-center flex-col items-center">
          {institutionalText && (
            <div
              class="w-full text-big mobile-text institutionalText"
              dangerouslySetInnerHTML={{ __html: institutionalText }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutionalMain;
