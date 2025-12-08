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
            className="collapse collapse-arrow border-b rounded-none group relative"
          >
            <input type="checkbox" name="accordion-footer" className="peer" />
            <div className="collapse-title text-sm font-regular flex justify-between items-center font-Poppins text-[#2C2C2C] w-full px-0">
              {c.title}
            </div>
            <div className="collapse-content px-0 w-full">{c.subtitle}</div>
          </div>
        );
      })}
    </>
  );
}
