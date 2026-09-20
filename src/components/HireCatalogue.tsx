import Link from "next/link";
import RevealRoot from "@/components/RevealRoot";
import HireUnitGallery from "@/components/HireUnitGallery";
import type { HireUnit } from "@/lib/supabase-hire";

export default function HireCatalogue({ units }: { units: HireUnit[] }) {
  return (
    <RevealRoot id="hire" className="pt-32 pb-24 bg-[#0a0f1e] min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
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
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/25"
          >
            Make Enquiry
          </Link>
        </div>

        {units.length === 0 ? (
          <div className="max-w-xl mx-auto text-center rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-16">
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
                className={`hire-unit reveal reveal-delay-${(index % 3) + 1} grid lg:grid-cols-2 gap-10 items-center`}
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
    </RevealRoot>
  );
}
