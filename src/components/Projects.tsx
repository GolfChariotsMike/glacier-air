"use client";
import Image from "next/image";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { PROJECT_GROUPS, imagesForProject, type GalleryState } from "@/lib/gallery";

export default function Projects({ gallery }: { gallery: GalleryState }) {
  const sectionRef = useRevealOnScroll();
  const named = PROJECT_GROUPS.filter((group) => group.id !== "unassigned")
    .map((group) => ({ ...group, photos: imagesForProject(gallery, group.id) }))
    .filter((group) => group.photos.length > 0);
  const featured = named.slice(0, 2);
  const more = named.slice(2);

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
              key={project.id}
              className={`reveal reveal-delay-${pi + 1} grid lg:grid-cols-2 gap-10 items-center`}
            >
              <div className={`grid grid-cols-2 gap-3 ${pi % 2 === 1 ? "lg:order-2" : ""}`}>
                {project.photos.slice(0, 4).map((img, i) => (
                  <div
                    key={img.id}
                    className={`relative rounded-2xl overflow-hidden img-zoom ring-1 ring-white/5 ${
                      i === 0 ? "col-span-2 h-56" : "h-36"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || project.publicTitle}
                      fill
                      sizes={
                        i === 0
                          ? "(max-width: 1024px) 100vw, 50vw"
                          : "(max-width: 1024px) 50vw, 25vw"
                      }
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className={pi % 2 === 1 ? "lg:order-1" : ""}>
                <h3 className="text-3xl font-bold text-white mb-6">{project.publicTitle}</h3>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-semibold transition-all duration-300 hover:border-blue-400/50 group"
                >
                  Enquire about a similar project
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {more.length > 0 && (
          <div className="mt-20 reveal">
            <h3 className="text-xl font-semibold text-white mb-8">More projects</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {more.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl overflow-hidden ring-1 ring-white/5 bg-white/[0.02]"
                >
                  <div className={`grid ${p.photos.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {p.photos.slice(0, 2).map((img) => (
                      <div key={img.id} className="relative h-36 overflow-hidden">
                        <Image
                          src={img.url}
                          alt={img.alt || p.publicTitle}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="px-4 py-3 text-sm font-medium text-slate-200">{p.publicTitle}</p>
                </div>
              ))}
            </div>
          </div>
        )}

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
