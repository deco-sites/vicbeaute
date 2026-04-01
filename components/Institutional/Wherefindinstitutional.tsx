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
  { institutionalMenu, institutionalText, secondInstitutionalText, dynamicImage, finalText, dynamicButton }: Props,
) => {
  const device = useDevice();

  const renderImageGroup = (imgGroup?: ImageGroup) => {
    if (!imgGroup) return null;
    let currentImage;
    if (device === "desktop") currentImage = imgGroup.desktop;
    else if (device === "tablet") currentImage = imgGroup.tablet;
    else currentImage = imgGroup.mobile;

    if (!currentImage?.image) return null;

    return (
      <a href={currentImage.href || "#"} class="block w-full h-full">
        <img
          alt={currentImage.alt}
          src={currentImage.image}
          width={currentImage.width}
          height={currentImage.height}
          class="w-full h-auto object-cover"
        />
      </a>
    );
  };

  return (
    <div class="bg-[#fff] w-full">
      <div class="max-w-[1340px] xl:mx-auto institutional-wrapper pt-5 flex flex-col items-center justify-center w-full px-[27px] pb-[120px]">
      <style dangerouslySetInnerHTML={{ __html: `
        .vic-inst-text,
        .vic-inst-text * {
          font-family: 'Queens', serif !important;
          text-align: center !important;
          display: block;
          margin-left: auto !important;
          margin-right: auto !important;
        }
      `}} />

      {institutionalText && (
        <div
          class="vic-inst-text text-[#363931] w-full max-w-[800px] mobile-text mt-8"
          dangerouslySetInnerHTML={{ __html: institutionalText }}
        />
      )}

      {secondInstitutionalText && (
        <div
          class="vic-inst-text text-[#CE9680] w-full max-w-[800px] h-fit mobile-text"
          dangerouslySetInnerHTML={{ __html: secondInstitutionalText }}
        />
      )}

      {/* Imagem Dinâmica Centralizada */}
      {dynamicImage && (
        <div class="w-full overflow-hidden mb-[8px]">
          {renderImageGroup(dynamicImage)}
        </div>
      )}

      {/* Texto Final (Preto, não centralizado) */}
      {finalText && (
        <div
          class="text-black w-full max-w-[800px] text-left font-Queens"
          dangerouslySetInnerHTML={{ __html: finalText }}
        />
      )}

      {/* Botão Dinâmico */}
      {dynamicButton && (
        <a
          href={dynamicButton.link}
          class="flex items-center justify-center text-[#fff] bg-[#5E6C5B] w-[251px] h-[42px] mt-[10px] rounded-md text-[12px]"
        >
          {dynamicButton.label}
        </a>
      )}
      </div>
    </div>
  );
};

export default Wherefindinstitutional;
