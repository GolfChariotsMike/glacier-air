import { ArrowRight, CheckCircle2 } from "lucide-react";

const badges = ["ARC Licence AU18839", "AIRAH Member", "HIA Member", "Family Owned"];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://glacierair.com.au/wp-content/uploads/2022/10/for-WEB-152-High-St-Fremantle-19.jpeg')",
        }}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050a18]/90 via-[#050a18]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent" />

      {/* Floating blue orb */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-2xl">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Perth, SouthWest & Great Southern WA
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Experts in{" "}
            <span className="gradient-text">Air & Refrigeration</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
            Family-owned specialists in air conditioning, refrigeration and
            mechanical services. We design, install and maintain systems that
            keep your space comfortable — residential to commercial.
          </p>

          {/* Tagline */}
          <div className="flex items-center gap-4 mb-10">
            {["Design", "Install", "Maintain"].map((t, i) => (
              <span key={t} className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-widest">
                {i > 0 && <span className="w-1 h-1 rounded-full bg-blue-400" />}
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-lg transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
            >
              Get a Free Quote <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 hover:border-white/30 text-white font-semibold text-lg transition-all hover:bg-white/5"
            >
              Our Services
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4">
            {badges.map((b) => (
              <div key={b} className="flex items-center gap-1.5 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phone number floating card */}
      <a
        href="tel:0892423111"
        className="absolute bottom-8 right-6 hidden lg:flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 hover:bg-white/10 transition-colors group"
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
