import { useId } from "../../sdk/useId.ts";

export interface Props {
  /**
   * @title Texto SEO
   */
  textSeo?: {
    /** 
     * @title Título H1 
     */
    h1title?: string;
    /** 
     * @title Subtítulo H2 
     */
    h2subTitle?: string;
    /** 
     * @title Texto
     * @format textarea
     */
    text?: string;
  };
}

function SeoText({ textSeo }: Props) {
  const id = useId();

  if (!textSeo) return null;

  return (
    <div
      id={id}
      class="container pb-2 pt-6 lg:pt-10 flex flex-col text-base-content mx-0 lg:pb-8 gap-[5px] lg:gap-[6px]"
    >
      {(textSeo.h1title || textSeo.h2subTitle) && (
        <div class="flex flex-wrap items-center gap-2">
          {textSeo.h1title && (
            <h1 class="text-xl lg:text-[22px] font-semibold">{textSeo.h1title}</h1>
          )}
          {textSeo.h2subTitle && (
            <>
              <span class="text-xl lg:text-[22px] font-semibold">|</span>
              <h2 class="text-xl lg:text-[22px] font-semibold">{textSeo.h2subTitle}</h2>
            </>
          )}
        </div>
      )}

      {textSeo.text && (
        <div>
          <input
            class="peer hidden"
            id={`${id}-control-cb`}
            type="checkbox"
          />
          <div
            class="w-full max-w-none line-clamp-1 lg:peer-checked:line-clamp-none transition-all duration-300 pb-1 text-sm text-gray-10"
            dangerouslySetInnerHTML={{ __html: textSeo.text }}
          />
          <label
            for={`${id}-control-cb`}
            class="after:pl-1 after:content-['mais'] peer-checked:after:content-['menos'] text-[14px] text-gray-10 text-center cursor-pointer font-bold pb-1 pt-[2px] flex justify-center underline"
          >
            Ver
          </label>
        </div>
      )}
    </div>
  );
}

export default SeoText;
