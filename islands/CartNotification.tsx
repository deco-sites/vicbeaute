import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { clx } from "../sdk/clx.ts";

export default function CartNotification() {
  const visible = useSignal(false);
  const message = useSignal("");
  const prevCount = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const isHydrated = useRef(false);

  useEffect(() => {
    const showMessage = (text: string) => {
      message.value = text;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      visible.value = true;
      timeoutRef.current = setTimeout(() => {
        visible.value = false;
      }, 3000);
    };

    const updateLogic = () => {
      if (!window.STOREFRONT?.CART) return;

      const cart = window.STOREFRONT.CART.getCart();
      const count = (cart?.items ?? []).length;

      // 1. Inicialização: No primeiro momento em que o SDK responde, 
      // salvamos o contador e encerramos sem notificar.
      if (prevCount.current === null) {
        prevCount.current = count;
        // Tempo mínimo para considerar o estado de "load" terminado
        setTimeout(() => { isHydrated.current = true; }, 500);
        return;
      }

      // 2. Mudança: Se o contador mudou e o sistema já passou do load inicial...
      if (count !== prevCount.current) {
        if (isHydrated.current) {
          if (count > prevCount.current) {
            showMessage("Adicionado ao carrinho!");
          } else {
            showMessage("Removido do carrinho!");
          }
        }
        // Atualiza SEMPRE o contador para estar pronto para a próxima ação
        prevCount.current = count;
      }
    };

    // Monitoramento híbrido (Polling para velocidade + Subscribe para eventos)
    const interval = setInterval(updateLogic, 100);

    // Subscrição para garantir que mudanças enviadas pelo SDK não escapem
    let unsubscribe: (() => void) | null = null;
    const subInterval = setInterval(() => {
      if (window.STOREFRONT?.CART) {
        unsubscribe = window.STOREFRONT.CART.subscribe(updateLogic);
        clearInterval(subInterval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(subInterval);
      if (unsubscribe) unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      class={clx(
        "fixed bottom-12 left-1/2 -translate-x-1/2 z-[10000] transition-all duration-500 ease-out",
        visible.value 
          ? "translate-y-0 opacity-100" 
          : "translate-y-20 opacity-0 pointer-events-none"
      )}
    >
      <div class="bg-[#fcfcfc]/95 backdrop-blur-md px-12 py-4 rounded-xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] min-w-[300px] flex items-center justify-center border-none">
        <p class="font-Hanken-Grotesk text-[#4d5d49] text-[16px] font-semibold tracking-[0.03em] whitespace-nowrap">
          {message.value}
        </p>
      </div>
    </div>
  );
}
