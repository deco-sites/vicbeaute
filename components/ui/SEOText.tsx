import { useId } from "../../sdk/useId.ts";
import Icon from "../../components/ui/Icon.tsx";

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
      class="container flex flex-col text-base-content mx-0 px-5 lg:px-0 pt-6 lg:pt-10 pb-8 lg:pb-12 gap-[5px] lg:gap-[6px]"
    >
      <div class="w-full border-t border-[#D9D9D9] mb-4 lg:mb-6"></div>

      {(textSeo.h1title || textSeo.h2subTitle) && (
        <div class="flex flex-wrap items-center justify-center gap-2 mb-4 lg:mb-6">
          {textSeo.h1title && (
            <h1 class="text-[28px] font-Queens text-[#333333] leading-none text-center">
              {textSeo.h1title}
            </h1>
          )}
          {textSeo.h2subTitle && (
            <>
              <span class="text-[32px] lg:text-[40px] font-Queens text-[#333333] leading-none">|</span>
              <h2 class="text-[28px] font-Queens text-[#333333] leading-none text-center">
                {textSeo.h2subTitle}
              </h2>
            </>
          )}
        </div>
      )}

      {textSeo.text && (
      <div class="w-full relative flex flex-col items-center font-Hanken-Grotesk text-[14px]">
          <style
            dangerouslySetInnerHTML={{
              __html: `
                .seo-checkbox-${id} {
                  position: absolute;
                  opacity: 0;
                  pointer-events: none;
                }
                .seo-body-${id} {
                  position: relative;
                  max-height: 140px; /* Cerca de 5 a 6 linhas */
                  overflow: hidden;
                  transition: max-height 0.4s ease-in-out;
                }
                .seo-fade-${id} {
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  width: 100%;
                  height: 80px;
                  background: linear-gradient(to top, #F4F2EE 20%, rgba(244,242,238,0) 100%);
                  pointer-events: none;
                  transition: opacity 0.3s ease;
                }
                .seo-checkbox-${id}:checked ~ .seo-body-${id} {
                  max-height: 3000px;
                }
                .seo-checkbox-${id}:checked ~ .seo-body-${id} .seo-fade-${id} {
                  opacity: 0;
                }

                .seo-btn-${id} {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 8px;
                  margin-top: 16px;
                  padding: 8px 16px;
                  border: 1px solid #4A4B46;
                  border-radius: 4px;
                  font-size: 14px;
                  color: #4A4B46;
                  cursor: pointer;
                  background: transparent;
                  transition: all 0.2s ease;
                }
                .seo-btn-${id}:hover {
                  background: rgba(74, 75, 70, 0.05);
                }
                .seo-chevron {
                  transition: transform 0.3s ease;
                  transform: rotate(90deg);
                }
                .seo-checkbox-${id}:checked ~ .seo-btn-${id} .seo-chevron {
                  transform: rotate(-90deg);
                }
                .seo-checkbox-${id}:checked ~ .seo-btn-${id} .seo-text-more {
                  display: none;
                }
                .seo-checkbox-${id}:not(:checked) ~ .seo-btn-${id} .seo-text-less {
                  display: none;
                }
              `,
            }}
          />
          <input
            id={`${id}-control-cb`}
            type="checkbox"
            class={`seo-checkbox-${id}`}
          />
          
          <div class={`seo-body-${id} w-full text-[14px] lg:text-[16px] text-[#808080] font-Hanken-Grotesk`}>
            <div dangerouslySetInnerHTML={{ __html: textSeo.text }} />
            <div class={`seo-fade-${id}`} />
          </div>

          <label
            for={`${id}-control-cb`}
            class={`seo-btn-${id} font-Hanken-Grotesk select-none`}
          >
            <span class="seo-text-more text-[12px] font-Hanken-Grotesk">Ler Mais</span>
            <span class="seo-text-less text-[12px] font-Hanken-Grotesk">Ler Menos</span>
            <Icon id="chevron-right" size={16} class="seo-chevron" />
          </label>
        </div>
      )}
    </div>
  );
}

export default SeoText;
