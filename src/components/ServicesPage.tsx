"use client";

import {
  ChevronRight,
  Factory,
  Grape,
  PenTool,
  Phone,
  Thermometer,
  Truck,
  Wind,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { firstAlt, firstUrl, SERVICE_FALLBACKS, SERVICE_SLOT, type GalleryState } from "@/lib/gallery";

type Pillar = {
  id: string;
  icon: typeof Wind;
  title: string;
  problem: string;
  solution: string;
  href?: { label: string; to: string };
  image?: string;
};

const pillars: Pillar[] = [
  {
    id: "air-conditioning",
    icon: Wind,
    title: "Air conditioning",
    problem:
      "Homes and workplaces that need air conditioning designed, installed and kept in service.",
    solution:
      "Residential and commercial air conditioning as distinct jobs — design, install, service and maintain for homes and workplaces separately. Panasonic ASC warranty agent and repairs. Panasonic Specialist Air Network dealer.",
    href: { label: "Panasonic specialist support", to: "#panasonic-specialist-support" },
    image: "/images/tile-air-conditioning.webp",
  },
  {
    id: "refrigeration",
    icon: Thermometer,
    title: "Refrigeration",
    problem:
      "Commercial refrigeration — cold rooms and related plant — that needs design, installation or ongoing service.",
    solution:
      "Commercial refrigeration and winery glycol systems — from cold rooms to ammonia plant — plus hire chillers. Design, installation, service and maintenance, including ammonia refrigeration service.",
    href: { label: "Hire chillers and AC", to: "/hire" },
    image: "/images/tile-refrigeration.webp",
  },
  {
    id: "mechanical-services",
    icon: Wrench,
    title: "Mechanical services",
    problem:
      "Commercial and light industrial buildings that need ventilation and compliance work.",
    solution:
      "Ventilation and compliance work across Perth and regional WA: commercial exhaust and fresh air — design, installation, service and maintenance — plus compliance and certification.",
    href: { label: "Enquire about mechanical work", to: "#contact" },
    image: "/images/tile-mechanical.webp",
  },
  {
    id: "winery-refrigeration",
    icon: Grape,
    title: "Winery refrigeration",
    problem:
      "Wineries that need glycol refrigeration designed, installed or serviced.",
    solution:
      "Winery glycol refrigeration — design, installation, service and maintenance.",
    href: { label: "Recent projects", to: "/projects" },
  },
  {
    id: "equipment-hire",
    icon: Truck,
    title: "Equipment hire",
    problem:
      "Short-term air conditioning or chiller capacity for a site or project.",
    solution:
      "Hire air conditioning and chillers across Perth and regional WA. The hire catalogue lists the units we have available.",
    href: { label: "View hire catalogue", to: "/hire" },
  },
  {
    id: "design-install",
    icon: PenTool,
    title: "Design and install",
    problem:
      "A space that needs a system designed and installed, not only a service call.",
    solution:
      "From design and supply through to installation. For commercial refrigeration, room size, insulation, stored goods and daily loading feed the design — the same approach we take for air conditioning and mechanical work.",
    href: { label: "Talk through a design", to: "#contact" },
  },
  {
    id: "maintenance",
    icon: Factory,
    title: "Maintenance",
    problem:
      "Air conditioning or refrigeration that needs servicing, repairs or warranty work.",
    solution:
      "Electrical or gas issues, filters and drains, ice build-up, plus advice on keeping commercial refrigeration in good condition. Warranty repairs and service on Panasonic air conditioning we install.",
    href: { label: "Book a service call", to: "#contact" },
  },
];

export default function ServicesPage({ gallery }: { gallery: GalleryState }) {
  const sectionRef = useRevealOnScroll<HTMLDivElement>();

  return (
    <div ref={sectionRef}>
      <section id="services" className="pt-32 pb-16 bg-[#2665AA] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-3 reveal">
            What we do
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight reveal reveal-delay-1">
            HVAC services across Western Australia
          </h1>
          <p className="text-slate-100 text-lg md:text-xl leading-relaxed max-w-3xl reveal reveal-delay-2">
            Air conditioning, refrigeration and mechanical services — design, install and
            maintain — for residential, commercial and industrial sites across Perth, the South
            West and the Great Southern.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#1a4a82]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              const slot = SERVICE_SLOT[pillar.id];
              const imageSrc = slot
                ? firstUrl(gallery, slot, SERVICE_FALLBACKS[pillar.id] ?? pillar.image ?? "")
                : pillar.image;
              const imageAlt = slot
                ? firstAlt(gallery, slot, pillar.title)
                : pillar.title;
              return (
                <article
                  key={pillar.id}
                  id={pillar.id}
                  className={`reveal reveal-delay-${(i % 3) + 1} rounded-2xl border border-white/20 bg-[#163e6e]/80 overflow-hidden scroll-mt-28 shadow-lg shadow-black/20`}
                >
                  {imageSrc ? (
                    <div className="relative h-44 overflow-hidden img-zoom">
                      <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-xl border border-white/25 bg-black/20 flex items-center justify-center mb-4 text-white">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">{pillar.title}</h2>
                    <p className="text-slate-100 text-sm leading-relaxed mb-3">
                      <span className="text-white/70 uppercase tracking-wide text-xs font-semibold block mb-1">
                        The job
                      </span>
                      {pillar.problem}
                    </p>
                    <p className="text-slate-100 text-sm leading-relaxed mb-5">
                      <span className="text-white/70 uppercase tracking-wide text-xs font-semibold block mb-1">
                        How we help
                      </span>
                      {pillar.solution}
                    </p>
                    {pillar.href ? (
                      pillar.href.to.startsWith("/") ? (
                        <Link
                          href={pillar.href.to}
                          className="text-sm font-semibold text-[#c5e4f7] hover:text-white hover:underline inline-flex items-center gap-1"
                        >
                          {pillar.href.label}
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <a
                          href={pillar.href.to}
                          className="text-sm font-semibold text-[#c5e4f7] hover:text-white hover:underline inline-flex items-center gap-1"
                        >
                          {pillar.href.label}
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      )
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>

          <div
            id="panasonic-specialist-support"
            className="reveal mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-white/20 bg-black/20 px-6 py-5 scroll-mt-28"
          >
            <Image
              src="/images/panasonic-logo.svg"
              alt="Panasonic"
              width={160}
              height={32}
              unoptimized
              className="h-7 sm:h-8 w-auto shrink-0 brightness-0 invert opacity-95"
            />
            <div className="flex-1">
              <h2 className="text-white font-semibold text-lg">Panasonic specialist support</h2>
              <p className="text-slate-100 text-sm mt-1">
                Panasonic ASC warranty agent and repairs. Panasonic Specialist Air Network
                dealer. Warranty work and service on Panasonic air conditioning we install —
                residential and commercial — plus design, installation, spare parts and
                maintenance on Panasonic HVAC equipment.
              </p>
            </div>
            <a
              href="#contact"
              className="shrink-0 text-sm font-semibold text-[#c5e4f7] hover:text-white transition-colors"
            >
              Warranty enquiry →
            </a>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl border border-white/20 bg-black/20 px-6 py-6 reveal">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Need the plant, not a quote for new gear?</h2>
              <p className="text-slate-100 text-sm max-w-xl">
                Short-term air conditioning and chiller hire is listed separately, with the units
                we have available.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/hire"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-colors"
              >
                Equipment hire
              </Link>
              <a
                href="tel:0892423111"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold"
              >
                <Phone className="w-4 h-4" />
                (08) 9242 3111
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
