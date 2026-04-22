import type { ImageWidget, HTMLWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface IconItem {
  icon: ImageWidget;
  label: string;
}

export interface Props {
  /** @title Badge / Selo (Topo) */
  badge?: string;
  /** @title Título Principal */
  title?: HTMLWidget;
  /** @title Subtítulo */
  subtitle?: string;
  /** @title Ícones (Ex: Vegano, Cruelty Free) */
  icons?: IconItem[];
  /** @title Imagens */
  image: {
    desktop: ImageWidget;
    mobile: ImageWidget;
    alt?: string;
  };
  /**
   * @title Posição da Imagem no Desktop
   * @default right
   */
  imagePosition?: "left" | "right";
}

export default function AwardBanner({
  badge = "Prêmio Glamour de Beleza",
  title = "Produto premiado e aprovado por quem entende de beleza",
  subtitle = "Beleza com consciência",
  icons = [
    {
      icon: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      label: "Vegano",
    },
    {
      icon: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      label: "Vegano",
    },
    {
      icon: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      label: "Vegano",
    },
    {
      icon: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      label: "Vegano",
    }
  ],
  image = {
    desktop: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    mobile: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    alt: "Imagem do Produto Premiado",
  },
  imagePosition = "right",
}: Props) {
  const isImageRight = imagePosition === "right";

  // Reusable mini-components to avoid code duplication in the two layouts
  const BadgeEl = () => badge ? (
    <div class="bg-green-5 text-green-10 px-4 lg:px-6 py-2 text-[14px] lg:text-[15px] font-medium tracking-wide">
      {badge}
    </div>
  ) : null;

  const TitleEl = () => title ? (
    <h2 
      class="font-Queens text-[36px] sm:text-[42px] lg:text-[48px] text-pink-15 leading-[1.05] text-center"
      dangerouslySetInnerHTML={{ __html: title }}
    />
  ) : null;

  const SubtitleEl = () => subtitle ? (
    <h3 class="font-Queens text-[26px] lg:text-[32px] text-pink-15 text-center leading-tight">
      {subtitle}
    </h3>
  ) : null;

  const IconsEl = () => icons && icons.length > 0 ? (
    <div class="flex flex-row justify-center gap-4 sm:gap-6 lg:gap-8 flex-wrap">
      {icons.map((item, index) => (
        <div key={index} class="flex flex-col items-center gap-2">
          {/* Icons shown are outline svgs/pngs */}
          <div class="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] rounded-full flex items-center justify-center">
             <Image
                src={item.icon}
                width={50}
                height={50}
                alt={item.label}
                class="w-full h-full object-contain"
                loading="lazy"
             />
          </div>
          <span class="text-green-10 text-[12px] lg:text-[13px] font-Inter text-center">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  ) : null;

  return (
    <div class="w-full bg-white-10 py-10 lg:py-20 lg:px-8 xl:px-0">
      
      {/* 
        LAYOUT DESKTOP 
        Agrupa textos à esquerda (ou direita) com fundo branco, e imagem ocupando a outra metade. 
      */}
      <div class="hidden lg:flex max-w-[1140px] mx-auto bg-white-15 rounded-2xl overflow-hidden shadow-sm flex-row">
        
        {/* Content Box */}
        <div class={`w-1/2 flex flex-col justify-center items-center px-12 py-16 xl:p-20 order-2 ${isImageRight ? "order-1" : "order-2"}`}>
           <div class="mb-8">
             <BadgeEl />
           </div>
           <div class="mb-12">
             <TitleEl />
           </div>
           <div class="mb-8">
             <SubtitleEl />
           </div>
           <div>
             <IconsEl />
           </div>
        </div>

        {/* Image Box */}
        <div class={`w-1/2 order-1 ${isImageRight ? "order-2" : "order-1"}`}>
           <Image
              src={image.desktop}
              width={570}
              height={570}
              alt={image.alt || "Award Image Desktop"}
              class="w-full h-full object-cover min-h-[500px]"
              loading="lazy"
           />
        </div>

      </div>

      {/* 
        LAYOUT MOBILE
        Fluxo customizado: Title -> Badge -> Image -> Subtitle -> Icons
        Fundo branco omitido (transparente), herdando o fundo cinza claro.
      */}
      <div class="flex flex-col items-center lg:hidden w-full px-5">
         <div class="mb-6 w-full text-center">
           <TitleEl />
         </div>
         <div class="mb-8">
           <BadgeEl />
         </div>
         <div class="w-full rounded-2xl overflow-hidden mb-12 shadow-sm relative">
            <Image
              src={image.mobile}
              width={335}
              height={335}
              alt={image.alt || "Award Image Mobile"}
              class="w-full h-auto object-cover"
              loading="lazy"
            />
         </div>
         <div class="mb-8 w-full text-center">
           <SubtitleEl />
         </div>
         <div class="w-full">
           <IconsEl />
         </div>
      </div>

    </div>
  );
}
