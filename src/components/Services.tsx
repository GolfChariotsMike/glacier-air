import { Wind, Thermometer, Wrench, ChevronRight } from "lucide-react";

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
    image:
      "https://glacierair.com.au/wp-content/uploads/2022/10/for-WEB-152-High-St-Fremantle-7.jpeg",
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
    image:
      "https://glacierair.com.au/wp-content/uploads/2022/10/received_224653333086044.jpeg",
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
    image:
      "https://glacierair.com.au/wp-content/uploads/2022/10/for-WEB-152-High-St-Fremantle-13.jpeg",
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:bg-blue-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 group-hover:bg-cyan-500/20",
  indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:bg-indigo-500/20",
};

const accentMap: Record<string, string> = {
  blue: "text-blue-400",
  cyan: "text-cyan-400",
  indigo: "text-indigo-400",
};

export default function Services() {
  return (
    <section id="services" className="py-24 bg-[#0a0f1e]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
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
          {services.map((svc) => {
            const Icon = svc.icon;
            const iconClass = colorMap[svc.color];
            const accentClass = accentMap[svc.color];
            return (
              <div
                key={svc.title}
                className="group rounded-2xl border border-white/5 bg-white/3 hover:bg-white/5 overflow-hidden transition-all duration-300 hover:border-white/10 hover:-translate-y-1"
                style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              >
                {/* Image */}
                <div className="h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={svc.image}
                    alt={svc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 transition-colors ${iconClass}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {svc.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                    {svc.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                        <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${accentClass}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className={`text-sm font-semibold ${accentClass} hover:underline flex items-center gap-1`}
                  >
                    Get a quote <ChevronRight className="w-4 h-4" />
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
