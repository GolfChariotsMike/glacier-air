"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HireImage } from "@/lib/supabase-hire";

export default function HireUnitGallery({ images, title }: { images: HireImage[]; title: string }) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setExpandedId(null);
      const active = document.activeElement;
      if (active instanceof HTMLElement && galleryRef.current?.contains(active)) {
        active.blur();
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
  }, []);

  if (images.length === 0) {
    return (
      <div className="h-56 rounded-2xl ring-1 ring-white/5 bg-white/[0.03] flex items-center justify-center">
        <p className="text-sm text-slate-400">Photos coming soon</p>
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
            ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
            : "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw";
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
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
