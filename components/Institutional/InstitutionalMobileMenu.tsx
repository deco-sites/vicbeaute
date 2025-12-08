import type { InstitutionalMenuItem } from "../../components/Institutional/interface/interface.ts";
import { useSignal } from "@preact/signals";
import Icon from "../ui/Icon.tsx";

interface Props {
  institutionalMenu: InstitutionalMenuItem[] | undefined;
  pageTitle: string | undefined;
}

const InstitutionalMobileMenu = ({ institutionalMenu, pageTitle }: Props) => {
  const openList = useSignal(false);

  return (
    <div class= "w-full">
      <div class="xl:hidden w-full">
        <button
          class={`${
            openList.value ? "openButton" : "closedButton"
          } institutional-button hover:bg-gray-4 focus:bg-gray-4 h-[47px] flex items-center justify-between px-4 w-full rounded-sm bg-orange-10 text-[14px] text-white font-medium`}
          onClick={() => {
            openList.value = !openList.value;
          }}
        >
          {pageTitle}
          <Icon
            id="ArrowMenuInstitutional"
            width={25}
            height={24}
            stroke-width={1}
          />
        </button>
        <ul
          class={`${
            openList.value ? "open" : "closed"
          } transition-3s bg-gray-4 rounded-b-sm`}
        >
          {institutionalMenu?.map((item: any, index: number) => {
            return (
              <li
                key={index}
                class="py-4 bg-[#F0F0F0] border-b border-solid last:border-none"
              >
                <a
                  class="font-wix font-medium text-big text-[#7e7e7e] text-[14px] leading-10 py-1 pl-[30px] "
                  href={item?.menuLink}
                >
                  {item?.menuItem}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default InstitutionalMobileMenu;
