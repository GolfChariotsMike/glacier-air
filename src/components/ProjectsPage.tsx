"use client";

import Image from "next/image";
import Link from "next/link";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import {
  imagesForProject,
  namedProjects,
  projectSectionId,
  UNASSIGNED_ID,
  type CatalogueProject,
  type GalleryImage,
  type GalleryState,
} from "@/lib/gallery";

function photoAlt(img: GalleryImage, projectTitle: string) {
  const trimmed = img.alt?.trim();
  if (trimmed && trimmed !== "Job photo" && trimmed !== "Project photo") {
    return trimmed;
  }
  return projectTitle;
}

export default function ProjectsPage({
  gallery,
  projects,
}: {
  gallery: GalleryState;
  projects: CatalogueProject[];
}) {
  const sectionRef = useRevealOnScroll();
  const named = namedProjects(projects).map((project) => ({
    ...project,
    photos: imagesForProject(gallery, project.id),
  }));
  const featured = [1, 2]
    .map((rank) => named.find((project) => project.heroRank === rank))
    .filter((project): project is (typeof named)[number] => Boolean(project));
  const featuredIds = new Set(featured.map((project) => project.id));
  const rest = named.filter((project) => !featuredIds.has(project.id));
  const ordered = [...featured, ...rest];
  const otherWork = {
    id: UNASSIGNED_ID,
    publicTitle: "Other work",
    description: "",
    photos: imagesForProject(gallery, UNASSIGNED_ID),
  };

  return (
    <div ref={sectionRef}>
      <section id="projects" className="pt-32 pb-16 bg-[#0a0f1e] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3 reveal">
            Recent work
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight reveal reveal-delay-1">
            Projects across Perth and regional WA
          </h1>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-3xl mb-8 reveal reveal-delay-2">
            Air conditioning and commercial refrigeration jobs we have completed — offices, food
            production, wineries, and commercial plant. Photos and headings come from the jobs
            themselves.
          </p>
          <div className="flex flex-wrap gap-4 reveal reveal-delay-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Enquire about a similar project
            </a>
            <Link
              href="/hire"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-semibold transition-all duration-300 hover:border-blue-400/50"
            >
              Need plant on hire?
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-24 bg-[#0a0f1e]">
        <div className="max-w-7xl mx-auto px-6">
          {ordered.length === 0 && otherWork.photos.length === 0 ? (
            <div className="reveal max-w-xl mx-auto text-center rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-16">
              <h2 className="text-2xl font-bold text-white mb-3">Project photos coming through</h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                We are gathering the job gallery here. If you have a similar site, send an
                enquiry and we will talk through the work.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-semibold"
              >
                Make enquiry
              </a>
            </div>
          ) : (
            <div className="space-y-20">
              {ordered.map((project, index) => (
                <article
                  key={project.id}
                  id={projectSectionId(project.id)}
                  className={`reveal reveal-delay-${(index % 3) + 1} scroll-mt-28 grid lg:grid-cols-2 gap-10 items-start`}
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    {project.photos.length > 0 ? (
                      <div
                        className={`grid gap-3 ${
                          project.photos.length > 1 ? "grid-cols-2" : "grid-cols-1"
                        }`}
                      >
                        {project.photos.slice(0, 8).map((img, i) => (
                          <div
                            key={img.id}
                            className={`relative rounded-2xl overflow-hidden img-zoom ring-1 ring-white/5 ${
                              i === 0 && project.photos.length > 1 ? "col-span-2 h-64" : "h-40"
                            } ${project.photos.length === 1 ? "h-72 col-span-1" : ""}`}
                          >
                            <Image
                              src={img.url}
                              alt={photoAlt(img, project.publicTitle)}
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
                    ) : (
                      <div className="h-56 rounded-2xl ring-1 ring-white/5 bg-white/[0.03] flex items-center justify-center">
                        <p className="text-sm text-slate-500">Photos coming soon</p>
                      </div>
                    )}
                  </div>
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <h2 className="text-3xl font-bold text-white mb-4">{project.publicTitle}</h2>
                    {project.description ? (
                      <p className="text-slate-400 text-lg leading-relaxed mb-6">
                        {project.description}
                      </p>
                    ) : (
                      <p className="text-slate-400 leading-relaxed mb-6">
                        Completed air conditioning or refrigeration work. Enquire if you have a
                        similar site and we will talk through what is involved.
                      </p>
                    )}
                    <a
                      href="#contact"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-semibold transition-all duration-300 hover:border-blue-400/50 group"
                    >
                      Enquire about a similar project
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </article>
              ))}

              {otherWork.photos.length > 0 ? (
                <article
                  id={projectSectionId(otherWork.id)}
                  className="reveal scroll-mt-28 pt-8 border-t border-white/5"
                >
                  <h2 className="text-2xl font-bold text-white mb-3">Other work</h2>
                  <p className="text-slate-400 leading-relaxed mb-8 max-w-2xl">
                    Additional job photos from sites that are not listed as a named project
                    above — including office fitouts and refrigeration work.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {otherWork.photos.map((img) => (
                      <div
                        key={img.id}
                        className="rounded-2xl overflow-hidden ring-1 ring-white/5 bg-white/[0.02]"
                      >
                        <div className="relative h-48">
                          <Image
                            src={img.url}
                            alt={photoAlt(img, "Glacier Air project photo")}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                        {img.alt?.trim() && img.alt !== "Job photo" ? (
                          <p className="px-4 py-3 text-sm font-medium text-slate-200">{img.alt}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </article>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
