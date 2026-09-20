import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import HeroTypewriter from "@/components/HeroTypewriter";

const badges = ["ARC Licence AU18839", "AIRAH Member", "HIA Member", "Family Owned"];

export default function Hero({
  imageSrc = "/images/hero-bg.webp",
  imageAlt = "Rooftop air conditioning",
}: {
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-kenburns absolute inset-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, 100vw"
            quality={70}
            loading="eager"
            fetchPriority="low"
            className="object-cover object-[54%_center]"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#050a18]/80 via-[#050a18]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050a18]/80 via-transparent to-transparent" />

      <div className="relative z-10 flex min-h-screen items-center max-w-7xl mx-auto w-full px-6 pt-24 pb-16">
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
              <HeroTypewriter />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
            Family-owned specialists in air conditioning, refrigeration and
            mechanical services. We design, install and maintain systems that
            create reliable, climate-controlled environments for residential,
            commercial and industrial spaces.
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
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Make Enquiry <ArrowRight className="w-5 h-5" />
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
    </section>
  );
}
