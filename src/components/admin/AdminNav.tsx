"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

export const ADMIN_NAV_ITEMS = [
  { id: "admin-hero", label: "Hero" },
  { id: "admin-services", label: "Services" },
  { id: "admin-projects", label: "Projects" },
  { id: "admin-hire", label: "Equipment Hire" },
  { id: "admin-about", label: "About" },
  { id: "admin-clients", label: "Trusted clients" },
] as const;

export default function AdminNav() {
  const [activeId, setActiveId] = useState<string>(ADMIN_NAV_ITEMS[0].id);

  useEffect(() => {
    const nodes = ADMIN_NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (!nodes.length) return;

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let next = ADMIN_NAV_ITEMS[0].id;
        let best = 0;
        for (const item of ADMIN_NAV_ITEMS) {
          const ratio = ratios.get(item.id) ?? 0;
          if (ratio > best) {
            best = ratio;
            next = item.id;
          }
        }
        if (best > 0) setActiveId(next);
      },
      { rootMargin: "-12% 0px -55% 0px", threshold: [0, 0.15, 0.35, 0.55] }
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Admin sections"
      className="sticky top-0 z-20 border-b border-white/10 bg-[#060c1a]/95 backdrop-blur lg:top-6 lg:self-start lg:border-b-0 lg:border-r lg:bg-transparent lg:backdrop-blur-none lg:min-h-[calc(100vh-1.5rem)]"
    >
      <p className="hidden lg:block px-4 pt-2 pb-3 text-xs uppercase tracking-wide text-slate-500">
        Jump to
      </p>
      <ul className="flex gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:thin] lg:flex-col lg:overflow-visible lg:px-3 lg:py-0">
        {ADMIN_NAV_ITEMS.map((item) => {
          const active = activeId === item.id;
          return (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                aria-current={active ? "location" : undefined}
                className={`block whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold lg:rounded-lg lg:py-2 ${
                  active
                    ? "bg-[#2665AA] text-white"
                    : "border border-white/15 text-slate-300 hover:border-[#2665AA]/70 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
        <li className="shrink-0">
          <a
            href="/review"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold border border-white/15 text-slate-300 hover:border-[#2665AA]/70 hover:text-white lg:rounded-lg lg:py-2"
          >
            Copy review
            <ExternalLink className="w-3.5 h-3.5" aria-hidden />
          </a>
        </li>
      </ul>
    </nav>
  );
}
