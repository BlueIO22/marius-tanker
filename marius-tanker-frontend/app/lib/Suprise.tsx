import JSConfetti from "js-confetti";
import { useMemo } from "react";

export default function Suprise({ counter }: { counter: number }) {
  useMemo(() => {
    const jsConfetti = new JSConfetti();
    if (counter > 29) {
      jsConfetti?.addConfetti({
        emojis: ["👨‍💻", "👩‍💻", "💻", "🖥️", "📱", "🖱️", "⌨️"],
        confettiNumber: 10,
      });
    }
  }, [counter]);

  return <></>;
}
