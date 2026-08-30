"use client";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const featured = [
  {
    title: "Fremantle Office AC Fitout",
    images: [
      "/images/fremantle-19.webp",
      "/images/fremantle-7.webp",
      "/images/fremantle-13.webp",
      "/images/fremantle-16.webp",
    ],
  },
  {
    title: "Nikola Estate Barn AC",
    images: [
      "/images/projects/nikola-1.jpg",
      "/images/projects/nikola-2.jpg",
      "/images/projects/nikola-3.jpg",
      "/images/projects/nikola-4.jpg",
    ],
  },
];

const moreProjects = [
  { title: "Daiwa Foods Cold Storage", image: "/images/projects/daiwa-foods.jpg" },
  { title: "Henley Park Wines chiller upgrade", image: "/images/projects/henley-park.jpg" },
  { title: "New West Foods Cold Storage", image: "/images/projects/new-west-foods.jpg" },
  { title: "Primero HVAC installation, Pilbara", image: "/images/projects/primero.jpg" },
  { title: "Shelf Subsea Dive Chiller Overhaul", image: "/images/projects/shelf-subsea.jpg" },
  { title: "West Cape Howe winery chiller upgrade", image: "/images/projects/west-cape-howe.jpg" },
  { title: "Windsor Cinema AC upgrade", image: "/images/projects/windsor-cinema.jpg" },
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
            Air conditioning and commercial refrigeration projects — residential and commercial.
          </p>
        </div>

        <div className="space-y-20">
          {featured.map((project, pi) => (
            <div
              key={project.title}
              className={`reveal reveal-delay-${pi + 1} grid lg:grid-cols-2 gap-10 items-center`}
            >
              <div className={`grid grid-cols-2 gap-3 ${pi % 2 === 1 ? "lg:order-2" : ""}`}>
                {project.images.slice(0, 4).map((img) => (
                  <div
                    key={img}
                    className={`rounded-2xl overflow-hidden img-zoom ring-1 ring-white/5 ${
                      img === project.images[0] ? "col-span-2 h-56" : "h-36"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              <div className={pi % 2 === 1 ? "lg:order-1" : ""}>
                <h3 className="text-3xl font-bold text-white mb-6">{project.title}</h3>
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
          <h3 className="text-xl font-semibold text-white mb-8">More projects</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {moreProjects.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl overflow-hidden ring-1 ring-white/5 bg-white/[0.02]"
              >
                <div className="h-36 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="px-4 py-3 text-sm font-medium text-slate-200">{p.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-center reveal space-y-4">
          <p className="text-slate-400 leading-relaxed">
            Glacier Air offers residential and commercial refrigeration and air conditioning
            installation, repairs and maintenance across Perth, the SouthWest and the Great
            Southern. The team is fully qualified, trained and experienced across models, makes
            and sizes.
          </p>
          <p className="text-slate-400 leading-relaxed">
            We supply chillers, fridges and freezers from big brands, and we also provide air
            conditioning and ventilation — installation and maintenance.
          </p>
        </div>
      </div>
    </section>
  );
}
