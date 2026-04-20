import type { ImageWidget } from "apps/admin/widgets.ts";
import ColorQuiz, { Step, ResultContent } from "../../islands/ColorQuiz.tsx";

export interface Props {
  /** 
   * @title Breadcrumb
   * @description Texto na esquerda acima do título, ex: "Inicio / Descubra as cores..."
   */
  mainBreadcrumb?: string;
  /** 
   * @title Título Geral 
   * @description Título da página exibido em rosa nas etapas de quiz.
   */
  mainTitle?: string;
  /** 
   * @title Etapas do Quiz
   */
  steps: Step[];
  /** 
   * @title Resultado Estático
   * @description Página de finalização que é exibida após a última etapa.
   */
  result: ResultContent;
}

export default function ColorQuizSection({
  mainBreadcrumb = "Inicio / Descubra as cores ideais para você!",
  mainTitle = "Descubra as cores\nideais para você!",
  steps = [
    {
      isForm: true,
      title: "Passo 1",
      description: "Responda as perguntas abaixo e saiba quais cores combinam mais com você para realçar a sua beleza natural.",
      formImageDesktop: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      formImageMobile: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
      buttonText: "Iniciar",
    },
    {
      isForm: false,
      title: "Qual seu tom de pele?*",
      description: "De acordo com a classificação dos fototipos de pele fornecida pela Sociedade Brasileira de Dermatologia.",
      options: [
        { label: "Extremamente branca", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
        { label: "Branca", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
        { label: "Morena Clara", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
        { label: "Morena Média", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
        { label: "Morena Escura", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
        { label: "Negra", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
        { label: "Negra Retinta", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
      ],
      buttonText: "Avançar",
    },
    {
      isForm: false,
      title: "Qual seu subtom de pele?*",
      description: "De acordo com a classificação dos fototipos de pele fornecida pela Sociedade Brasileira de Dermatologia.",
      options: [
        { label: "Frio", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
        { label: "Neutro", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
        { label: "Oliva", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
        { label: "Quente", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" }
      ],
      showUncertainButton: true,
      buttonText: "Avançar",
    },
    {
      isForm: false,
      title: "Qual a cor do seu cabelo?",
      description: "De acordo com a classificação dos fototipos de pele fornecida pela Sociedade Brasileira de Dermatologia.",
      options: [
        { label: "Branco", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
        { label: "Grisalho", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
        { label: "Loiro Claro", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
        { label: "Loiro", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
        { label: "Ruivo", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
        { label: "Castanho Claro", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
        { label: "Castanho", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
        { label: "Preto", image: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e" },
      ],
      buttonText: "Avançar",
    }
  ],
  result = {
    topTitle: "Essas são as cores que mais combinam com você!",
    topDescription: "Aqui na Vic Beauté acreditamos que o autoconhecimento é essencial na hora da maquiagem para descobrir os tons que vão valorizar a sua beleza natural.",
    topImageDesktop: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    topImageMobile: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    productImage: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/ff6bb37e-0eab-40e1-a454-86856efc278e",
    productTitle: "A cor de Stick Tudo que mais combina com você é:",
    productName: "Quentinho",
    ctaLabel: "Eu quero",
    ctaHref: "#"
  }
}: Props) {
  return (
    <ColorQuiz 
      mainTitle={mainTitle}
      mainBreadcrumb={mainBreadcrumb}
      steps={steps}
      result={result}
    />
  );
}
