"use client";
import { Wind, Thermometer, Wrench, ChevronRight } from "lucide-react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const services = [
  {
    icon: Wind,
    title: "Air Conditioning",
    color: "blue",
    description:
      "Residential and commercial air conditioning solutions across Perth and WA. Split systems, ducted, multi-head — we do it all.",
    features: [
      "Split system supply & install",
      "Ducted AC systems",
      "Multi-head/VRF systems",
      "Preventive maintenance",
      "Service & repairs",
    ],
    image: "/images/fremantle-7.webp",
  },
  {
    icon: Thermometer,
    title: "Refrigeration",
    color: "cyan",
    description:
      "Commercial and industrial refrigeration including winery systems. Temperature-critical environments done right.",
    features: [
      "Commercial cool rooms",
      "Winery refrigeration systems",
      "Industrial freezer rooms",
      "Display cabinet installs",
      "Emergency breakdown response",
    ],
    image: "/images/refrigeration.webp",
  },
  {
    icon: Wrench,
    title: "Mechanical Services",
    color: "indigo",
    description:
      "End-to-end mechanical services for commercial and light industrial buildings. Design through to ongoing maintenance.",
    features: [
      "HVAC design & consulting",
      "Mechanical system installation",
      "Scheduled maintenance contracts",
      "Compliance & inspections",
      "Energy efficiency audits",
    ],
    image: "/images/fremantle-13.webp",
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
    <section id="services" className="py-24 bg-[#0d1528] border-t border-white/[0.06]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            What We Do
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Services
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From design to installation to long-term maintenance — we cover the
            full lifecycle of your air and refrigeration systems.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            const c = colorMap[svc.color];
            return (
              <div
                key={svc.title}
                className={`reveal reveal-delay-${i + 1} glow-card group rounded-2xl border border-white/5 overflow-hidden hover:shadow-2xl ${c.glow}`}
                style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              >
                {/* Image */}
                <div className="h-48 overflow-hidden img-zoom">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={svc.image}
                    alt={svc.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  {/* Icon */}
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
                    Get a quote{" "}
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
