import JSConfetti from "js-confetti";
import { useEffect } from "react";

export default function Suprise({ counter }: { counter: number }) {
  useEffect(() => {
    const jsConfetti = new JSConfetti();
    if (counter > 29) {
      jsConfetti?.addConfetti({
        emojis: ["👨‍💻", "👩‍💻", "💻", "🖥️", "📱", "🖱️", "⌨️"],
      });
    }
  }, [counter]);

  return <></>;
}
