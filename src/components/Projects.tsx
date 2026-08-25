"use client";
import { useEffect, useRef } from "react";

const projects = [
  {
    title: "Fremantle Office AC Fitout",
    category: "Commercial Air Conditioning",
    images: [
      "/images/fremantle-19.webp",
      "/images/fremantle-7.webp",
      "/images/fremantle-13.webp",
      "/images/fremantle-16.webp",
    ],
    description:
      "Full air conditioning fitout for a multi-tenancy commercial office in Fremantle. Design, supply and installation.",
    featured: true,
  },
  {
    title: "Nikola Estate Barn AC",
    category: "Winery Refrigeration",
    images: [
      "/images/refrigeration.webp",
      "/images/about-1.webp",
      "/images/about-2.webp",
      "/images/nikola-estate.webp",
    ],
    description:
      "Specialised winery barn refrigeration and air conditioning for Nikola Estate in the Great Southern region.",
    featured: false,
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    const els = sectionRef.current?.querySelectorAll(".reveal");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="py-24 bg-[#0a0f1e]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Our Work
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Recent Projects
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A snapshot of our recent installations across Perth and regional WA.
          </p>
        </div>

        <div className="space-y-20">
          {projects.map((project, pi) => (
            <div
              key={project.title}
              className={`reveal grid lg:grid-cols-2 gap-10 items-center`}
            >
              {/* Image grid */}
              <div className={`grid grid-cols-2 gap-3 ${pi % 2 === 1 ? "lg:order-2" : ""}`}>
                {project.images.slice(0, 4).map((img, i) => (
                  <div
                    key={img}
                    className={`rounded-2xl overflow-hidden img-zoom ring-1 ring-white/5 ${
                      i === 0 && project.featured ? "col-span-2 h-56" : "h-36"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${project.title} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className={pi % 2 === 1 ? "lg:order-1" : ""}>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wide mb-4">
                  {project.category}
                </span>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-6">
                  {project.description}
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-semibold transition-all duration-300 hover:border-blue-400/50 group"
                >
                  Enquire about a similar project
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
