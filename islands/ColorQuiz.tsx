import { useState } from "preact/hooks";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../sdk/clx.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";

export interface Option {
  image: ImageWidget;
  label: string;
}

export interface Step {
  isForm?: boolean;
  formImageDesktop?: ImageWidget;
  formImageMobile?: ImageWidget;
  title: string;
  description?: string;
  options?: Option[];
  showUncertainButton?: boolean;
  buttonText?: string;
}

export interface ResultContent {
  topTitle: string;
  topDescription: string;
  topImageDesktop: ImageWidget;
  topImageMobile: ImageWidget;
  productTitle: string;
  productName: string;
  productImage: ImageWidget;
  ctaLabel: string;
  ctaHref: string;
}

export interface ColorQuizProps {
  mainTitle?: string;
  mainBreadcrumb?: string;
  steps: Step[];
  result: ResultContent;
}

export default function ColorQuiz(
  { mainTitle, mainBreadcrumb, steps, result }: ColorQuizProps,
) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleNext = () => {
    const stepObj = steps[currentStep];

    // Validate if required
    if (stepObj.isForm) {
      if (!name || !email) {
        alert("Por favor, preencha nome e e-mail para continuar.");
        return;
      }
    } else {
      if (selectedOption === null) {
        alert("Por favor, selecione uma opção para continuar.");
        return;
      }
    }

    setSelectedOption(null); // clear for next step
    setCurrentStep((prev) => prev + 1);

    // Scroll to top
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleUncertain = () => {
    setSelectedOption(null);
    setCurrentStep((prev) => prev + 1);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep === 0) {
      // maybe return to home?
      if (typeof window !== "undefined") {
        window.history.back();
      }
      return;
    }
    setSelectedOption(null);
    setCurrentStep((prev) => Math.max(0, prev - 1));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!steps || steps.length === 0) return null;

  // Render Result Page
  if (currentStep >= steps.length) {
    return (
      <div class="w-full flex flex-col items-center xl:pt-[15px] lg:pt-[39px] bg-[#F4F4F4] pt-[90px]">
        {/* Breadcrumb Info na Page de Result Mobile */}
        {mainBreadcrumb && (
          <div class="w-full flex justify-start text-[12px] text-black-20 mb-4 px-5 text-left max-w-[900px] lg:hidden">
            <span>{mainBreadcrumb}</span>
          </div>
        )}

        {/* Resultado - Topo Escuro */}
        <div class="w-full bg-[#353C32] text-white-15 flex justify-center py-0 lg:py-20 px-0 lg:px-5">
          <div class="max-w-[900px] w-full flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Mobile Image (on top) */}
            <div class="w-full relative lg:hidden order-1">
              <Image
                src={result.topImageMobile}
                width={375}
                height={375}
                class="w-full h-auto object-cover"
              />
            </div>

            <div class="flex flex-col w-full max-w-[400px] items-center lg:items-start text-center lg:text-left px-5 py-8 lg:py-0 order-2 lg:order-1">
              {/* Breadcrumb Info Title Desktop */}
              {mainBreadcrumb && (
                <div class="hidden lg:flex w-full justify-start text-[12px] text-white-15/80 mb-8 text-left max-w-[900px]">
                  <span>{mainBreadcrumb}</span>
                </div>
              )}
              <h2 class="font-Queens text-[36px] lg:text-[48px] text-white-15 leading-[1.1] mb-4">
                {result.topTitle}
              </h2>
              <p class="text-[14px] lg:text-[16px] text-white-15/80 leading-relaxed mb-6 lg:mb-0">
                {result.topDescription}
              </p>
            </div>

            {/* Desktop Image */}
            <div class="relative w-full max-w-[450px] hidden lg:block order-2">
              <Image
                src={result.topImageDesktop}
                width={500}
                height={400}
                class="w-full h-auto object-cover rounded-sm"
              />
            </div>
          </div>
        </div>

        {/* Resultado - Produto Escolhido */}
        <div class="w-full bg-[#F4F5F4] flex justify-center py-12 lg:py-24 px-5">
          <div class="max-w-[800px] w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
            {/* Title & Name Mobile & Desktop */}
            <div class="flex flex-col items-center lg:items-start text-center lg:text-left max-w-[320px] order-1 lg:order-2">
              <h3 class="font-Queens text-[32px] lg:text-[40px] text-[#CE9680] leading-[1.1] mb-3">
                {result.productTitle}
              </h3>
              <p class="text-[20px] lg:text-[16px] text-black-5 mb-8 lg:mb-10">
                {result.productName}
              </p>

              {/* Image Mobile */}
              <div class="w-full flex justify-center lg:hidden mb-8">
                <Image
                  src={result.productImage}
                  width={350}
                  height={350}
                  class="w-full max-w-[300px] h-auto object-cover rounded"
                />
              </div>

              <a
                href={result.ctaHref}
                class="bg-[#596455] text-white-15 hover:bg-[#465042] transition-colors py-4 px-12 rounded-[4px] text-center inline-block w-full font-medium"
              >
                {result.ctaLabel}
              </a>
            </div>

            {/* Image Desktop */}
            <div class="relative hidden lg:block order-1">
              <Image
                src={result.productImage}
                width={350}
                height={350}
                class="w-full lg:max-w-[400px] h-auto object-cover rounded"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Quiz Step
  const step = steps[currentStep];

  const renderStepIndicator = () => (
    <div class="flex items-center justify-between w-full max-w-[400px] mb-10 lg:mb-12 relative z-10 px-4 mt-8 lg:mt-0">
      {steps.map((_, i) => {
        const isCurrent = i === currentStep;
        return (
          <div
            key={i}
            class="flex items-center relative flex-1 last:flex-none"
          >
            <div
              class={clx(
                "w-9 h-9 rounded-full flex items-center justify-center text-[15px] font-bold shrink-0 transition-colors z-20",
                isCurrent
                  ? "bg-[#596455] text-white-15"
                  : "bg-[#DCDCDC] text-black-10",
              )}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div class="w-full h-[1px] bg-[#DCDCDC] mx-2 z-10 absolute left-9 right-[-8px]" />
            )}
          </div>
        );
      })}
    </div>
  );

  // Form Step Layout (Row on Desktop)
  if (step.isForm) {
    return (
      <div class="w-full bg-[#EBECE4] lg:bg-[#EBECE4] bg-[#F4F4F4] flex flex-col lg:flex-row min-h-[80vh] overflow-hidden lg:pt-0 pt-[50px]">
        {/* Mobile Only: Top Header */}
        <div class="w-full flex lg:hidden flex-col items-center text-center px-5 pt-8 pb-4">
          {mainBreadcrumb && (
            <span class="w-full text-left text-[12px] text-black-20 mb-4">
              {mainBreadcrumb}
            </span>
          )}
          {mainTitle && (
            <h1 class="font-Queens text-[42px] text-[#CE9680] leading-[1.1] mb-4">
              {mainTitle}
            </h1>
          )}
        </div>

        {/* Right Side: Image -> On mobile it is right below title */}
        <div class="w-full lg:w-1/2 h-[auto] sm:h-[450px] lg:h-auto min-h-[50vh] relative order-1 lg:order-2 px-5 lg:px-0 mb-6 lg:mb-0">
          {step.formImageMobile && (
            <Image
              src={step.formImageMobile}
              width={800}
              height={800}
              class="relative lg:absolute lg:inset-0 w-full h-auto lg:h-full object-cover lg:hidden rounded-[4px] lg:rounded-none"
            />
          )}
          {step.formImageDesktop && (
            <Image
              src={step.formImageDesktop}
              width={1000}
              height={1000}
              class="absolute inset-0 w-full h-full object-cover hidden lg:block"
            />
          )}
        </div>

        {/* Left Side: Content */}
        <div class="w-full bg-[#EBECE4] lg:w-1/2 flex items-center justify-center lg:justify-end py-12 lg:py-24 px-5 relative z-10 order-2 lg:order-1 pt-6 lg:pt-12">
          <div class="w-full max-w-[500px] flex flex-col items-center lg:items-start text-center lg:text-left lg:pr-10 xl:pr-16">
            {/* Title Desktop */}
            {mainTitle && (
              <h1 class="font-Queens text-[42px] lg:text-[56px] text-[#CE9680] leading-[1.1] mb-6 hidden lg:block">
                {mainTitle}
              </h1>
            )}

            {/* Description */}
            {step.description && (
              <p class="text-[15px] lg:text-[16px] text-black-5 mb-8 leading-relaxed max-w-[450px]">
                {step.description}
              </p>
            )}

            {/* Step Indicator */}
            <div class="w-full flex justify-center lg:justify-start">
              {renderStepIndicator()}
            </div>

            {/* Form Fields */}
            <div class="w-full flex flex-col gap-6 max-w-[450px]">
              <div class="w-full flex flex-col items-center lg:items-start gap-4">
                <label class="font-Queens text-[26px] lg:text-[32px] text-black-10">
                  Digite seu nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName((e.target as HTMLInputElement).value)}
                  placeholder="Estela"
                  class="w-full bg-white-15 border border-[#DCDCDC] px-5 py-4 text-center rounded-[4px] outline-none focus:border-[#596455] transition-colors"
                />
              </div>
              <div class="w-full flex flex-col items-center lg:items-start gap-4 mt-2">
                <label class="font-Queens text-[26px] lg:text-[32px] text-black-10">
                  E qual seu e-mail?
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail((e.target as HTMLInputElement).value)}
                  placeholder="etela@email.com"
                  class="w-full bg-white-15 border border-[#DCDCDC] px-5 py-4 text-center rounded-[4px] outline-none focus:border-[#596455] transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div class="w-full max-w-[450px] mt-8 lg:mt-10 flex flex-col items-center">
              <button
                type="button"
                onClick={handleNext}
                class="bg-[#596455] text-white-15 hover:bg-[#465042] transition-colors w-full rounded-[4px] py-4 font-medium"
              >
                {step.buttonText || "Iniciar"}
              </button>
              <button
                type="button"
                onClick={handlePrev}
                class="mt-6 text-[#596455] font-medium border-b border-[#596455] leading-tight pb-[2px] hover:text-black-10 hover:border-black-10 transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular Quiz Steps (Grids)
  return (
    <div class="w-full flex justify-center bg-[#F4F4F4] min-h-[80vh] px-5 py-6 lg:py-12 pt-[15px] lg:pt-[39px]">
      <div class="w-full max-w-[800px] flex flex-col items-center lg:pt-[50px]">
        {/* Breadcrumb Info */}
        {mainBreadcrumb && (
          <div class="w-full flex justify-start text-[12px] text-black-20 mb-4 lg:mb-8 text-left">
            <span>{mainBreadcrumb}</span>
          </div>
        )}

        {/* Main Title Appears Again */}
        {mainTitle && (
          <h1 class="font-Queens text-[42px] lg:text-[56px] text-[#CE9680] leading-[1.1] mb-8 text-center">
            {mainTitle}
          </h1>
        )}

        {/* Step Indicator */}
        <div class="w-full flex justify-center mb-4">
          {renderStepIndicator()}
        </div>

        {/* Step Title & Description */}
        <div class="flex flex-col items-center w-full mb-10">
          <h3 class="font-Queens text-[32px] lg:text-[48px] text-black-10 text-center leading-[1.1] mb-2">
            {step.title}
          </h3>
          {step.description && (
            <p class="text-[14px] lg:text-[16px] text-black-20 text-center max-w-[600px] mt-2 leading-relaxed">
              {step.description}
            </p>
          )}
        </div>

        {/* Options Grid */}
        {step.options && (
          <div class="flex flex-row flex-wrap justify-center gap-4 lg:gap-6 w-full max-w-[700px] lg:max-w-[850px] mb-10">
            {step.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedOption(idx)}
                  class="flex flex-col items-center gap-2 lg:gap-3 group"
                >
                  <div
                    class={clx(
                      "flex overflow-hidden rounded-[4px] transition-all duration-300 relative",
                      isSelected
                        ? "ring-[3px] ring-[#596455] ring-offset-[3px] scale-105"
                        : "border border-transparent",
                    )}
                  >
                    <Image
                      src={opt.image}
                      width={350}
                      class="h-[120px] md:h-[150px] lg:h-[180px] w-auto object-cover max-w-[80vw]"
                    />
                  </div>
                  <span class="text-[13px] lg:text-[15px] font-medium text-black-5 text-center leading-tight mt-1">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div class="flex flex-col items-center w-full max-w-[450px] mt-8 lg:mt-12">
          {step.showUncertainButton && (
            <button
              type="button"
              onClick={handleUncertain}
              class="bg-[#EBEBEB] text-black-10 hover:bg-[#E0E0E0] transition-colors w-full rounded-[4px] py-4 font-medium mb-4"
            >
              Não tenho certeza
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            class="bg-[#596455] text-white-15 hover:bg-[#465042] transition-colors w-full rounded-[4px] py-4 font-medium"
          >
            {step.buttonText || "Avançar"}
          </button>

          <button
            type="button"
            onClick={handlePrev}
            class="mt-6 text-[#596455] font-medium border-b border-[#596455] leading-tight pb-[2px] hover:text-black-10 hover:border-black-10 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
