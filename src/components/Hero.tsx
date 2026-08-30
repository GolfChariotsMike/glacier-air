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

  // Light snowflake overlay — same density/speed family as the old dots
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let viewW = 0;
    let viewH = 0;

    const resize = () => {
      const section = canvas.parentElement;
      viewW = section ? section.offsetWidth : window.innerWidth;
      viewH = section ? section.offsetHeight : window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(viewW * dpr);
      canvas.height = Math.round(viewH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 55;
    const flakes = Array.from({ length: count }, () => ({
      x: Math.random() * viewW,
      y: Math.random() * viewH,
      // Large enough for 6-fold arms to read; still a light overlay
      r: Math.random() * 4.2 + 2.4,
      speed: Math.random() * 0.35 + 0.1,
      opacity: Math.random() * 0.4 + 0.1,
      drift: (Math.random() - 0.5) * 0.18,
      sway: Math.random() * 0.35 + 0.15,
      phase: Math.random() * Math.PI * 2,
      spin: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.012,
    }));

    const drawSnowflake = (
      x: number,
      y: number,
      size: number,
      rotation: number,
      opacity: number,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.strokeStyle = `rgba(147, 197, 253, ${opacity})`;
      ctx.fillStyle = `rgba(147, 197, 253, ${opacity})`;
      ctx.lineWidth = Math.max(0.7, size * 0.14);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const step = Math.PI / 3;
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate(i * step);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -size);
        // Side prongs so it reads as a flake, not a plus sign
        const mid = -size * 0.52;
        const prong = size * 0.38;
        ctx.moveTo(0, mid);
        ctx.lineTo(-prong, mid - prong * 0.55);
        ctx.moveTo(0, mid);
        ctx.lineTo(prong, mid - prong * 0.55);
        if (size > 4.4) {
          const inner = -size * 0.28;
          const innerLen = size * 0.2;
          ctx.moveTo(0, inner);
          ctx.lineTo(-innerLen, inner - innerLen * 0.45);
          ctx.moveTo(0, inner);
          ctx.lineTo(innerLen, inner - innerLen * 0.45);
        }
        ctx.stroke();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(0, 0, Math.max(0.5, size * 0.1), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, viewW, viewH);
      flakes.forEach((p) => {
        drawSnowflake(p.x, p.y, p.r, p.spin, p.opacity);
        p.y += p.speed;
        p.phase += 0.012;
        p.x += p.drift + Math.sin(p.phase) * p.sway * 0.35;
        p.spin += p.spinSpeed;
        if (p.y > viewH + 10) {
          p.y = -10;
          p.x = Math.random() * viewW;
        }
        if (p.x < -10) p.x = viewW + 10;
        if (p.x > viewW + 10) p.x = -10;
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

      {/* Snowflakes */}
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
