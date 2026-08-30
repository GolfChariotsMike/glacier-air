"use client";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const featured = [
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
  },
];

const moreProjects = [
  { title: "Daiwa Foods Cold Storage", image: "/images/refrigeration.webp" },
  { title: "Henley Park Wines chiller upgrade", image: "/images/nikola-estate.webp" },
  { title: "New West Foods Cold Storage", image: "/images/about-1.webp" },
  { title: "Primero HVAC installation, Pilbara", image: "/images/fremantle-13.webp" },
  { title: "Shelf Subsea Dive Chiller Overhaul", image: "/images/about-2.webp" },
  { title: "West Cape Howe winery chiller upgrade", image: "/images/tile-refrigeration.jpg" },
  { title: "Windsor Cinema AC upgrade", image: "/images/fremantle-7.webp" },
];

export default function Projects() {
  const sectionRef = useRevealOnScroll();

  return (
    <section id="projects" className="py-24 bg-[#0a0f1e]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Our Work
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Recent Projects
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Air conditioning and commercial refrigeration jobs across Perth, the SouthWest and the Great Southern.
          </p>
        </div>

        <div className="space-y-20">
          {featured.map((project, pi) => (
            <div
              key={project.title}
              className={`reveal reveal-delay-${pi + 1} grid lg:grid-cols-2 gap-10 items-center`}
            >
              <div className={`grid grid-cols-2 gap-3 ${pi % 2 === 1 ? "lg:order-2" : ""}`}>
                {project.images.slice(0, 4).map((img, i) => (
                  <div
                    key={img}
                    className={`rounded-2xl overflow-hidden img-zoom ring-1 ring-white/5 ${
                      i === 0 ? "col-span-2 h-56" : "h-36"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

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

        <div className="mt-20 reveal">
          <h3 className="text-xl font-semibold text-white mb-2">More projects</h3>
          <p className="text-slate-500 text-sm mb-8">
            Names from completed jobs. Photos are from our WA installs, not unique shots of each site.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {moreProjects.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl overflow-hidden ring-1 ring-white/5 bg-white/[0.02]"
              >
                <div className="h-28 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" className="w-full h-full object-cover opacity-80" />
                </div>
                <p className="px-4 py-3 text-sm font-medium text-slate-200">{p.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
