"use client";
import { Award, Users, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { ABOUT_FALLBACKS, firstAlt, firstUrl, type GalleryState } from "@/lib/gallery";

const stats = [
  { icon: Award, label: "ARC Licensed", value: "AU18839", isText: true },
  { icon: Users, label: "Family Owned", value: "& Operated", isText: true },
  { icon: MapPin, label: "WA Coverage", value: "Perth + SW", isText: true },
  { icon: Clock, label: "Fast Response", value: "Times", isText: true },
];

export default function About({ gallery }: { gallery: GalleryState }) {
  const sectionRef = useRevealOnScroll();

  return (
    <section id="about-us" className="py-24 bg-[#060c1a] scroll-mt-24" ref={sectionRef}>
      <div id="about" className="max-w-7xl mx-auto px-6 scroll-mt-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — images */}
          <div className="relative reveal">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden h-64 col-span-2 img-zoom ring-1 ring-white/5">
                <Image
                  src={firstUrl(gallery, "about-main", ABOUT_FALLBACKS.main.src)}
                  alt={firstAlt(gallery, "about-main", ABOUT_FALLBACKS.main.alt)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden h-44 img-zoom ring-1 ring-white/5">
                <Image
                  src={firstUrl(gallery, "about-left", ABOUT_FALLBACKS.left.src)}
                  alt={firstAlt(gallery, "about-left", ABOUT_FALLBACKS.left.alt)}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden h-44 img-zoom ring-1 ring-white/5">
                <Image
                  src={firstUrl(gallery, "about-right", ABOUT_FALLBACKS.right.src)}
                  alt={firstAlt(gallery, "about-right", ABOUT_FALLBACKS.right.alt)}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl px-6 py-4 shadow-xl shadow-blue-500/40">
              <p className="text-white text-3xl font-bold">AIRAH</p>
              <p className="text-blue-100 text-xs font-medium">& HIA Member</p>
            </div>
          </div>

          {/* Right — content */}
          <div>
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3 reveal">
              About Us
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight reveal reveal-delay-1">
              WA&apos;s Trusted{" "}
              <span className="gradient-text">HVAC Specialists</span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-6 reveal reveal-delay-2">
              Glacier Air is a family-owned air conditioning and refrigeration
              company based in Perth. We provide expert services across the
              metropolitan area, SouthWest and the Great Southern region of
              Western Australia.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8 reveal reveal-delay-2">
              We pride ourselves on excellent service, fast response times, and
              sound technical knowledge. From design and supply through to
              installation, servicing and maintenance — we handle every stage
              for all types of refrigeration and air conditioning systems.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-8 reveal reveal-delay-3">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="flex items-start gap-3 p-4 rounded-xl glass-panel hover:border-blue-500/20 transition-all duration-300 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0 group-hover:bg-blue-500/25 transition-colors">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg leading-none stat-counter">
                        {s.value}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-8">
              <Image
                src="/images/badges/airah.jpg"
                alt="AIRAH member"
                width={56}
                height={56}
                className="h-14 w-14 rounded-lg object-contain bg-white p-1"
              />
              <Image
                src="/images/badges/arc.jpg"
                alt="ARC licence AU18839"
                width={56}
                height={56}
                className="h-14 w-14 rounded-lg object-contain bg-white p-1"
              />
              <Image
                src="/images/badges/hia.jpg"
                alt="HIA member"
                width={56}
                height={56}
                className="h-14 w-14 rounded-lg object-contain bg-white p-1"
              />
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 reveal reveal-delay-4"
            >
              Work With Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
