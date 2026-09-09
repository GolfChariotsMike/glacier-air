"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import type { HireImage, HireUnit } from "@/lib/supabase-hire";

function HireUnitGallery({ images, title }: { images: HireImage[]; title: string }) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!expandedId) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedId(null);
        const active = document.activeElement;
        if (active instanceof HTMLElement && galleryRef.current?.contains(active)) {
          active.blur();
        }
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!galleryRef.current?.contains(event.target as Node)) {
        setExpandedId(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [expandedId]);

  if (images.length === 0) {
    return (
      <div className="h-56 rounded-2xl ring-1 ring-white/5 bg-white/[0.03] flex items-center justify-center">
        <p className="text-sm text-slate-500">Photos coming soon</p>
      </div>
    );
  }

  return (
    <div ref={galleryRef} className="hire-gallery relative">
      <div className="grid grid-cols-2 gap-3">
        {images.slice(0, 4).map((img, i) => {
          const featured = i === 0;
          const expanded = expandedId === img.id;
          const sizes = featured
            ? "(max-width: 1024px) 100vw, 50vw"
            : "(max-width: 1024px) 50vw, 25vw";
          return (
            <button
              key={img.id}
              type="button"
              aria-expanded={expanded}
              aria-label={`${expanded ? "Hide" : "Show"} full photo: ${img.alt || title}`}
              className={`hire-img-tile ${featured ? "hire-img-tile--hero col-span-2 h-56" : "hire-img-tile--thumb h-36"} ${
                expanded ? "is-expanded" : ""
              }`}
              onPointerUp={(event) => {
                if (event.pointerType === "mouse") return;
                setExpandedId((current) => (current === img.id ? null : img.id));
              }}
            >
              <span className="hire-img-crop ring-1 ring-white/5">
                <Image
                  src={img.url}
                  alt={img.alt || title}
                  fill
                  sizes={sizes}
                  className="object-cover"
                />
              </span>
              <span className="hire-img-expand" aria-hidden="true">
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-3"
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function HireCatalogue({ units }: { units: HireUnit[] }) {
  const sectionRef = useRevealOnScroll();

  return (
    <section id="hire" className="pt-32 pb-24 bg-[#0a0f1e] min-h-[70vh]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Available now
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Equipment Hire</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Hire air conditioning and chillers for short-term or project work across Perth and
            regional WA. Tell us the site and how long you need the plant — we&apos;ll match a unit.
          </p>
          <Link
            href="#hire-enquire"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Make Enquiry
          </Link>
        </div>

        {units.length === 0 ? (
          <div className="reveal max-w-xl mx-auto text-center rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-16">
            <h2 className="text-2xl font-bold text-white mb-3">Units coming soon</h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              We&apos;re listing hire AC and chillers here. Enquire now and we&apos;ll confirm
              what&apos;s available for your dates.
            </p>
            <Link
              href="#hire-enquire"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-semibold transition-all duration-300 hover:border-blue-400/50"
            >
              Make Enquiry
              <span aria-hidden>→</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-20">
            {units.map((unit, index) => (
              <article
                key={unit.id}
                className={`reveal reveal-delay-${(index % 3) + 1} grid lg:grid-cols-2 gap-10 items-center`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <HireUnitGallery images={unit.images} title={unit.title} />
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <h2 className={`text-3xl font-bold text-white ${unit.description ? "mb-4" : "mb-6"}`}>
                    {unit.title}
                  </h2>
                  {unit.description ? (
                    <p className="text-slate-400 text-lg leading-relaxed mb-6 whitespace-pre-line">
                      {unit.description}
                    </p>
                  ) : null}
                  <Link
                    href={`?unit=${encodeURIComponent(unit.id)}#hire-enquire`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-semibold transition-all duration-300 hover:border-blue-400/50 group"
                  >
                    Enquire about this unit
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
