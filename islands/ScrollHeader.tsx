import { useEffect } from "preact/compat";

const ScrollHeader = () => {
  useEffect(() => {
    globalThis.addEventListener("scroll", () => {
      const scroll = globalThis.scrollY;
      // HEADER
      const desktopHeader = document.querySelector(
        ".floating-desktop-header-container",
      ) as HTMLElement;
      const mobileHeader = document.querySelector(
        ".floating-mobile-header-container",
      ) as HTMLElement;
      // TOPBAR
      const desktopTopBar = document.querySelector(
        ".floating-desktop-topbar-container",
      ) as HTMLElement;
      const mobileTopBar = document.querySelector(
        ".floating-mobile-topbar-container",
      ) as HTMLElement;

      if (scroll > 168) {
        desktopHeader?.classList?.add("opacity-100", "overcontent");
        mobileHeader?.classList?.add("opacity-100", "overcontent");
        desktopTopBar?.classList?.add("opacity-100", "overcontent");
        mobileTopBar?.classList?.add("opacity-100", "overcontent");

        desktopHeader?.classList?.remove("opacity-0", "-z-10");
        mobileHeader?.classList?.remove("opacity-0", "-z-10");
        desktopTopBar?.classList?.remove("opacity-0", "-z-10");
        mobileTopBar?.classList?.remove("opacity-0", "-z-10");
      } else {
        desktopHeader?.classList?.add("opacity-0", "-z-10");
        mobileHeader?.classList?.add("opacity-0", "-z-10");
        desktopTopBar?.classList?.add("opacity-0", "-z-10");
        mobileTopBar?.classList?.add("opacity-0", "-z-10");

        desktopHeader?.classList?.remove("opacity-100", "overcontent");
        mobileHeader?.classList?.remove("opacity-100", "overcontent");
        desktopTopBar?.classList?.remove("opacity-100", "overcontent");
        mobileTopBar?.classList?.remove("opacity-100", "overcontent");
      }
    });
  }, []);

  return null;
};

export default ScrollHeader;
