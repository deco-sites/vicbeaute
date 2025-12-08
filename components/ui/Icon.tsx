import { asset } from "$fresh/runtime.ts";
import type { JSX } from "preact";

export type AvailableIcons =
  | "search"
  | "shopping_bag"
  | "menu"
  | "account_circle"
  | "close"
  | "chevron-right"
  | "favorite"
  | "home_pin"
  | "call"
  | "local_shipping"
  | "pan_zoom"
  | "share"
  | "sell"
  | "check-circle"
  | "error"
  | "trash"
  | "wishlist"
  | "profile"
  | "orders"
  | "search"
  | "menu_mobile"
  | "minicart"
  | "search_desk"
  | "trashnew"
  | "closeminicartbutton"
  | "arrow_footer"
  | "add_to_cart"
  | "arrow-left-shelf"
  | "arrow-right-shelf"
  | "left-arrow-carousel"
  | "right-arrow-carousel"
  | "right-arrow-category"
  | "right-arrow-category"
  | "arrowup"
  | "arrowdown"
  | "ArrowMenuInstitutional"
  | "lupa-busca-vazia"
  | "lupa"
  | "arrow-back-search-error"
  | "user";
interface Props extends JSX.SVGAttributes<SVGSVGElement> {
  /**
   * Symbol id from element to render. Take a look at `/static/icons.svg`.
   *
   * Example: <Icon id="search" />
   */
  id: AvailableIcons;
  size?: number;
}

function Icon(
  { id, size = 24, width, height, ...otherProps }: Props,
) {
  return (
    <svg
      {...otherProps}
      width={width ?? size}
      height={height ?? size}
    >
      <use href={asset(`/sprites.svg#${id}`)} />
    </svg>
  );
}

export default Icon;
