import type { SiteNavigationElement } from "apps/commerce/types.ts";

function NavItem({ item }: { item: SiteNavigationElement }) {
  const { url, name, children, identifier } = item as SiteNavigationElement & {
    identifier?: string;
  };

  const highlight = identifier === "highlight";

  return (
    <li class="relative group flex items-center lg:pr-0 pr-5" data-cy={`menu-${name}`}>
      <a
        href={url}
        class={`group-hover:underline text-sm font-medium lg:text-base ${
          highlight ? "bg-[#EF781C] text-white px-2 rounded" : ""
        }`}
      >
        {name}
      </a>

      {children && children.length > 0 && (
        <ul class="absolute left-[-45px] top-10 hidden group-hover:flex flex-col bg-base-100 shadow-lg border border-base-200 z-40 min-w-60 py-2 items-center before:content-[''] before:absolute before:top-[-40px] before:left-0 before:w-full before:h-10 pb-0">
          {children.map((node, idx) => (
            <li
              key={node.url}
              data-cy={`submenu-${idx + 1}`}
              class="py-1 hover:bg-base-200 lg:border-b lg:justify-center lg:flex lg:w-full lg:h-10 lg:items-center"
            >
              <a href={node.url} class="block text-sm font-semibold">
                {node.name}
              </a>

              {node.children && node.children.length > 0 && (
                <ul class="pl-4 mt-1 flex flex-col gap-1">
                  {node.children.map((leaf, subIdx) => (
                    <li key={leaf.url} data-cy={`subsubmenu-${subIdx + 1}`}>
                      <a href={leaf.url} class="block text-xs hover:underline">
                        {leaf.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default NavItem;
