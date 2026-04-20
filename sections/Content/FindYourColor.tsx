import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  /**
   * @title Título principal
   * @description Título da seção (ex: Encontre a sua cor)
   */
  title?: string;
  /**
   * @title Texto de Destaque
   * @description Texto em negrito (ex: Não sabe por onde começar? A gente te ajuda a encontrar a sua cor!)
   * @format textarea
   */
  subtitle?: string;
  /**
   * @title Descrição
   * @description Texto explicativo do quiz
   * @format textarea
   */
  description?: string;
  /**
   * @title Chamada Final
   * @description Texto antes do botão (ex: Responda ao quiz...)
   * @format textarea
   */
  callToAction?: string;
  /**
   * @title Imagem
   * @description Configure as variações de imagem para mobile e desktop
   */
  image: {
    mobile: ImageWidget;
    desktop: ImageWidget;
    altText?: string;
  };
  /**
   * @title Botão
   */
  cta: {
    label: string;
    href: string;
  };
  /**
   * @title Breadcrumb (Mobile)
   * @description Navegação exibida apenas no mobile, acima do título
   */
  breadcrumb?: Array<{
    /** @title Label */
    label: string;
    /** @title Link */
    href?: string;
  }>;
}

export default function FindYourColor({
  title = "Encontre a sua cor",
  subtitle =
    "Não sabe por onde começar?\nA gente te ajuda a encontrar a sua cor!",
  description =
    "Aqui na Vic Beauté acreditamos que o autoconhecimento é essencial na hora da maquiagem para descobrir os tons que vão valorizar a sua beleza natural.",
  callToAction = "Responda ao quiz e saiba quais cores combinam mais com você.",
  image = {
    mobile:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    desktop:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    altText: "Encontre sua cor",
  },
  cta = {
    label: "Descubra",
    href: "/quiz",
  },
  breadcrumb = [
    { label: "Inicio", href: "/" },
    { label: "Descubra as cores ideias para você!", href: undefined },
  ],
}: Props) {
  return (
    <div class="flex flex-col lg:flex-row w-full bg-green-15 xl:pt-[39px] pt-[80px]">
      {/* Breadcrumb Mobile only */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav class="lg:hidden w-full px-5 pt-3 pb-1">
          <ol class="flex items-center gap-1 flex-wrap text-[12px] text-black-20">
            {breadcrumb.map((item, i) => (
              <li key={i} class="flex items-center gap-1">
                {i > 0 && <span class="opacity-50">/</span>}
                {item.href
                  ? (
                    <a href={item.href} class="hover:underline">
                      {item.label}
                    </a>
                  )
                  : <span class="opacity-70">{item.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}
      {/* Coluna de Texto (Desktop: Esquerda / Mobile: Layout em sanduíche com imagem) */}
      <div class="flex flex-col items-center justify-center w-full lg:w-1/2 xl:pt-10 pt-3 pb-12 px-5 md:px-10 lg:pl-16 lg:pr-12 xl:pl-32 xl:pr-24">
        <div class="w-full max-w-[480px] lg:max-w-[500px] flex flex-col items-center lg:items-start text-center lg:text-left">
          {title && (
            <h2 class="font-Queens text-[42px] md:text-[50px] lg:text-[56px] xl:text-[64px] text-pink-15 mb-6 lg:mb-10 w-full leading-[1.1]">
              {title}
            </h2>
          )}

          {/* Imagem Mobile (Renderiza apenas até o breakpoint lg) */}
          <div class="lg:hidden w-full mb-8">
            <Image
              src={image.mobile}
              width={335}
              height={335}
              alt={image.altText || title}
              class="w-full h-auto object-cover rounded-[4px]"
              loading="lazy"
            />
          </div>

          {subtitle && (
            <p class="font-medium text-[16px] md:text-[18px] lg:text-[20px] text-black-5 mb-5 w-full whitespace-pre-wrap leading-relaxed">
              {subtitle}
            </p>
          )}

          {description && (
            <p class="text-[15px] md:text-[16px] lg:text-[18px] text-black-20 mb-5 w-full whitespace-pre-wrap leading-relaxed">
              {description}
            </p>
          )}

          {callToAction && (
            <p class="text-[15px] md:text-[16px] lg:text-[18px] text-black-20 mb-8 w-full whitespace-pre-wrap leading-relaxed">
              {callToAction}
            </p>
          )}

          {cta && (
            <a
              href={cta.href}
              class="inline-block bg-green-10 hover:bg-green-20 text-white-15 px-12 py-[14px] rounded-[4px] text-[15px] lg:text-[16px] font-medium transition-colors"
            >
              {cta.label}
            </a>
          )}
        </div>
      </div>

      {/* Imagem Desktop (Ocupa a metade direita da tela) */}
      <div class="hidden lg:block lg:w-1/2 relative min-h-[500px] xl:min-h-[600px]">
        <Image
          src={image.desktop}
          width={720}
          height={600}
          alt={image.altText || title}
          class="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
}
