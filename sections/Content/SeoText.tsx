import type { RichText } from "apps/admin/widgets.ts";
import { useId } from "../../sdk/useId.ts";

export interface Props {
  /**
   * @title Texto SEO
   * @default
   */
  textSeo?: RichText;
}

function SeoText({ textSeo = "" }: Props) {
  const id = useId();

  return (
    <div id={id} class="container my-3 flex flex-col text-base-content pt-14 px-3">
      {textSeo && (
        <div class="lg:mb-4">
          <input class="peer hidden" id="control-cb" type="checkbox" checked />
          <div
            class="w-full max-w-none peer-checked:line-clamp-3 full-tablet:peer-checked:line-clamp-4 transition-3s"
            dangerouslySetInnerHTML={{ __html: textSeo }}
          />
          <label
            class="after:pl-1 after:content-['menos'] peer-checked:after:content-['mais'] text-[14px] text-gray-0 text-center cursor-pointer font-bold py-1 mb-5 flex justify-center no-underline"
            for="control-cb"
          >
            Ver
          </label>
        </div>
      )}
    </div>
  );
}

export default SeoText;