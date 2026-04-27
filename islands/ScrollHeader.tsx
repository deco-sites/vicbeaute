import { useScript } from "@deco/deco/hooks";

const setupScrollHeader = () => {
  const handleScroll = () => {
    const scroll = globalThis.scrollY || document.documentElement.scrollTop;
    const desktopHeaders = document.querySelectorAll(".floating-desktop-header-container");
    const mobileHeaders = document.querySelectorAll(".floating-mobile-header-container");
    const desktopTopBars = document.querySelectorAll(".floating-desktop-topbar-container");
    const mobileTopBars = document.querySelectorAll(".floating-mobile-topbar-container");

    const applyClasses = (elements: NodeListOf<Element>, add: boolean) => {
      elements.forEach((el) => {
        if (add) {
          el.classList.add("opacity-100", "overcontent");
          el.classList.remove("opacity-0", "-z-10");
        } else {
          el.classList.add("opacity-0", "-z-10");
          el.classList.remove("opacity-100", "overcontent");
        }
      });
    };

    if (scroll > 168) {
      applyClasses(desktopHeaders, true);
      applyClasses(mobileHeaders, true);
      applyClasses(desktopTopBars, true);
      applyClasses(mobileTopBars, true);
    } else {
      applyClasses(desktopHeaders, false);
      applyClasses(mobileHeaders, false);
      applyClasses(desktopTopBars, false);
      applyClasses(mobileTopBars, false);
    }
  };

  globalThis.addEventListener("scroll", handleScroll, { passive: true });
  // Call once on mount in case the page is already scrolled (e.g. refresh)
  handleScroll();
};

const ScrollHeader = () => {
  return (
    <script
      type="module"
      dangerouslySetInnerHTML={{ __html: useScript(setupScrollHeader) }}
    />
  );
};

export default ScrollHeader;
