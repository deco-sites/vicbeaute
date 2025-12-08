import type { SiteNavigationElement } from "apps/commerce/types.ts";
import { NavbarHeader } from "./Navbar/NavbarHeader.tsx";

export interface Props {
  navItems?: SiteNavigationElement[];
}

function MenuItem({ item }: { item: SiteNavigationElement }) {
  const hasChildren = !!(item.children && item.children.length > 0);

  return (
    <div class={`collapse ${hasChildren ? "collapse-plus" : ""}`}>
      {hasChildren && <input type="checkbox" />}
      <div class="collapse-title">{item.name}</div>
      {hasChildren && (
        <div class="collapse-content">
          <ul data-cy="menu-mobile-list">
            {item.children?.map((node) => (
              <li>
                <MenuItem data-cy="menu-item-mobile" item={node} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Menu({ navItems = [] }: Props) {
  return (
    <div
      class="flex flex-col h-full overflow-y-auto"
      style={{ minWidth: "100vw" }}
    >
      <NavbarHeader />
      <ul id="accordion-items" class="px-6 flex-grow flex flex-col divide-y divide-base-200 overflow-y-auto pt-5">
        {navItems.map((item) => (
          <li>
            <MenuItem data-cy="menu-mobile-item-group" item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
