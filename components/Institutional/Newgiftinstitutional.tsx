import { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import { useDevice } from "@deco/deco/hooks";

export interface Props {
  /** @title Banner */
  banner: {
    mobile: {
      image: ImageWidget;
      alt: string;
      width: number;
      height: number;
    };
    tablet: {
      image: ImageWidget;
      alt: string;
      width: number;
      height: number;
    };
    desktop: {
      image: ImageWidget;
      alt: string;
      width: number;
      height: number;
    };
  };
  /** @title Título Principal */
  topPlainText?: HTMLWidget;
  /** @title Subtítulo */
  plainText?: HTMLWidget;
  /** @title Título 1 */
  htmlText1?: HTMLWidget;
  /** @title Campo de Texto 1 */
  plainText2?: HTMLWidget;
  /** @title Título 2 */
  htmlText2?: HTMLWidget;
  /** @title Campo de Texto 2 */
  plainText3?: HTMLWidget;
  /** @title Título 3 */
  htmlText3?: HTMLWidget;
  /** @title Campo de Texto 3 */
  plainText4?: HTMLWidget;
  /** @title Botão Ganhar Brinde 1 */
  button?: {
    label?: string;
    link?: string;
  };
  /** @title Botão Ganhar Brinde 2 */
  button2?: {
    label?: string;
    link?: string;
  };
  /** @title Título Principal Secundário */
  bottomTitle?: HTMLWidget;
  /** @title Subtítulo Secundário */
  bottomSubtitle?: HTMLWidget;
  /** @title Informativo de Brinde 1 */
  gift1?: {
    logo?: ImageWidget;
    text?: HTMLWidget;
  };
  /** @title Informativo de Brinde 2 */
  gift2?: {
    logo?: ImageWidget;
    text?: HTMLWidget;
  };
  /** @title Informativo de Brinde 3 */
  gift3?: {
    logo?: ImageWidget;
    text?: HTMLWidget;
  };
  /** @title Informativo de Brinde 4 */
  gift4?: {
    logo?: ImageWidget;
    text?: HTMLWidget;
  };
  /** @title Imagem Carrousel 1 */
  image1?: {
    image: ImageWidget;
    alt: string;
  };
  /** @title Imagem Carrousel 2 */
  image2?: {
    image: ImageWidget;
    alt: string;
  };
  /** @title Imagem Carrousel 3 (Desktop) */
  image3?: {
    image: ImageWidget;
    alt: string;
  };
}

export default function Newgiftinstitutional({
  banner,
  topPlainText,
  plainText,
  htmlText1,
  plainText2,
  htmlText2,
  plainText3,
  htmlText3,
  plainText4,
  button,
  bottomTitle,
  bottomSubtitle,
  gift1,
  gift2,
  gift3,
  gift4,
  image1,
  image2,
  image3,
  button2,
}: Props) {
  const device = useDevice();
  const btnLabel = button?.label || "QUERO GANHAR";
  const btnLink = button?.link || "#";
  const btnLabel2 = button2?.label || "QUERO GANHAR";
  const btnLink2 = button2?.link || "#";

  if (device === "desktop") {
    return (
      <section class="flex flex-col items-center justify-center w-full mt-[40px] pb-[30px] overflow-hidden bg-[#F1F1F1]">
        {/* Banner */}
        <div class="w-full flex justify-center mb-[40px]">
          {banner?.desktop?.image && (
            <img
              alt={banner.desktop.alt}
              src={banner.desktop.image}
              width={banner.desktop.width}
              height={banner.desktop.height}
              class="w-full"
            />
          )}
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          .queens-text, .queens-text * { font-family: "Queens", serif !important; }
          .font-Hanken-Grotesk, .font-Hanken-Grotesk * { font-family: "Hanken Grotesk", sans-serif !important; }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `,
          }}
        />

        {/* Título e Subtítulo — centralizados */}
        <div class="flex flex-col items-center w-full text-center mb-[30px] px-[80px]">
          {topPlainText && (
            <div
              class="font-Hanken-Grotesk text-[#363931] w-full text-center"
              dangerouslySetInnerHTML={{ __html: topPlainText }}
            />
          )}
          {plainText && (
            <div
              class="queens-text text-[32px] text-[#CE9680] leading-[32px] mb-[30px] text-center"
              dangerouslySetInnerHTML={{ __html: plainText }}
            />
          )}
        </div>

        {/* 3 Cards título+texto — 420x126 */}
        <div class="flex flex-row items-start justify-center gap-[10px] w-full px-[80px] mb-[30px]">
          {[[htmlText1, plainText2], [htmlText2, plainText3], [
            htmlText3,
            plainText4,
          ]].map(([title, text], idx) => (
            <div
              key={idx}
              class="flex flex-col justify-start bg-white px-[16px] py-[14px] rounded-lg"
              style={{
                width: "420px",
                minHeight: "126px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
              }}
            >
              {title && (
                <div
                  class="queens-text text-[20px] text-[#4D5D49] leading-[24px] mb-[8px]"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              )}
              {text && (
                <div
                  class="font-Hanken-Grotesk text-[#363931] text-[14px]"
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Botão 1 — centralizado */}
        <a
          href={btnLink}
          class="mb-[40px] bg-[#353930] text-[#D5D8C2] flex items-center justify-center text-center font-Hanken-Grotesk transition-opacity hover:opacity-80 rounded-md"
          style={{ width: "351px", height: "45px", fontSize: "16px" }}
        >
          {btnLabel}
        </a>

        {/* 3 Imagens lado a lado — 420x420 com gap 10px e 80px lateral */}
        <div class="flex flex-row items-start gap-[10px] px-[80px] mb-[40px]">
          {[image1, image2, image3].map((img, idx) =>
            img?.image
              ? (
                <img
                  key={idx}
                  src={img.image}
                  alt={img.alt}
                  width={420}
                  height={420}
                  class="object-cover flex-shrink-0"
                  style={{ width: "420px", height: "420px" }}
                />
              )
              : null
          )}
        </div>

        {/* Seção inferior: Títulos à esquerda + Gift cards à direita */}
        <div class="flex flex-row items-start justify-between w-full max-w-[1280px] mt-[10px] gap-[40px]">
          {/* Esquerda: titulo e subtítulo */}
          <div class="flex flex-col items-start flex-shrink-0 max-w-[300px]">
            {bottomTitle && (
              <div
                class="font-Hanken-Grotesk text-[#363931] w-full"
                dangerouslySetInnerHTML={{ __html: bottomTitle }}
              />
            )}
            {bottomSubtitle && (
              <div
                class="queens-text text-[32px] text-[#CE9680] leading-[32px] mt-[8px]"
                dangerouslySetInnerHTML={{ __html: bottomSubtitle }}
              />
            )}
          </div>

          {/* Direita: Gift cards 260x215 lado a lado */}
          <div class="flex flex-row items-start gap-[10px] flex-1">
            {[gift1, gift2, gift3, gift4].map((gift, index) => {
              if (!gift) return null;
              return (
                <div
                  key={index}
                  class="flex flex-col items-center bg-white px-[12px] py-[16px] rounded-lg"
                  style={{
                    width: "260px",
                    minHeight: "215px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                  }}
                >
                  <div class="w-[60px] h-[60px] flex-shrink-0 bg-[#D5D8C2] rounded-full flex items-center justify-center mb-[12px]">
                    {gift.logo && (
                      <img
                        src={gift.logo}
                        width={50}
                        height={50}
                        alt={`Brinde Logo ${index + 1}`}
                        class="w-[50px] h-[50px] object-contain rounded-full"
                      />
                    )}
                  </div>
                  {gift.text && (
                    <div
                      class="font-Hanken-Grotesk text-[#363931] text-[13px] text-center w-full"
                      dangerouslySetInnerHTML={{ __html: gift.text }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Botão 2 — centralizado */}
        <a
          href={btnLink2}
          class="mt-[40px] bg-[#353930] text-[#D5D8C2] flex items-center justify-center text-center font-Hanken-Grotesk transition-opacity hover:opacity-80 rounded-md"
          style={{ width: "351px", height: "45px", fontSize: "16px" }}
        >
          {btnLabel2}
        </a>
      </section>
    );
  }

  // ── MOBILE / TABLET (sem alteração) ──────────────────────────────────────
  return (
    <section class="flex flex-col items-center justify-center w-full mt-[40px] mb-[30px] overflow-hidden">
      <div class="w-full flex justify-center mb-[20px]">
        {device === "tablet" && banner?.tablet?.image && (
          <img
            alt={banner.tablet.alt}
            src={banner.tablet.image}
            width={banner.tablet.width}
            height={banner.tablet.height}
            class="w-full"
          />
        )}
        {device === "mobile" && banner?.mobile?.image && (
          <img
            alt={banner.mobile.alt}
            src={banner.mobile.image}
            width={375}
            height={300}
            class="w-full object-cover"
          />
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .queens-text, .queens-text * { font-family: "Queens", serif !important; }
        .font-Hanken-Grotesk, .font-Hanken-Grotesk * { font-family: "Hanken Grotesk", sans-serif !important; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />

      <div class="flex flex-col items-start w-full pl-[12px] pr-4 text-left">
        {topPlainText && (
          <div
            class="font-Hanken-Grotesk text-[#363931] w-full"
            dangerouslySetInnerHTML={{ __html: topPlainText }}
          />
        )}
        {plainText && (
          <div
            class="queens-text text-[32px] text-[#CE9680] leading-[32px] mb-[30px]"
            dangerouslySetInnerHTML={{ __html: plainText }}
          />
        )}
        {htmlText1 && (
          <div
            class="queens-text text-[32px] text-[#4D5D49] leading-[32px] w-full mb-[8px]"
            dangerouslySetInnerHTML={{ __html: htmlText1 }}
          />
        )}
        {plainText2 && (
          <div
            class="font-Hanken-Grotesk text-[#363931] w-full mb-[8px]"
            dangerouslySetInnerHTML={{ __html: plainText2 }}
          />
        )}
        {htmlText2 && (
          <div
            class="queens-text text-[32px] text-[#4D5D49] leading-[32px] w-full mb-[8px]"
            dangerouslySetInnerHTML={{ __html: htmlText2 }}
          />
        )}
        {plainText3 && (
          <div
            class="font-Hanken-Grotesk text-[#363931] w-full mb-[8px]"
            dangerouslySetInnerHTML={{ __html: plainText3 }}
          />
        )}
        {htmlText3 && (
          <div
            class="queens-text text-[32px] text-[#4D5D49] leading-[32px] w-full mb-[8px]"
            dangerouslySetInnerHTML={{ __html: htmlText3 }}
          />
        )}
        {plainText4 && (
          <div
            class="font-Hanken-Grotesk text-[#363931] w-full mb-[8px]"
            dangerouslySetInnerHTML={{ __html: plainText4 }}
          />
        )}
      </div>

      <a
        href={btnLink}
        class="mt-[20px] bg-[#353930] text-[#D5D8C2] flex items-center justify-center text-center font-Hanken-Grotesk transition-opacity hover:opacity-80 rounded-md"
        style={{ width: "351px", height: "45px", fontSize: "16px" }}
      >
        {btnLabel}
      </a>

      <div class="flex overflow-x-auto w-full gap-[8px] mt-[30px] pl-4 md:pl-0 md:justify-center hide-scrollbar snap-x snap-mandatory">
        {image1?.image && (
          <img
            src={image1.image}
            alt={image1.alt}
            width={260}
            height={260}
            class="flex-shrink-0 w-[260px] h-[260px] object-cover snap-center"
          />
        )}
        {image2?.image && (
          <img
            src={image2.image}
            alt={image2.alt}
            width={260}
            height={260}
            class="flex-shrink-0 w-[260px] h-[260px] object-cover snap-center pr-4 md:pr-0 box-content"
          />
        )}
      </div>

      <div class="flex flex-col items-start w-full pl-[12px] pr-4 text-left mt-[40px]">
        {bottomTitle && (
          <div
            class="font-Hanken-Grotesk text-[#363931] w-full"
            dangerouslySetInnerHTML={{ __html: bottomTitle }}
          />
        )}
        {bottomSubtitle && (
          <div
            class="queens-text text-[32px] text-[#CE9680] leading-[32px] mb-[30px]"
            dangerouslySetInnerHTML={{ __html: bottomSubtitle }}
          />
        )}
      </div>

      <div class="flex flex-col items-start w-full pl-[12px] pr-4 mt-[10px] gap-[16px]">
        {[gift1, gift2, gift3, gift4].map((gift, index) => {
          if (!gift) return null;
          return (
            <div key={index} class="flex items-center gap-[16px] w-full">
              <div class="w-[60px] h-[60px] flex-shrink-0 bg-[#D5D8C2] rounded-full flex items-center justify-center">
                {gift.logo && (
                  <img
                    src={gift.logo}
                    width={50}
                    height={50}
                    alt={`Brinde Logo ${index + 1}`}
                    class="w-[50px] h-[50px] object-contain rounded-full"
                  />
                )}
              </div>
              {gift.text && (
                <div
                  class="font-Hanken-Grotesk text-[#363931] w-full"
                  dangerouslySetInnerHTML={{ __html: gift.text }}
                />
              )}
            </div>
          );
        })}
      </div>

      <a
        href={btnLink2}
        class="mt-[20px] bg-[#353930] text-[#D5D8C2] flex items-center justify-center text-center font-Hanken-Grotesk transition-opacity hover:opacity-80 rounded-md"
        style={{ width: "351px", height: "45px", fontSize: "16px" }}
      >
        {btnLabel2}
      </a>
    </section>
  );
}
