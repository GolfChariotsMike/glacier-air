import { ArrowRight, CheckCircle2 } from "lucide-react";

const badges = ["ARC Licence AU18839", "AIRAH Member", "HIA Member", "Family Owned"];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Cover-fit is width-locked on desktop, so translate the plant off the type. */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-[position:65%_center] md:bg-center md:translate-x-[28%]"
          style={{ backgroundImage: "url('/images/hero-bg.webp')" }}
        />
      </div>
      {/* Left-to-right veil for type; bottom fade into the page */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050a18]/95 via-[#050a18]/72 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full badge-shimmer border border-blue-500/25 text-blue-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Perth, SouthWest & Great Southern WA
          </div>

          <h1 className="mb-6">
            <span className="block text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Experts in
            </span>
            <span className="block mt-1 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight gradient-text">
              Air Conditioning &amp; Refrigeration
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
