import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import { ImageWidget } from "apps/admin/widgets.ts";

export interface AlertItem {
  /**
   * @title Frase em destaque
   */
  text: string;

  /**
   * @title Imagem da frase em destaque
   */
  imageSrc?: {
    src: ImageWidget;
    alt?: string;
  };
}

export interface Props {
  alerts?: AlertItem[];

  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
}

function Alert({ alerts = [], interval = 5 }: Props) {
  const id = useId();

  return (
    <div id={id}>
      <Slider class="carousel carousel-center w-screen gap-6 text-secondary-content text-sm/4 h-vc-38 bg-brown-5">
        {alerts.map((alert, index) => (
          <Slider.Item index={index} class="carousel-item w-screen">
            <div class="flex items-center gap-3 px-5 w-full justify-center">
              {alert.imageSrc && (
                <img
                  src={alert.imageSrc.src}
                  alt={alert.imageSrc.alt ?? ""}
                  class="w-6 h-6 object-contain flex-shrink-0"
                />
              )}

              <span class="text-center text-white-15 font-Manrope font-medium leading-none text-xs">
                {alert.text}
              </span>
            </div>
          </Slider.Item>
        ))}
      </Slider>

      <Slider.JS rootId={id} interval={interval && interval * 1e3} />
    </div>
  );
}

export default Alert;
