"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const badges = ["ARC Licence AU18839", "AIRAH Member", "HIA Member", "Family Owned"];
const typewriterWords = [
  "Air Conditioning",
  "Refrigeration",
  "Mechanical Services",
  "HVAC Design",
];

const serviceTiles = [
  {
    title: "Air Conditioning",
    href: "#air-conditioning",
    image: "/images/tile-air-conditioning.jpg",
  },
  {
    title: "Refrigeration",
    href: "#refrigeration",
    image: "/images/tile-refrigeration.jpg",
  },
  {
    title: "Mechanical Services",
    href: "#mechanical-services",
    image: "/images/tile-mechanical.jpg",
  },
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

export default function Hero() {
  const { text: typedText, showCursor } = useTypewriter(typewriterWords);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="hero-kenburns absolute inset-0 bg-cover bg-no-repeat bg-[position:54%_center]"
          style={{ backgroundImage: "url('/images/hero-bg.webp')" }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#050a18]/80 via-[#050a18]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050a18]/80 via-transparent to-transparent" />

      <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto w-full px-6 pt-24 pb-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full badge-shimmer border border-blue-500/25 text-blue-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-[#E01F26] animate-pulse motion-reduce:animate-none" />
            Perth, SouthWest & Great Southern WA
          </div>

          <h1 className="mb-6">
            <span className="sr-only">
              Experts in air conditioning, refrigeration, mechanical services and HVAC design
            </span>
            <span aria-hidden="true">
              <span className="block text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-2">
                Experts in
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold min-h-[1.2em] whitespace-nowrap">
                <span className="gradient-text">{typedText}</span>
                {showCursor && <span className="cursor" />}
              </span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
            Family-owned specialists in air conditioning, refrigeration and
            mechanical services. We design, install and maintain systems that
            keep your space comfortable — residential to commercial.
          </p>

          <div className="flex items-center gap-4 mb-10">
            {["Design", "Install", "Maintain"].map((t, i) => (
              <span key={t} className="flex items-center gap-3 text-sm font-semibold text-slate-300 uppercase tracking-widest">
                {i > 0 && <span className="w-1 h-1 rounded-full bg-blue-400/60" />}
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Get a Free Quote <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 hover:border-white/30 text-white font-semibold text-lg transition-all duration-300 hover:bg-white/5 motion-reduce:transition-none"
            >
              Our Services
            </a>
          </div>

          <div className="flex flex-wrap gap-5">
            {badges.map((b) => (
              <div key={b} className="flex items-center gap-1.5 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-8 md:-mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
          {serviceTiles.map((tile) => (
            <a
              key={tile.title}
              href={tile.href}
              className="group relative min-w-0 h-44 md:h-48 overflow-hidden rounded-2xl ring-1 ring-white/15"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tile.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050a18]/90 via-[#050a18]/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-white font-semibold text-lg leading-tight">{tile.title}</p>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
                  Learn more <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
