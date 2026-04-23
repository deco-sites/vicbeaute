import { useEffect } from "preact/hooks";

export interface Props {
  rootId: string;
}

export default function TabbedSliderJS({ rootId }: Props) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;

    const buttons = root.querySelectorAll<HTMLButtonElement>(
      "[data-tab-button]",
    );
    const contents = root.querySelectorAll<HTMLDivElement>(
      "[data-tab-content]",
    );

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-tab-button");

        // Hide all contents
        contents.forEach((c) => {
          c.classList.add("hidden");
          c.classList.remove("block");
        });

        // Show target content
        const activeContent = root.querySelector(
          `[data-tab-content="${index}"]`,
        );
        if (activeContent) {
          activeContent.classList.remove("hidden");
          activeContent.classList.add("block");
        }

        // Reset all buttons styling
        buttons.forEach((b) => {
          b.classList.remove(
            "border-[#455C42]",
            "text-[#455C42]",
            "font-medium",
          );
          b.classList.add("border-transparent", "text-[#8a8a8a]");
        });

        // Set active button styling
        btn.classList.remove("border-transparent", "text-[#8a8a8a]");
        btn.classList.add("border-[#455C42]", "text-[#455C42]", "font-medium");

        // Disparar resize window para que o SliderJS recalcule o layout/snapping dos cards do produto recém revelado.
        setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
        }, 50);
      });
    });
  }, [rootId]);

  return <div data-tabbed-slider-js />;
}
