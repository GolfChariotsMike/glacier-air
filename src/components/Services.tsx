"use client";
import { Wind, Thermometer, Wrench, ChevronRight, ShieldCheck } from "lucide-react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const specialisms = [
  "Commercial Air Conditioning",
  "Residential Air Conditioning",
  "Commercial Refrigeration",
  "Mechanical Services",
  "Winery Refrigeration",
  "Panasonic Warranty Repairs",
];

const services = [
  {
    id: "air-conditioning",
    icon: Wind,
    title: "Air Conditioning",
    color: "blue",
    description:
      "Residential and commercial air conditioning as distinct jobs — design, install, service and maintain for homes and workplaces separately.",
    features: [
      "Residential air conditioning — design, installation, service and maintenance",
      "Commercial air conditioning — design, installation, service and maintenance",
      "Panasonic authorised warranty agent and repairer",
      "Hire air conditioning solutions",
    ],
    image: "/images/tile-air-conditioning.jpg",
  },
  {
    id: "refrigeration",
    icon: Thermometer,
    title: "Refrigeration",
    color: "cyan",
    description:
      "Commercial refrigeration and winery glycol systems — from cold rooms to ammonia plant — plus hire chillers.",
    features: [
      "Commercial refrigeration — design, installation, service and maintenance",
      "Winery glycol refrigeration — design, installation, service and maintenance",
      "Ammonia refrigeration service and maintenance",
      "Hire chillers",
    ],
    image: "/images/tile-refrigeration.jpg",
  },
  {
    id: "mechanical-services",
    icon: Wrench,
    title: "Mechanical Services",
    color: "indigo",
    description:
      "Ventilation and compliance work for commercial and light industrial buildings across Perth and regional WA.",
    features: [
      "Commercial exhaust — design, installation, service and maintenance",
      "Fresh air — design, installation, service and maintenance",
      "Compliance and certification",
    ],
    image: "/images/tile-mechanical.jpg",
  },
];

const colorMap: Record<string, { icon: string; accent: string; glow: string }> = {
  blue:   { icon: "bg-blue-500/10 text-blue-400 border-blue-500/20",   accent: "text-blue-400",   glow: "hover:shadow-blue-500/10" },
  cyan:   { icon: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",   accent: "text-cyan-400",   glow: "hover:shadow-cyan-500/10" },
  indigo: { icon: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", accent: "text-indigo-400", glow: "hover:shadow-indigo-500/10" },
};

export default function Services() {
  const sectionRef = useRevealOnScroll();

  return (
    <section id="services" className="py-24 pt-28 bg-[#0d1528] border-t border-white/[0.06]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            We specialise in
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Services
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-4xl mx-auto leading-relaxed uppercase tracking-wide">
            {specialisms.join(" – ")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            const c = colorMap[svc.color];
            return (
              <div
                key={svc.title}
                id={svc.id}
                className={`reveal reveal-delay-${i + 1} glow-card group rounded-2xl border border-white/5 overflow-hidden hover:shadow-2xl scroll-mt-28 ${c.glow}`}
                style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              >
                <div className="h-48 overflow-hidden img-zoom">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={svc.image}
                    alt={svc.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 transition-all duration-300 ${c.icon}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{svc.title}</h3>
                  <p className="text-slate-400 text-sm mb-5 leading-relaxed">{svc.description}</p>

                  <ul className="space-y-2 mb-6">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                        <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${c.accent}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className={`text-sm font-semibold ${c.accent} hover:underline flex items-center gap-1 group/link`}
                  >
                    Enquire about this service{" "}
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="reveal mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">Panasonic authorised warranty agent and repairer</p>
            <p className="text-slate-400 text-sm mt-1">
              Warranty repairs and service on Panasonic air conditioning we install — residential and commercial.
            </p>
          </div>
          <a
            href="#contact"
            className="shrink-0 text-sm font-semibold text-blue-300 hover:text-white transition-colors"
          >
            Warranty enquiry →
          </a>
        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-10 reveal">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Commercial air conditioning</h3>
            <p className="text-slate-400 leading-relaxed">
              Commercial air conditioning is widely used in industrial and commercial spaces.
              A suitable working environment improves comfort in both winter and summer.
              We find a solution for the space — office, warehouse or retail.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Commercial refrigeration</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Commercial refrigeration — cold rooms — is used in hospitality: restaurants, bars
              and wineries. We design, install, maintain and repair systems for different sizes
              and needs.
            </p>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-white font-semibold mb-1">Design</p>
                <p className="text-slate-400 leading-relaxed">
                  Room size, insulation, stored goods (fruit, vegetables, dairy, meat) and daily
                  loading all feed the design. Thermal insulation of walls and ceiling determines
                  how the cool room performs.
                </p>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Installation</p>
                <p className="text-slate-400 leading-relaxed">
                  Walk-in fridge, wine cooler or commercial freezer — we install for restaurants,
                  bars and similar sites.
                </p>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Maintenance and repairs</p>
                <p className="text-slate-400 leading-relaxed">
                  Electrical or gas issues, filters and drains, ice build-up — plus advice on
                  keeping commercial refrigeration in good condition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
