import { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";

export interface Props {
  /** @description Section title */
  title?: string;

  /** @description See all link */
  cta?: string;
}

function Header({ title, cta }: Props) {
  if (!title) {
    return null;
  }

  return (
    <div
      class={clx(
        "flex items-center gap-2 px-5 lg:px-0",
        title === "Mais vendidos"
          ? "justify-center lg:justify-start pt-6 lg:pt-0"
          : title === "Preferidos da semana"
          ? "justify-center lg:justify-center pt-0"
          : title === "Mais amados"
          ? "justify-center lg:justify-center pt-6 lg:pt-0"
          : "justify-between lg:justify-center pt-6 lg:pt-0",
      )}
    >
      <h2 class="font-Queens text-2xl text-[32px] text-[#CE9680] xl:text-[36px] title-minicart">
        {title}
      </h2>
    </div>
  );
}

interface Tab {
  title: string;
}

function Tabbed(
  { children }: {
    children: JSX.Element;
  },
) {
  return (
    <>
      {children}
    </>
  );
}

function Container({ class: _class, ...props }: JSX.IntrinsicElements["div"]) {
  return (
    <div
      {...props}
      class={clx(
        "lg:max-w-[1280px] xl:px-[30px] xl2:px-0 mx-auto w-full",
        _class?.toString(),
      )}
    />
  );
}

function Placeholder(
  { height, class: _class }: { height: string; class?: string },
) {
  return (
    <div
      style={{
        height,
        containIntrinsicSize: height,
        contentVisibility: "auto",
      }}
      class={clx("flex justify-center items-center", _class)}
    >
      <span class="loading loading-spinner" />
    </div>
  );
}

function Section() {}

Section.Container = Container;
Section.Header = Header;
Section.Tabbed = Tabbed;
Section.Placeholder = Placeholder;

export default Section;
