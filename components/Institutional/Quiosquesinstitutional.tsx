import type { InstitutionalMenuItem } from "../../components/Institutional/interface/interface.ts";
import InstitutionalMobileMenu from "../../islands/InstitutionalMobileMenu.tsx";
import Icon from "../ui/Icon.tsx";
import { type ImageWidget } from "apps/admin/widgets.ts";
import { useDevice as useDevice } from "@deco/deco/hooks";

export interface DynamicIcon {
  mobile?: ImageWidget;
  tablet?: ImageWidget;
  desktop?: ImageWidget;
}

<<<<<<< HEAD
export interface Props {
  /**
   * @title Nome no Painel
   * @description O texto inserido aqui servirá de nome para essa seção na lista lateral do painel.
   */
  title?: string;
  /**
   * @title Título da Página
   */
  pageTitle?: string;
  /**
   * @title Menu Institucional
   */
  institutionalMenu?: InstitutionalMenuItem[];
  /**
   * @title Texto Institucional
   * @format rich-text
   * @default
   */
  institutionalText?: string;
=======

export interface QuiosqueCard {
  /**
   * @title Nome do Card na Lista
   */
  cardName?: string;
  /**
   * @title Título Informativo
   */
  informativeTitle?: string;
>>>>>>> 44cf962 (feat(institutional) : implement desktop institutional version)
  /**
   * @title Título Secundário
   */
  secondTitle?: string;
  /**
   * @title Ícone do Título (15x18) Dinâmico
   */
  titleIcon?: DynamicIcon;
  /**
   * @title Texto Abaixo do Título
   * @format rich-text
   */
  secondText?: string;
  /**
<<<<<<< HEAD
=======
   * @title Texto Institucional
   * @format rich-text
   */
  institutionalText?: string;
  /**
>>>>>>> 44cf962 (feat(institutional) : implement desktop institutional version)
   * @title Texto do Link
   */
  linkLabel?: string;
  /**
   * @title URL do Link
   */
  linkUrl?: string;
  /**
   * @title Ícone à direita do Link (24x24) Dinâmico
   */
  linkIcon?: DynamicIcon;
  /**
<<<<<<< HEAD
   * @title Mostrar Linha Divisória
   * @description Exibe uma linha na cor #EAEAEA 30px abaixo do link.
   */
  showDivider?: boolean;
=======
   * @title Mostrar Linha Divisória Mobile
   * @description Exibe uma linha na cor #EAEAEA 30px abaixo do link.
   */
  showDivider?: boolean;
}

export interface Props {
  /**
   * @title Nome no Painel
   * @description O texto inserido aqui servirá de nome para essa seção na lista lateral do painel.
   */
  title?: string;
  /**
   * @title Título principal da section quiosque
   */
  pageTitle?: string;
  /**
   * @title Menu Institucional
   */
  institutionalMenu?: InstitutionalMenuItem[];
  /**
   * @title Lista de Cards
   */
  cards?: QuiosqueCard[];
>>>>>>> 44cf962 (feat(institutional) : implement desktop institutional version)
  /**
   * @title Última aba
   * @description Ative se esta aba for a última antes do footer (adicionará 60px de espaço).
   */
  isLastSection?: boolean;
}

const Quiosquesinstitutional = (
<<<<<<< HEAD
  { pageTitle, institutionalMenu, institutionalText, secondTitle, titleIcon, secondText, linkLabel, linkUrl, linkIcon, showDivider, isLastSection }: Props,
=======
  { pageTitle, isLastSection, cards }: Props,
>>>>>>> 44cf962 (feat(institutional) : implement desktop institutional version)
) => {
  const device = useDevice();

  const getDynamicImage = (icon?: DynamicIcon) => {
    if (!icon) return null;
    if (device === "desktop" && icon.desktop) return icon.desktop;
    if (device === "tablet" && icon.tablet) return icon.tablet;
    return icon.mobile || icon.tablet || icon.desktop || null;
  };

<<<<<<< HEAD
  const currentTitleIcon = getDynamicImage(titleIcon);
  const currentLinkIcon = getDynamicImage(linkIcon);

  return (
    <div class={`bg-[#fff] w-full ${isLastSection ? "mb-[60px]" : ""}`}>
      <div class="max-w-[1340px] xl:mr-[350px] xl:ml-[250px] institutional-wrapper">
      
      <div class="justify-between flex-col lg:flex-row">
        <div class="institutional-text flex justify-center flex-col px-3">
          {pageTitle && (
            <h1 
              style={{ fontFamily: '"Queens", serif' }}
              class="text-[#CE9680] w-full max-w-[351px] mt-[30px] h-fit text-[36px] leading-[36px] font-Queens mobile-text institutional-main-title"
=======
  return (
    <div class={`bg-[#fff] w-full overflow-hidden ${isLastSection ? "mb-[60px]" : ""}`}>
      <div class="w-full md:px-[80px] max-w-[1440px] xl:mx-auto institutional-wrapper">
      
        <div class="flex-col w-full px-3 md:px-0">
          {pageTitle && (
            <h1 
              style= {{ fontFamily: '"Queens", serif' }}
              class="text-[#CE9680] w-full max-w-[351px] mt-[30px] h-fit text-[36px] leading-[36px] font-Queens mobile-text institutional-main-title mb-6 md:mb-10"
>>>>>>> 44cf962 (feat(institutional) : implement desktop institutional version)
            >
              {pageTitle}
            </h1>
          )}

<<<<<<< HEAD
          {(secondTitle || currentTitleIcon) && (
            <div class="flex items-start mt-[30px] mb-2">
              {currentTitleIcon && (
                <img src={currentTitleIcon} width={15} height={18} alt="Ícone do título" class="mt-1" />
              )}
              {secondTitle && (
                <h2 
                  style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                  class="text-[24px] text-black flex-1 break-words ml-[6px] pr-[12px] mt-0 leading-none text-[#4D5D49]"
                >
                  {secondTitle}
                </h2>
              )}
            </div>
          )}

          {secondText && (
            <div
              class="w-full text-base mb-4 text-[#363931] break-words"
              dangerouslySetInnerHTML={{ __html: secondText }}
            />
          )}
          
          {institutionalText && (
            <div
              class="w-full text-big mobile-text institutionalText break-words"
              dangerouslySetInnerHTML={{ __html: institutionalText }}
            />
          )}

          {(linkLabel || currentLinkIcon) && (
            <div class="flex items-center justify-end w-full mt-[10px] mb-6">
              {linkLabel && (
                <a href={linkUrl || "#"} class="text-base text-[#4D5D49] underline mr-2 font-Queens">
                  {linkLabel}
                </a>
              )}
              {currentLinkIcon && (
                <img src={currentLinkIcon} width={24} height={24} alt="Ícone do link" />
              )}
            </div>
          )}

          {showDivider && (
            <hr class="w-full border-t border-[#EAEAEA] mt-[30px] mb-8 self-start" />
          )}
        </div>
=======
          {cards && cards.length > 0 && (
            <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 w-full mt-4">
              {cards.map((card, idx) => {
                const currentTitleIcon = getDynamicImage(card.titleIcon);
                const currentLinkIcon = getDynamicImage(card.linkIcon);

                return (
                  <div key={idx} class="institutional-text flex flex-col relative w-full mb-4 md:mb-12">
                    
                    {/* Título Informativo Dinâmico (Comportamento de Título Global) */}
                    {card.informativeTitle && (
                      <h3 
                        style={{ fontFamily: '"Queens", serif' }}
                        class="text-[#CE9680] w-full max-w-[351px] h-fit text-[36px] leading-[36px] font-Queens mobile-text institutional-main-title mb-6 md:mb-8"
                      >
                        {card.informativeTitle}
                      </h3>
                    )}

                    {/* Divisor Desktop Vertical (apenas na coluna da esquerda se não for o último ímpar solitário) */}
                    {idx % 2 === 0 && idx + 1 < cards.length && (
                      <div class="hidden md:block absolute right-[-24px] top-4 w-[1px] h-[200px] bg-[#EAEAEA]" />
                    )}

                    {(card.secondTitle || currentTitleIcon) && (
                      <div class="flex items-start md:mt-2 mb-2">
                        {currentTitleIcon && (
                          <img src={currentTitleIcon} width={15} height={18} alt="Ícone do título" class="mt-1" />
                        )}
                        {card.secondTitle && (
                          <h2 
                            style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                            class="text-[24px] text-black flex-1 break-words ml-[6px] pr-[12px] mt-0 leading-none text-[#4D5D49]"
                          >
                            {card.secondTitle}
                          </h2>
                        )}
                      </div>
                    )}

                    {card.secondText && (
                      <div
                        class="w-full text-base mb-4 text-[#363931] break-words"
                        dangerouslySetInnerHTML={{ __html: card.secondText }}
                      />
                    )}
                    
                    {card.institutionalText && (
                      <div
                        class="w-full text-big mobile-text institutionalText break-words"
                        dangerouslySetInnerHTML={{ __html: card.institutionalText }}
                      />
                    )}

                    {(card.linkLabel || currentLinkIcon) && (
                      <div class="flex items-center justify-end w-full mt-[10px] mb-6">
                        {card.linkLabel && (
                          <a href={card.linkUrl || "#"} class="text-base text-[#4D5D49] underline mr-2 font-Queens">
                            {card.linkLabel}
                          </a>
                        )}
                        {currentLinkIcon && (
                          <img src={currentLinkIcon} width={24} height={24} alt="Ícone do link" />
                        )}
                      </div>
                    )}

                    {card.showDivider && (
                      <hr class="w-full border-t border-[#EAEAEA] mt-[10px] md:mt-[30px] mb-8 md:hidden self-start" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

>>>>>>> 44cf962 (feat(institutional) : implement desktop institutional version)
        </div>
      </div>
    </div>
  );
};

export default Quiosquesinstitutional;
