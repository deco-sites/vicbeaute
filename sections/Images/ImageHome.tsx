import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";

export interface Item {
  desktopImage: ImageWidget;
  mobileImage: ImageWidget;
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

export interface Props {
  items: Item[];
  interval?: number;
}

export default function ImageHomeSlider({ items, interval }: Props) {
  const id = useId();

  return (
    <section id={id} className="w-full">
      <div className="relative">

        {/* SLIDER */}
        <Slider className="w-full">
          {items.map((item, index) => (
            <Slider.Item index={index} key={index} className="flex flex-col items-center">

              <a href={item.link} className="w-full flex justify-center">
                {/* Desktop */}
                <Image
                  src={item.desktopImage}
                  width={1130}
                  height={350}
                  className="hidden md:block max-w-vc-1130 h-[350px] object-cover"
                />

                {/* Mobile */}
                <Image
                  src={item.mobileImage}
                  width={351}
                  height={350}
                  className="block md:hidden w-full px-3"
                />
              </a>

              {/* TEXTO */}
              <div className="text-center mt-4 px-4">
                <h3 className="text-lg font-semibold">
                  {item.title}
                </h3>

                <p className="text-sm mt-2">
                  {item.description}
                </p>

                <a href={item.link}>
                  <button className="mt-4 px-6 py-2 border border-black text-sm hover:bg-black hover:text-white transition">
                    {item.buttonText}
                  </button>
                </a>
              </div>

            </Slider.Item>
          ))}
        </Slider>

        {/* CONTROLES */}
        <div className="flex justify-between items-center mt-4 px-4">
          <Slider.PrevButton className="cursor-pointer">
            ◀
          </Slider.PrevButton>

          <div className="flex gap-2">
            {items.map((_, index) => (
              <Slider.Dot index={index} />
            ))}
          </div>

          <Slider.NextButton className="cursor-pointer">
            ▶
          </Slider.NextButton>
        </div>
      </div>

      {/* SCRIPT */}
      <Slider.JS rootId={id} interval={interval} infinite />
    </section>
  );
}