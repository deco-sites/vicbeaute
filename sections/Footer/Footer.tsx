import { type ImageWidget, RichText } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Accordion from "../../components/ui/Accordion.tsx";
import { TextArea } from "apps/admin/widgets.ts";

interface LinkItem {
  isLink: true;
  title: string;
  href: string;
}

interface RichTextItem {
  isLink: false;
  title: string;
  content: RichText;
}

type Item = LinkItem | RichTextItem;

interface Link {
  title: string;
  children: Item[];
}

interface Social {
  alt?: string;
  href?: string;
  image: ImageWidget;
}

interface Props {
  /** @description Logo para mobile */
  logo?: ImageWidget;
  /** @description Largura do logo mobile (px) */
  logoMobileWidth?: number;
  /** @description Altura do logo mobile (px) */
  logoMobileHeight?: number;

  /** @description Logo para desktop */
  logoDesktop?: ImageWidget;
  /** @description Largura do logo desktop (px) */
  logoDesktopWidth?: number;
  /** @description Altura do logo desktop (px) */
  logoDesktopHeight?: number;

  links?: Link[];
  social?: Social[];
  paymentMethods?: Social[];
  trademark?: string;
  managedImg?: ImageWidget;
  managedLink?: string;
  platformImg?: ImageWidget;
  platformLink?: string;
  textFooter?: TextArea;
  textPrivacity?: string;
  linkPrivacity?: string;

  /** @description Título da seção de newsletter */
  newsletterTitle?: string;
  /** @description Link para a Política de Privacidade */
  newsletterPrivacyLink?: string;
  /** @description Link para os Termos de Uso */
  newsletterTermsLink?: string;
}

function Footer({
  links = [],
  social = [],
  paymentMethods = [],
  logo,
  logoDesktop,
  logoDesktopWidth,
  logoDesktopHeight,
  managedImg,
  managedLink,
  platformImg,
  platformLink,
  textFooter,
  textPrivacity,
  linkPrivacity,
  newsletterTitle = "Inscreva-se e fique por dentro das novidades",
  newsletterPrivacyLink = "/politica-de-privacidade",
  newsletterTermsLink = "/termos-de-uso",
}: Props) {
  return (
    <footer class="w-full flex flex-col xl:gap-0 bg-green-5 xl:pb-4 pb-4">
      {/* NEWSLETTER MOBILE */}
      <div class="xl:hidden bg-white-15 xl:px-5 xl:py-8 px-[22px] py-[26px] rounded-b-2xl">
        <h3 class="font-Queens text-[28px] leading-[1.15] text-black mb-5">
          {newsletterTitle}
        </h3>
        <form class="flex flex-col gap-3">
          <div class="flex items-center border-b border-[#191C1F] pb-1">
            <input
              type="email"
              placeholder="Digite seu e-mail"
              class="flex-1 bg-transparent text-[14px] text-black outline-none placeholder:text-[#4a4a4a]"
            />
            <button
              type="submit"
              class="ml-3 bg-[#556B50] text-white-15 py-[10px] px-3 rounded-md text-[13px] font-semibold whitespace-nowrap hover:bg-[#455C42] transition-colors"
            >
              Cadastrar
            </button>
          </div>
          <p class="text-[11px] leading-snug text-[#4a4a4a] mt-0 xl:mt-1">
            Ao se inscrever você aceita a{" "}
            <a href={newsletterPrivacyLink} class="underline hover:text-black">
              Política de Privacidade
            </a>{" "}
            e{" "}
            <a href={newsletterTermsLink} class="underline hover:text-black">
              Termos de Uso
            </a>.
          </p>
        </form>
      </div>
      <div class="w-full md:max-w-none xl:hidden px-3 bg-white">
        <Accordion
          children={links.map(({ title, children }) => ({
            title,
            subtitle: (
              <ul data-cy="options-mobile" class="flex flex-col gap-2">
                {children.map((child) =>
                  child.isLink
                    ? (
                      <li>
                        <a
                          href={child.href}
                          class="text-sm text-gray-500 hover:underline"
                          data-cy="sublink-footer"
                        >
                          {child.title}
                        </a>
                      </li>
                    )
                    : (
                      <li>
                        <div
                          id="text-footer"
                          data-cy="text-footer"
                          class="text-sm text-gray-500"
                          dangerouslySetInnerHTML={{
                            __html: child.content ?? "",
                          }}
                        />
                      </li>
                    )
                )}
              </ul>
            ) as unknown as string,
          }))}
        />
      </div>

      <div class="flex items-center gap-5 md:w-w-vc-300 xl:w-vc-150 lg:hidden pl-3 pt-10 pb-[30px]">
        <span class="text-black-35 font-Manrope">Redes sociais</span>
        <ul class="flex gap-5">
          {social.map(({ image, href, alt }) => (
            <li>
              <a data-cy="social-mobile" href={href}>
                <Image
                  src={image}
                  alt={alt}
                  loading="lazy"
                  width={32}
                  height={32}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div class="grid grid-cols-2 gap-4 mx-auto xl:hidden">
        <div class="flex flex-col items-center gap-[10px] border border-gray-300/50 w-vc-150 md:w-w-vc-300 xl:w-vc-150 py-1">
          <span class="text-sm text-black-25 font-Manrope">Plataforma:</span>
          <a
            href={platformLink ?? "#"}
            target="_blank"
            data-cy="platform-mobile"
          >
            {platformImg && (
              <Image src={platformImg} alt="platform" loading="lazy" />
            )}
          </a>
        </div>
        <div class="flex flex-col items-center gap-[10px] border border-gray-300/50 w-vc-150 md:w-w-vc-300 xl:w-vc-150 py-1">
          <span class="text-sm text-black-25 font-Manrope">Managed by:</span>
          <a href={managedLink ?? "#"} target="_blank" data-cy="managed-mobile">
            {managedImg && (
              <Image src={managedImg} alt="managed" loading="lazy" />
            )}
          </a>
        </div>
      </div>
      {/* VISTA DESKTOP NOVA */}
      <div class="hidden xl:flex flex-col gap-8 pt-16 max-w-[1240px] w-full mx-auto px-4 lg:px-8 bg-transparent">
        <div class="w-full flex flex-row gap-20 items-start justify-between">
          {/* COLUNA 1: NEWSLETTER E LOGOS */}
          <div class="flex flex-col max-w-[430px] w-full gap-8">
            <div class="flex flex-col gap-4">
              <h3 class="font-Queens text-[36px] leading-[1.1] text-black">
                Inscreva-se e fique por dentro das novidades
              </h3>

              <form class="flex flex-col xl:gap-2 gap-3 mt-4">
                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                  class="w-full bg-transparent border-0 border-b border-[#191C1F] pb-2 text-[14px] text-black outline-none placeholder:text-[#4a4a4a]"
                />
                <button
                  type="submit"
                  class="w-full bg-[#556B50] text-white-15 py-3 rounded-md text-[14px] uppercase tracking-widest font-semibold hover:bg-[#455C42] transition-colors mt-2"
                >
                  Cadastrar
                </button>
                <label class="flex xl:items-center items-start gap-2 mt-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    class="mt-1 xl:mt-0 w-4 h-4 rounded-sm border-gray-400 text-[#556B50] focus:ring-[#556B50]"
                  />
                  <span class="text-[11px] leading-tight text-[#4a4a4a]">
                    Ao se inscrever você aceita a{" "}
                    <a
                      href="/politica-de-privacidade"
                      class="underline hover:text-black"
                    >
                      Política de Privacidade
                    </a>{" "}
                    e{" "}
                    <a href="/termos-de-uso" class="underline hover:text-black">
                      Termos de Uso
                    </a>.
                  </span>
                </label>
              </form>
            </div>

            <div class="flex items-center gap-6 mt-6">
              <div class="flex items-center gap-2">
                <span class="text-[11px] text-[#4a4a4a] font-medium tracking-wide">
                  Plataforma:
                </span>
                <a
                  href={platformLink ?? "#"}
                  target="_blank"
                  data-cy="platform"
                  class="opacity-80 hover:opacity-100 transition-opacity"
                >
                  {platformImg && (
                    <Image
                      src={platformImg}
                      alt="platform"
                      loading="lazy"
                      height={16}
                      width={60}
                      class="object-contain"
                    />
                  )}
                </a>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] text-[#4a4a4a] font-medium tracking-wide">
                  Managed by:
                </span>
                <a
                  href={managedLink ?? "#"}
                  target="_blank"
                  data-cy="managed"
                  class="opacity-80 hover:opacity-100 transition-opacity"
                >
                  {managedImg && (
                    <Image
                      src={managedImg}
                      alt="managed"
                      loading="lazy"
                      height={16}
                      width={60}
                      class="object-contain"
                    />
                  )}
                </a>
              </div>
            </div>
          </div>

          {/* COLUNAS MENUS E NAVEGAÇÃO + SOCIAIS NA ÚLTIMA COLUNA */}
          <div class="flex-1 flex justify-end w-full">
            <div class="grid grid-cols-4 w-full max-w-[730px] gap-[30px]">
              {links.map(({ title, children }, index) => (
                <div class="flex flex-col gap-4 xl:gap-5 w-full h-full">
                  <div>
                    <h4
                      data-cy="title-footer"
                      class="font-bold text-[12px] uppercase text-[#191C1F] tracking-wide mb-3"
                    >
                      {title}
                    </h4>
                    <ul class="flex flex-col gap-2">
                      {children.map((child) =>
                        child.isLink
                          ? (
                            <li>
                              <a
                                data-cy="footer-options"
                                href={child.href}
                                class="text-[13px] text-[#191C1F] hover:opacity-70 transition-opacity"
                              >
                                {child.title}
                              </a>
                            </li>
                          )
                          : (
                            <li>
                              <div
                                id="text-footer"
                                data-cy="text-footer"
                                class="text-[13px] text-[#191C1F]"
                                dangerouslySetInnerHTML={{
                                  __html: child.content ?? "",
                                }}
                              />
                            </li>
                          )
                      )}
                    </ul>
                  </div>

                  {/* REDES SOCIAIS E CONTATO ALINHADOS ABAIXO DA ÚLTIMA COLUNA */}
                  {index === links.length - 1 && (
                    <div class="flex flex-col gap-3 w-full mt-[72px]">
                      <h4 class="font-bold text-[12px] uppercase text-[#191C1F] tracking-wide mb-1">
                        Redes Sociais
                      </h4>
                      <ul class="flex gap-3 mb-2">
                        {social.map(({ image, href, alt }) => (
                          <li>
                            <a
                              href={href}
                              data-cy="social"
                              class="hover:opacity-70 transition-opacity"
                            >
                              <Image
                                src={image}
                                alt={alt}
                                loading="lazy"
                                width={24}
                                height={24}
                                class="object-contain"
                              />
                            </a>
                          </li>
                        ))}
                      </ul>
                      <div class="flex flex-col gap-2 mt-2 text-[13px] text-[#191C1F]">
                        <a
                          href="tel:1149352378"
                          class="hover:opacity-70 transition-opacity"
                        >
                          (11) 4935-2378
                        </a>
                        <a
                          href="mailto:sac@vicbeaute.com.br"
                          class="hover:opacity-70 transition-opacity"
                        >
                          sac@vicbeaute.com.br
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div class="hidden xl:flex w-full pt-10">
        <div class="max-w-[1452px] w-full mx-auto px-4 lg:px-8 border-t border-[#cecece] pt-6 flex justify-between items-center pb-4">
          <div
            data-cy="text-footer-desk"
            class="text-[12px] text-[#191C1F] tracking-wide opacity-80"
            dangerouslySetInnerHTML={{ __html: textFooter ?? "" }}
          />
          <a
            href={linkPrivacity ?? ""}
            target="_blank"
            class="hover:opacity-100 hover:underline"
          >
            <div
              class="text-[12px] text-[#191C1F] tracking-wide opacity-80"
              dangerouslySetInnerHTML={{ __html: textPrivacity ?? "" }}
            />
          </a>
        </div>
      </div>

      {/* VISTA MOBILE DO COPYRIGHT (Inalterada mas escondida no desk) */}
      <div class="xl:hidden flex flex-col gap-1 mt-6 px-3">
        <div
          data-cy="text-footer-desk"
          class="text-footer-desk leading-normal text-center tracking-wider text-black-35 text-xs text-black font-medium lg:max-w-[1052px] w-full mx-auto font-Manrope"
          dangerouslySetInnerHTML={{ __html: textFooter ?? "" }}
        />
        <a href={linkPrivacity ?? ""} target="_blank">
          <div
            class="text-footer-desk underline leading-normal text-center tracking-wider text-black-35 text-xs text-black font-medium lg:max-w-[1052px] w-full mx-auto font-Manrope"
            dangerouslySetInnerHTML={{ __html: textPrivacity ?? "" }}
          />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
