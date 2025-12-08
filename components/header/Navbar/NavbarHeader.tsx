import { useUser } from "apps/vtex/hooks/useUser.ts";
import Icon from "../../../components/ui/Icon.tsx";
export const NavbarHeader = () => {
  const { user } = useUser();
  return (
    <div data-cy="navbar-header" class="navbar-header pt-5 lg:hidden w-full flex flex-col items-start">
      <span className="navbar-header-title text-2xl text-[#2d2d2c] mt-2.5 mb-3.5 px-5 block">
        Área do cliente
      </span>
      <div className="navbar-header-account px-5 w-full">
        <ul className="navbar-header-account-list flex gap-x-1.5 overflow-x-scroll items-center w-full pb-4">
          <li class="rounded-5 border border-[#FF7300] p-2.5 flex-none w-40">
            <a
              class="flex gap-x-2.5 items-center"
              href={`${user.value ? "/_secure/account#/profile" : "/login"}`}
            >
              <Icon id="profile" size={30} />

              {user?.value
                ? (
                  <span class="text-gray-5 text-[13px] leading-none overflow-hidden whitespace-nowrap text-ellipsis w-24">
                    Olá
                    <br /> {user.value.email}
                  </span>
                )
                : (
                  <span class="text-gray-5 text-[13px] leading-none">
                    Entrar <br /> ou cadastrar
                  </span>
                )}
            </a>
          </li>
          <li class="rounded-5 border border-[#FF7300] p-2.5 flex-none w-40">
            <a
              class="flex gap-x-2.5 items-center"
              href="/_secure/account#/orders"
            >
              <Icon id="orders" size={30} />
              <span class="text-[13px] leading-none text-gray-5">
                Meus <br /> pedidos
              </span>
            </a>
          </li>
          <li class="rounded-5 border border-[#FF7300] p-2.5 flex-none w-40">
            <a
              class="flex gap-x-2.5 items-center"
              href="/_secure/account#/orders"
            >
              <Icon id="wishlist" size={30} />
              <span class="text-[13px] leading-none text-gray-5">
                Favoritos
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};