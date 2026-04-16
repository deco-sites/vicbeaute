import type { ImageWidget } from "apps/admin/widgets.ts";

export interface Benefit {
  /** Imagem do benefício enviada via ImageWidget */
  image: ImageWidget;
  imageWidth: number;
  imageHeight: number;
  /** Primeira linha de texto (Desktop) */
  line1: string;
  /** Segunda linha de texto (Desktop) */
  line2: string;
  /** Primeira linha de texto (Mobile - Opcional) */
  mobileLine1?: string;
  /** Segunda linha de texto (Mobile - Opcional) */
  mobileLine2?: string;
}

export interface Props {
  benefits?: Benefit[];
}

export default function Benefits({ benefits = [] }: Props) {
  const listOfBenefits = benefits.map((benefit, index) => (
    <div
      class="max-lg:carousel-item flex-shrink-0 flex gap-cm-5 max-w-[214px] lg:max-w-[306px] lg:w-auto lg:h-[56px] h-[34px] lg:w-cm-300 lg:max-w-cm-300 w-full bg-cm-gray-300 xl:px-cm-26 xl:py-3 rounded-tl-cm-10 rounded-br-cm-10 px-3 py-2 rounded-bl-md items-center bg-[#FFFFFF] gap-[14px] lg:px-5 xl:w-full"
      id={`Home-benefits${index}-cy`}
    >
      <div class="flex-none">
        <img
          class="lg:w-[37px] lg:h-[32px]"
          src={benefit.image}
          width={benefit.imageWidth}
          height={benefit.imageHeight}
          alt={`${benefit.line1} ${benefit.line2}`}
        />
      </div>
      <div class="flex-auto flex flex-col text-cm-gray-800 xl:text-[14px] text-xs text-black-10 font-Hanken-Grotesk leading-[14px]">
        {/* TEXTO PARA MOBILE */}
        <div class="lg:hidden">
          <div class="font-Hanken-Grotesk text-xs text-[#363931]">
            {benefit.mobileLine1 ?? benefit.line1}
          </div>
          <div class="font-Hanken-Grotesk text-xs text-[#363931]">
            {benefit.mobileLine2 ?? benefit.line2}
          </div>
        </div>

        {/* TEXTO PARA DESKTOP */}
        <div class="max-lg:hidden">
          <div class="font-bold text-sm">{benefit.line1}</div>
          <div class="text-sm">{benefit.line2}</div>
        </div>
      </div>
    </div>
  ));

  return (
    <div class="w-full mx-auto lg:max-w-8xl container pl-4 mb-cm-25 xl:mb-cm-50 flex flex-col gap-8 lg:gap-cm-50 lg:px-0 xl:max-w-[1130px]">
      <div class="max-lg:carousel flex justify-between xl:justify-center gap-[10px] lg:gap-[18px] w-full">
        {listOfBenefits}
      </div>
    </div>
  );
}
