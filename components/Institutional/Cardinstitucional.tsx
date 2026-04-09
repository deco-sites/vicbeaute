

export interface Props {
  /**
   * @title Título do Card
   */
  title?: string;
  /**
   * @title Texto Institucional
   * @format rich-text
   * @default
   */
  text?: string;
}

const Cardinstitucional = ({ title, text }: Props) => {
  return (
    <div class="w-full max-w-[1340px] md:mx-auto institutional-wrapper mt-5 flex flex-col md:items-center">
      <div class="flex items-start md:items-center justify-between md:justify-center flex-col lg:flex-row pb-[10px] w-full md:max-w-[800px]">
        <div class="institutional-text flex justify-center md:items-center flex-col px-3 w-full">
          {title && (
            <h2 class="text-[#CE9680] px-3 max-w-[351px] md:max-w-none h-fit text-[32px] leading-[32px] font-Queens mobile-text institutional-main-title mb-4 md:text-center w-full">
              {title}
            </h2>
          )}
          
          {text && (
            <div
              class="px-3 text-big mobile-text institutionalText bg-[#F4DFD4] border-l-[3px] border-[#A6705A] rounded-lg p-6 pr-3"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Cardinstitucional;
