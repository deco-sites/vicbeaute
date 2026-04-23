import type { InstitutionalMenuItem } from "../../components/Institutional/interface/interface.ts";
import { type ImageWidget } from "apps/admin/widgets.ts";
import { useDevice as useDevice } from "@deco/deco/hooks";

export interface ImageDeviceProps {
  image: ImageWidget;
  href?: string;
  alt: string;
  width: number;
  height: number;
}

export interface ImageGroup {
  mobile: ImageDeviceProps;
  tablet: ImageDeviceProps;
  desktop: ImageDeviceProps;
}

export interface ButtonProps {
  label: string;
  link: string;
}

export interface Props {
  /**
   * @title Menu Institucional
   */
  institutionalMenu?: InstitutionalMenuItem[];
  /**
   * @title Texto Institucional 1
   * @format rich-text
   * @default
   */
  institutionalText?: string;
  /**
   * @title Texto Institucional 2
   * @format rich-text
   * @default
   */
  secondInstitutionalText?: string;
  /**
   * @title Imagem Dinâmica
   */
  dynamicImage?: ImageGroup;
  /**
   * @title Texto Final Secundário
   * @format rich-text
   */
  finalText?: string;
  /**
   * @title Botão Dinâmico
   */
  dynamicButton?: ButtonProps;
}

const Wherefindinstitutional = (
  {
    institutionalMenu,
    institutionalText,
    secondInstitutionalText,
    dynamicImage,
    finalText,
    dynamicButton,
  }: Props,
) => {
  const device = useDevice();

  const renderImageGroup = (imgGroup?: ImageGroup) => {
    if (!imgGroup) return null;
    let currentImage;
    if (device === "desktop") currentImage = imgGroup.desktop;
    else if (device === "tablet") currentImage = imgGroup.tablet;
    else currentImage = imgGroup.mobile;

    if (!currentImage?.image) return null;

    const isDesktop = device === "desktop";

    return (
      <a
        href={currentImage.href || "#"}
        class={isDesktop ? "block" : "block w-full h-full"}
      >
        <img
          alt={currentImage.alt}
          src={currentImage.image}
          width={isDesktop ? 640 : currentImage.width}
          height={isDesktop ? 550 : currentImage.height}
          class={isDesktop ? "object-cover" : "w-full h-auto object-cover"}
          style={isDesktop
            ? { width: "640px", height: "550px", minWidth: "640px" }
            : {}}
        />
      </a>
    );
  };

  return (
    <div class="bg-[#fff] w-full">
      <div class="max-w-[1340px] xl:mx-auto institutional-wrapper pt-5 flex flex-col items-center justify-center w-full px-[27px] pb-[120px]">
        <style
          dangerouslySetInnerHTML={{
            __html: `
        .vic-inst-text,
        .vic-inst-text * {
          font-family: 'Queens', serif !important;
          display: block;
        }
        @media (max-width: 767px) {
          .vic-inst-text, .vic-inst-text * {
            text-align: center !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
        }
        @media (min-width: 768px) {
          .vic-inst-text, .vic-inst-text * {
            text-align: left !important;
            margin-left: 0 !important;
          }
        }
      `,
          }}
        />

        <div class="flex flex-col md:flex-row md:items-center md:justify-between w-full max-w-[1340px] gap-[40px] mt-8">
          {/* Left Column (Texts and Button) */}
          <div class="flex flex-col items-center md:items-start w-full md:w-1/2">
            {institutionalText && (
              <div
                class="vic-inst-text text-[#363931] w-full max-w-[800px] mobile-text"
                dangerouslySetInnerHTML={{ __html: institutionalText }}
              />
            )}

            {secondInstitutionalText && (
              <div
                class="vic-inst-text text-[#CE9680] w-full max-w-[800px] h-fit mobile-text"
                dangerouslySetInnerHTML={{ __html: secondInstitutionalText }}
              />
            )}

            {/* Texto Final */}
            {finalText && (
              <div
                class="text-black w-full max-w-[800px] text-left font-Queens md:text-left mt-4"
                dangerouslySetInnerHTML={{ __html: finalText }}
              />
            )}

            {/* Botão Dinâmico */}
            {dynamicButton && (
              <a
                href={dynamicButton.link}
                class="flex items-center justify-center text-[#fff] bg-[#5E6C5B] w-[251px] h-[42px] mt-[30px] rounded-md text-[12px]"
              >
                {dynamicButton.label}
              </a>
            )}
          </div>

          {/* Right Column (Image) */}
          {dynamicImage && (
            <div class="w-full md:w-1/2 overflow-hidden mb-[8px] md:mb-0 rounded-lg">
              {renderImageGroup(dynamicImage)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wherefindinstitutional;
