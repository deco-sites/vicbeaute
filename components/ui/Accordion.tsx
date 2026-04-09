import { type JSX } from "preact";
import Icon from "../../components/ui/Icon.tsx";

export interface Props {
  children: Child[];
}

interface Child {
  title: string;
  subtitle: string | JSX.Element;
}

export default function Accordion(props: Props) {
  const { children } = props;
  return (
    <>
      {children.map((c, index) => {
        return (
          <div
            key={index}
            className="collapse collapse-arrow border-b rounded-none group relative border-black-5/50"
          >
            <input type="checkbox" name="accordion-footer" className="peer" />
            <div className="collapse-title flex justify-between items-center font-Manrope text-black-5 w-full px-0 text-lg">
              {c.title}
            </div>
            <div className="collapse-content px-0 w-full">{c.subtitle}</div>
          </div>
        );
      })}
    </>
  );
}
