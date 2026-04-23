import { asset, Head } from "$fresh/runtime.ts";
import { defineApp } from "$fresh/server.ts";
import { useScript } from "@deco/deco/hooks";
import { Context } from "@deco/deco";
import CartNotification from "../islands/CartNotification.tsx";
const serviceWorkerScript = () =>
  addEventListener("load", () =>
    navigator && navigator.serviceWorker &&
    navigator.serviceWorker.register("/sw.js"));
export default defineApp(async (_req, ctx) => {
  const revision = await Context.active().release?.revision();
  return (
    <>
      {/* Include Icons and manifest */}
      <Head>
        {/* Enable View Transitions API */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              let lastScrollY = 0;

              document.addEventListener('htmx:configRequest', (e) => {
                lastScrollY = window.scrollY; // Salva a posição exata antes do clique
                if (e.detail.target) {
                  e.detail.target.scrollIntoView = () => {};
                }
              });
              document.addEventListener('htmx:beforeSwap', (e) => {
                e.detail.shouldScroll = false;
              });
              document.addEventListener('htmx:afterSwap', (e) => {
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
                // Força a restauração para a posição original após a troca
                window.scrollTo(0, lastScrollY);
              });
              document.addEventListener('htmx:historyRestore', (e) => {
                e.detail.shouldScroll = false;
              });
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Estabilização Global: O Root não se mexe */
              ::view-transition-group(root) {
                animation-duration: 0s !important;
              }

              /* Ativa transição suave apenas para o item que está sendo trocado (Shelf e PDP) */
              .htmx-swapping figure, .htmx-added figure,
              .htmx-swapping #product-gallery, .htmx-added #product-gallery {
                 view-transition-name: product-gallery;
              }
              .htmx-swapping .card-body, .htmx-added .card-body,
              .htmx-swapping #product-info, .htmx-added #product-info {
                 view-transition-name: product-info;
              }

              /* Crossfade Sedoso para as Informações (Direita) */
              ::view-transition-old(product-info),
              ::view-transition-old(product-info-mobile) {
                animation: 400ms cubic-bezier(0.4, 0, 0.2, 1) both fade-out;
              }

              ::view-transition-new(product-info),
              ::view-transition-new(product-info-mobile) {
                animation: 500ms cubic-bezier(0.4, 0, 0.2, 1) both fade-in;
              }

              /* Efeito de "Surgir" Luxuoso para a Galeria (Esquerda) */
              ::view-transition-old(product-gallery) {
                animation: 400ms ease-out both fade-out;
              }

              ::view-transition-new(product-gallery) {
                animation: 800ms cubic-bezier(0.16, 1, 0.3, 1) both emerge-up;
              }

              @keyframes emerge-up {
                from { 
                  opacity: 0;
                  transform: translateY(40px);
                  filter: blur(8px);
                }
                to { 
                  opacity: 1;
                  transform: translateY(0);
                  filter: blur(0);
                }
              }

              @keyframes fade-out { to { opacity: 0; } }
              @keyframes fade-in { from { opacity: 0; } }

              #product-content-area {
                min-height: 600px;
                contain: layout;
              }

              html, body {
                overscroll-behavior: none;
              }
            `,
          }}
        />

        {/* Tailwind v3 CSS file */}
        <link
          href={asset(`/styles.css?revision=${revision}`)}
          rel="stylesheet"
        />

        {/* Web Manifest */}
        <link rel="manifest" href={asset("/site.webmanifest")} />

        {/* Widde Video Widget */}
        <script
          type="text/javascript"
          async
          src="https://cdn.widde.io/widde.1.1.0.js?v=1.0"
        >
        </script>
      </Head>

      {/* Rest of Preact tree */}
      <ctx.Component />

      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(serviceWorkerScript) }}
      />

      {/* Notificações globais de carrinho */}
      <CartNotification />
    </>
  );
});
