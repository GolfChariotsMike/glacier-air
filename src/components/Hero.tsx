"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const badges = ["ARC Licence AU18839", "AIRAH Member", "HIA Member", "Family Owned"];
const typewriterWords = ["Air Conditioning", "Refrigeration", "Mechanical Services", "HVAC Design"];

function useTypewriter(words: string[]) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;

    const current = words[wordIndex];
    const speed = isDeleting ? 40 : 70;

    const timeout = setTimeout(() => {
      // Finished typing the last word — stop
      if (!isDeleting && text === current && wordIndex === words.length - 1) {
        setDone(true);
        return;
      }
      if (!isDeleting && text === current) {
        setTimeout(() => setIsDeleting(true), 800);
        return;
      }
      if (isDeleting && text === "") {
        setIsDeleting(false);
        setWordIndex((i) => i + 1);
        return;
      }
      setText(isDeleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, done]);

  return { text, done };
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { text: typedText, done: typewriterDone } = useTypewriter(typewriterWords);

  // Floating particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      const section = canvas.parentElement;
      canvas.width = section ? section.offsetWidth : window.innerWidth;
      canvas.height = section ? section.offsetHeight : window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 55;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.35 + 0.1,
      opacity: Math.random() * 0.4 + 0.1,
      drift: (Math.random() - 0.5) * 0.3,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${p.opacity})`;
        ctx.fill();
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -5) {
          p.y = canvas.height + 5;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-bg.webp')" }}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050a18]/95 via-[#050a18]/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent" />

      {/* Aurora layer */}
      <div className="aurora" />

      {/* Particles */}
      <canvas ref={canvasRef} id="particle-canvas" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "6s" }} />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-cyan-500/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-2xl">
          {/* Animated pill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full badge-shimmer border border-blue-500/25 text-blue-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Perth, SouthWest & Great Southern WA
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
            Experts in
          </h1>

          {/* Typewriter line — nowrap prevents layout shift on long words */}
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 min-h-[1.2em] whitespace-nowrap">
            <span className="gradient-text">{typedText}</span>
            {!typewriterDone && <span className="cursor" />}
          </div>

          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
            Family-owned specialists in air conditioning, refrigeration and
            mechanical services. We design, install and maintain systems that
            keep your space comfortable — residential to commercial.
          </p>

          {/* Design · Install · Maintain */}
          <div className="flex items-center gap-4 mb-10">
            {["Design", "Install", "Maintain"].map((t, i) => (
              <span key={t} className="flex items-center gap-3 text-sm font-semibold text-slate-300 uppercase tracking-widest">
                {i > 0 && <span className="w-1 h-1 rounded-full bg-blue-400/60" />}
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get a Free Quote <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 hover:border-white/30 text-white font-semibold text-lg transition-all duration-300 hover:bg-white/5"
            >
              Our Services
            </a>
          </div>

          {/* Trust badges */}
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

      {/* Phone floating card */}
      <a
        href="tel:0892423111"
        className="absolute bottom-8 right-6 hidden lg:flex items-center gap-3 glass-panel rounded-2xl px-5 py-4 hover:border-blue-500/20 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/40"
      >
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <span className="text-blue-400 text-lg">📞</span>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Call us today</p>
          <p className="text-white font-semibold group-hover:text-blue-400 transition-colors">
            (08) 9242 3111
          </p>
        </div>
      </a>
    </section>
  );
}
