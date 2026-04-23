import type { ProductDetailsPage } from "apps/commerce/types.ts";

export interface Props {
  page: ProductDetailsPage | null;
}

export default function ProductComposition({ page }: Props) {
  if (!page || !page.product) return null;

  const product = page.product;
  const baseProduct = product.isVariantOf ?? product;
  const specs = baseProduct.additionalProperty ?? [];

  const textValue = specs.find((s) => s.name === "Composição")?.value;

  if (!textValue) return null;

  return (
    <div id="product-composition" class="w-full bg-[#f4f2ee] py-8 lg:py-16">
      <div class="container flex flex-col w-full px-5 sm:px-0 xl:px-[30px] xl2:px-0 max-w-[1280px]">
        <div class="compo-card">
          {/* Checkbox escondido — controla tudo via CSS irmão ~ */}
          <input type="checkbox" id="compo-toggle" class="compo-checkbox" />

          {/* Header clicável */}
          <label for="compo-toggle" class="compo-header">
            <h2 class="font-Queens">Composição</h2>
            <span class="compo-icon" />
          </label>

          {/* Conteúdo com preview + fade */}
          <div class="compo-body">
            <p class="font-Hanken-Grotesk capitalize">
              {textValue.toLowerCase()}
            </p>
            <div class="compo-fade" />
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* ── Card ── */
            .compo-card {
              background: #ffffff;
              padding: 24px;
              width: 100%;
              position: relative;
            }
            @media (min-width: 1024px) {
              .compo-card {
                padding: 32px 48px;
              }
            }

            /* ── Checkbox escondido ── */
            .compo-checkbox {
              position: absolute;
              opacity: 0;
              pointer-events: none;
              width: 0;
              height: 0;
            }

            /* ── Header ── */
            .compo-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              cursor: pointer;
              user-select: none;
            }
            .compo-header h2 {
              font-size: 32px;
              color: #D1927D;
              line-height: 1.1;
            }

            /* ── Ícone +/− ── */
            .compo-icon {
              font-size: 28px;
              color: #808080;
              font-weight: 300;
            }
            .compo-icon::after {
              content: "+";
            }
            .compo-checkbox:checked ~ .compo-header .compo-icon::after {
              content: "−";
            }

            /* ── Body (conteúdo com preview) ── */
            .compo-body {
              position: relative;
              margin-top: 16px;
              max-height: 72px;
              overflow: hidden;
              transition: max-height 0.4s ease;
            }
            @media (min-width: 1024px) {
              .compo-body {
                margin-top: 24px;
              }
            }
            .compo-body p {
              font-size: 15px;
              color: #808080;
              line-height: 24px;
            }

            /* ── Fade / brilho por baixo ── */
            .compo-fade {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 56px;
              background: linear-gradient(to top, #ffffff, rgba(255,255,255,0));
              pointer-events: none;
              transition: opacity 0.3s ease;
            }

            /* ── Estado aberto ── */
            .compo-checkbox:checked ~ .compo-body {
              max-height: 2000px;
            }
            .compo-checkbox:checked ~ .compo-body .compo-fade {
              opacity: 0;
            }
          `,
        }}
      />
    </div>
  );
}
