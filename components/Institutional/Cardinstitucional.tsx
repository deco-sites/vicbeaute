

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
    <div class="max-w-[1340px] xl:mr-[350px] xl:ml-[250px] institutional-wrapper mt-5">
      <div class="flex items-start justify-between flex-col lg:flex-row pb-[10px]">
        <div class="institutional-text flex justify-center flex-col px-3">
          {title && (
            <h2 class="text-[#CE9680] px-3 max-w-[351px] h-fit text-[32px] leading-[32px] font-Queens mobile-text institutional-main-title mb-4">
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
