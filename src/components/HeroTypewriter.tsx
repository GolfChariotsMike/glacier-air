"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const typewriterWords = [
  "Air Conditioning",
  "Refrigeration",
  "Mechanical Services",
  "HVAC Design",
];

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

function useTypewriter(words: string[]) {
  const reduceMotion = usePrefersReducedMotion();
  const [text, setText] = useState(words[0]);
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;

    const current = words[wordIndex % words.length];
    let delay = isDeleting ? 40 : 70;
    if (!isDeleting && text === current) delay = 1800;
    if (isDeleting && text === "") delay = 280;

    const timeout = setTimeout(() => {
      if (!isDeleting && text === current) {
        setIsDeleting(true);
        return;
      }
      if (isDeleting && text === "") {
        setIsDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
        return;
      }
      setText(
        isDeleting
          ? current.slice(0, text.length - 1)
          : current.slice(0, text.length + 1)
      );
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, reduceMotion]);

  return { text: reduceMotion ? words[0] : text, showCursor: !reduceMotion };
}

/** Isolated island so typewriter ticks do not re-render LCP copy. */
export default function HeroTypewriter() {
  const { text: typedText, showCursor } = useTypewriter(typewriterWords);

  return (
    <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold min-h-[1.2em] whitespace-nowrap">
      <span className="gradient-text">{typedText}</span>
      {showCursor && <span className="cursor" />}
    </span>
  );
}
