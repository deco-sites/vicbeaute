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
}: Props) {
  return (
    <footer class="w-full flex flex-col gap-10 bg-white px-3 bg-green-5 pb-4">
      <div class="w-full md:max-w-none xl:hidden">
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
      <div class="flex items-center gap-5 md:w-w-vc-300 xl:w-w-vc-150 py-1">
        <span class="text-black-35 font-Manrope">Redes sociais</span>
        <ul class="flex gap-5">
          {social.map(({ image, href, alt }) => (
            <li>
              <a data-cy="social-mobile" href={href}>
                <Image
                  src={image}
                  alt={alt}
                  loading="lazy"
                  width={24}
                  height={24}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div class="grid grid-cols-2 gap-4 mx-auto xl:hidden">
        <div class="flex flex-col items-center gap-1 border border-gray-300/50 w-w-vc-150 md:w-w-vc-300 xl:w-w-vc-150 py-1">
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
        <div class="flex flex-col items-center gap-1 border border-gray-300/50 w-w-vc-150 md:w-w-vc-300 xl:w-w-vc-150 py-1">
          <span class="text-sm text-black-25 font-Manrope">Managed by:</span>
          <a href={managedLink ?? "#"} target="_blank" data-cy="managed-mobile">
            {managedImg && (
              <Image src={managedImg} alt="managed" loading="lazy" />
            )}
          </a>
        </div>
      </div>
      <div class="hidden xl:flex flex-col gap-8 bg-white pt-10 max-w-vc-1452 w-full mx-auto">
        <div class="w-full max-w-vc-1344 mx-auto flex flex-row gap-g-vc-105 items-start justify-between">
          <div data-cy="logo">
            {(logoDesktop || logo) && (
              <Image
                src={logoDesktop ?? logo}
                alt="logo desktop"
                width={logoDesktopWidth ?? 205}
                height={logoDesktopHeight ?? 46}
                class="object-contain"
              />
            )}
          </div>
          <div class="flex-1 grid grid-cols-3 gap-3 pt-p-vc-10">
            {links.map(({ title, children }) => (
              <div class="flex flex-col gap-g-vc-10 max-w-vc-350 w-full mx-auto">
                <h4
                  data-cy="title-footer"
                  class="font-medium text-base text-black font-Poppins"
                >
                  {title}
                </h4>
                <ul class="flex flex-col gap-2">
                  {children.map((child) =>
                    child.isLink
                      ? (
                        <li>
                          <a data-cy="footer-options" href={child.href}>
                            <div class="text-[13px] text-black font-light font-Poppins">
                              {child.title}
                            </div>
                          </a>
                        </li>
                      )
                      : (
                        <li>
                          <div
                            id="text-footer"
                            data-cy="text-footer"
                            class="text-[13px] text-black font-light font-Poppins"
                            dangerouslySetInnerHTML={{
                              __html: child.content ?? "",
                            }}
                          />
                        </li>
                      )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div class="pt-6">
          <div class="w-full max-w-vc-1452 mx-auto grid grid-cols-4 gap-4 items-center">
            <div class="flex flex-col gap-1 max-w-vc-348 w-full items-center border py-1 min-h-vc-51">
              <span class="font-Poppins text-black text-xs">
                Plataforma
              </span>
              <a href={platformLink ?? "#"} target="_blank" data-cy="platform">
                {platformImg && (
                  <Image src={platformImg} alt="platform" loading="lazy" />
                )}
              </a>
            </div>
            <div class="flex flex-col gap-1 max-w-vc-348 w-full items-center border py-1 min-h-vc-51">
              <span class="font-Poppins text-black text-xs">
                Managed by:
              </span>
              <a href={managedLink ?? "#"} target="_blank" data-cy="managed">
                {managedImg && (
                  <Image src={managedImg} alt="managed" loading="lazy" />
                )}
              </a>
            </div>
            <div class="flex flex-col gap-1 max-w-vc-348 w-full items-center border py-1 min-h-vc-51">
              <span class="font-Poppins text-black text-xs">Pagamento</span>
              <ul class="flex flex-wrap gap-2">
                {paymentMethods.map(({ image, alt }) => (
                  <li
                    data-cy="payment-footer"
                    class="payment-footer border border-base-100 rounded flex justify-center items-center"
                  >
                    <Image src={image} alt={alt} loading="lazy" />
                  </li>
                ))}
              </ul>
            </div>
            <div class="flex flex-col gap-1 max-w-vc-348 w-full items-center border py-1 min-h-vc-51">
              <span class="font-Poppins text-black text-xs">
                Redes Sociais
              </span>
              <ul class="flex gap-3">
                {social.map(({ image, href, alt }) => (
                  <li>
                    <a href={href} data-cy="social">
                      <Image
                        src={image}
                        alt={alt}
                        loading="lazy"
                        width={24}
                        height={24}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="gap-1">
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
