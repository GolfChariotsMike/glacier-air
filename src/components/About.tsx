import { Award, Users, MapPin, Clock } from "lucide-react";
import Image from "next/image";

const stats = [
  { icon: Award, label: "ARC Licensed", value: "AU18839" },
  { icon: Users, label: "Family Owned", value: "& Operated" },
  { icon: MapPin, label: "WA Coverage", value: "Perth + SW" },
  { icon: Clock, label: "Fast Response", value: "Times" },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-[#060c1a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden h-64 col-span-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/fremantle-16.webp"
                  alt="Glacier Air team at work"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-44">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/about-1.webp"
                  alt="Refrigeration installation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-44">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/about-2.webp"
                  alt="AC installation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-blue-500 rounded-2xl px-6 py-4 shadow-xl shadow-blue-500/30">
              <p className="text-white text-3xl font-bold">AIRAH</p>
              <p className="text-blue-100 text-xs font-medium">& HIA Member</p>
            </div>
          </div>

          {/* Right — content */}
          <div>
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
              About Us
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              WA&apos;s Trusted{" "}
              <span className="gradient-text">HVAC Specialists</span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              Glacier Air is a family-owned air conditioning and refrigeration
              company based in Perth. We provide expert services across the
              metropolitan area, SouthWest and the Great Southern region of
              Western Australia.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              We pride ourselves on excellent service, fast response times, and
              sound technical knowledge. From design and supply through to
              installation, servicing and maintenance — we handle every stage
              for all types of refrigeration and air conditioning systems.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/3 border border-white/5"
                    style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg leading-none">
                        {s.value}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              Work With Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
