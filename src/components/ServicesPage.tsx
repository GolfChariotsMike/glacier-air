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
      "Offices, shops and homes that run too hot, too cold, or on plant that is past its service life.",
    solution:
      "We design, install and maintain residential and commercial air conditioning as separate jobs — the right capacity for the space, then the servicing to keep it that way. Panasonic ASC warranty agent and Specialist Air Network dealer.",
    href: { label: "Panasonic specialist support", to: "#panasonic-specialist-support" },
    image: "/images/tile-air-conditioning.webp",
  },
  {
    id: "refrigeration",
    icon: Thermometer,
    title: "Refrigeration",
    problem:
      "Cold rooms and commercial plant that cannot hold temperature, keep up with loading, or wait on a long parts delay.",
    solution:
      "Commercial refrigeration — cool rooms, freezers and related plant — from design through installation, service and maintenance. We also service ammonia refrigeration and can place a hire chiller on site when you need temporary capacity.",
    href: { label: "Hire chillers and AC", to: "/hire" },
    image: "/images/tile-refrigeration.webp",
  },
  {
    id: "mechanical-services",
    icon: Wrench,
    title: "Mechanical services",
    problem:
      "Buildings that need exhaust, fresh air and compliance work — not only a condenser on the roof.",
    solution:
      "Commercial exhaust and fresh-air systems, plus the certification that goes with them. We design, install, service and maintain mechanical services for commercial and light industrial sites across Perth and regional WA.",
    href: { label: "Enquire about mechanical work", to: "#contact" },
    image: "/images/tile-mechanical.webp",
  },
  {
    id: "winery-refrigeration",
    icon: Grape,
    title: "Winery refrigeration",
    problem:
      "Vintage and cellar work that depends on stable glycol and plant that is ready when fruit arrives.",
    solution:
      "Winery glycol refrigeration — design, installation, service and maintenance. Recent work includes chiller upgrades and cellar air conditioning for South West and Great Southern producers. If harvest plant is the issue, say so when you call.",
    href: { label: "See winery and cellar projects", to: "/projects" },
  },
  {
    id: "equipment-hire",
    icon: Truck,
    title: "Equipment hire",
    problem:
      "A breakdown, a fitout, or a seasonal load that needs cooling before permanent plant is ready.",
    solution:
      "Hire air conditioning and chillers for short-term or project work across Perth and regional WA. Tell us the site and the dates — we will match a unit from the hire list.",
    href: { label: "View hire catalogue", to: "/hire" },
  },
  {
    id: "design-install",
    icon: PenTool,
    title: "Design and install",
    problem:
      "A space that needs the right capacity and layout, not a catalogue unit dropped in and hoped for.",
    solution:
      "We start with the room, the load and how the site is used — then design, supply and install. That applies to commercial air conditioning, cool rooms, winery glycol and mechanical ventilation alike.",
    href: { label: "Talk through a design", to: "#contact" },
  },
  {
    id: "maintenance",
    icon: Factory,
    title: "Maintenance",
    problem:
      "Plant that only gets attention after it fails — filters, drains, electrics and gas left until there is a breakdown.",
    solution:
      "Scheduled servicing and repairs for air conditioning and refrigeration we install, and for existing plant on site. Warranty repairs on Panasonic equipment we look after, plus spare parts support and maintenance across the range.",
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
            Air conditioning, refrigeration and mechanical services — designed, installed and
            maintained for homes, commercial sites and industrial plant from Osborne Park through
            Perth, the South West and the Great Southern.
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
