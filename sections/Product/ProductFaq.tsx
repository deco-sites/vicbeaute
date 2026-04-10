import type { ProductDetailsPage } from "apps/commerce/types.ts";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

interface FaqItem {
  question: string;
  answer: string;
}

export default function ProductFaq({ page }: Props) {
  if (!page || !page.product) return null;

  const product = page.product;
  const baseProduct = product.isVariantOf ?? product;
  const specs = baseProduct.additionalProperty ?? [];

  // Collect Faq1 through Faq5
  const faqItems: FaqItem[] = [];
  for (let i = 1; i <= 5; i++) {
    const raw = specs.find((s) => s.name === `Faq${i}`)?.value;
    if (!raw) continue;

    // The value has question on the first line, answer on the rest
    const newlineIdx = raw.indexOf("\n");
    if (newlineIdx === -1) continue;

    const question = raw.substring(0, newlineIdx).trim();
    const answer = raw.substring(newlineIdx + 1).trim();
    if (question && answer) {
      faqItems.push({ question, answer });
    }
  }

  if (faqItems.length === 0) return null;

  return (
    <div id="product-faq" class="w-full py-8 lg:py-16">
      <div class="container flex flex-col w-full px-5 sm:px-0 max-w-[1044px]">
        {/* Title */}
        <h2 class="faq-title font-Queens">Duvidas Frequentes</h2>

        {/* FAQ Items */}
        <div class="faq-list">
          {faqItems.map((item, idx) => (
            <div class="faq-item" key={idx}>
              <input
                type="checkbox"
                id={`faq-toggle-${idx}`}
                class="faq-checkbox"
              />
              <label for={`faq-toggle-${idx}`} class="faq-header">
                <span class="faq-question font-Hanken-Grotesk">
                  {item.question}
                </span>
                <svg
                  class="faq-chevron"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="#808080"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </label>
              <div class="faq-answer">
                <p class="font-Hanken-Grotesk">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* ── Title ── */
            .faq-title {
              text-align: center;
              color: #D1927D;
              font-size: 28px;
              margin-bottom: 16px;
              line-height: 1.2;
            }
            @media (min-width: 1024px) {
              .faq-title {
                font-size: 36px;
                margin-bottom: 24px;
              }
            }

            /* ── List ── */
            .faq-list {
              display: flex;
              flex-direction: column;
              width: 100%;
            }

            /* ── Item ── */
            .faq-item {
              position: relative;
              border-top: 1px solid #E0E0E0;
            }
            .faq-item:last-child {
              border-bottom: 1px solid #E0E0E0;
            }

            /* ── Hidden checkbox ── */
            .faq-checkbox {
              position: absolute;
              opacity: 0;
              pointer-events: none;
              width: 0;
              height: 0;
            }

            /* ── Header (question row) ── */
            .faq-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              cursor: pointer;
              user-select: none;
              padding: 16px 0;
              gap: 16px;
            }
            @media (min-width: 1024px) {
              .faq-header {
                padding: 18px 0;
              }
            }

            /* ── Question text ── */
            .faq-question {
              font-size: 14px;
              font-weight: 400;
              color: #4C4C4C;
              line-height: 1.4;
              text-transform: uppercase;
              flex: 1;
            }
            @media (min-width: 1024px) {
              .faq-question {
                font-size: 15px;
                text-transform: none;
              }
            }

            /* ── Chevron icon ── */
            .faq-chevron {
              flex-shrink: 0;
              transition: transform 0.3s ease;
              width: 20px;
              height: 20px;
            }
            @media (min-width: 1024px) {
              .faq-chevron {
                width: 22px;
                height: 22px;
              }
            }

            /* Rotate chevron when open */
            .faq-checkbox:checked ~ .faq-header .faq-chevron {
              transform: rotate(180deg);
            }

            /* ── Answer (collapsible body) ── */
            .faq-answer {
              max-height: 0;
              overflow: hidden;
              transition: max-height 0.35s ease, padding 0.35s ease;
              padding: 0 0 0 0;
            }
            .faq-checkbox:checked ~ .faq-answer {
              max-height: 600px;
              padding-bottom: 16px;
            }
            @media (min-width: 1024px) {
              .faq-checkbox:checked ~ .faq-answer {
                padding-bottom: 20px;
              }
            }

            .faq-answer p {
              font-size: 14px;
              color: #808080;
              line-height: 1.6;
            }
            @media (min-width: 1024px) {
              .faq-answer p {
                font-size: 15px;
                line-height: 1.7;
              }
            }
          `,
        }}
      />
    </div>
  );
}
