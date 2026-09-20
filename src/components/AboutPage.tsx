"use client";

import { Award, Clock, MapPin, Phone, Wrench } from "lucide-react";
import Image from "next/image";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { ABOUT_FALLBACKS, firstAlt, firstUrl, type GalleryState } from "@/lib/gallery";

const reasons = [
  {
    icon: Wrench,
    title: "Technical knowledge",
    body: "Air conditioning, refrigeration and mechanical services — design, supply, installation, servicing and maintenance for the systems we look after.",
  },
  {
    icon: Clock,
    title: "Service and response",
    body: "Excellent service, fast response times, and sound technical knowledge.",
  },
  {
    icon: Award,
    title: "Design, install and maintain",
    body: "From the first site visit through installation and ongoing maintenance — one contractor for each stage.",
  },
];

export default function AboutPage({ gallery }: { gallery: GalleryState }) {
  const sectionRef = useRevealOnScroll<HTMLDivElement>();

  return (
    <div ref={sectionRef}>
      <section id="about-us" className="pt-32 pb-16 bg-[#060c1a] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3 reveal">
            Family-owned
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight reveal reveal-delay-1">
            About Glacier Air
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-3xl reveal reveal-delay-2">
            Glacier Air is a family-owned air conditioning and refrigeration company based in
            Osborne Park. We provide services across Perth, the South West and the Great
            Southern region of Western Australia.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#0a0f1e]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative reveal">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative rounded-2xl overflow-hidden h-64 col-span-2 img-zoom ring-1 ring-white/5">
                  <Image
                    src={firstUrl(gallery, "about-main", ABOUT_FALLBACKS.main.src)}
                    alt={firstAlt(gallery, "about-main", ABOUT_FALLBACKS.main.alt)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden h-44 img-zoom ring-1 ring-white/5">
                  <Image
                    src={firstUrl(gallery, "about-left", ABOUT_FALLBACKS.left.src)}
                    alt={firstAlt(gallery, "about-left", ABOUT_FALLBACKS.left.alt)}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden h-44 img-zoom ring-1 ring-white/5">
                  <Image
                    src={firstUrl(gallery, "about-right", ABOUT_FALLBACKS.right.src)}
                    alt={firstAlt(gallery, "about-right", ABOUT_FALLBACKS.right.alt)}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight reveal">
                A family business in Osborne Park
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-5 reveal reveal-delay-1">
                We work from U10/28 Frobisher Street, Osborne Park. The company is family-owned
                and covers refrigeration, air conditioning and mechanical services — residential
                and commercial.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8 reveal reveal-delay-2">
                From design and supply through to installation, servicing and maintenance, we
                handle each stage for the systems we install and look after. ARC licence AU18839.
                AIRAH member. HIA member.
              </p>
              <div className="flex flex-wrap items-center gap-6 reveal reveal-delay-3">
                <Image
                  src="/images/badges/airah.jpg"
                  alt="AIRAH member"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-lg object-contain bg-white p-1"
                />
                <Image
                  src="/images/badges/arc.jpg"
                  alt="ARC licence AU18839"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-lg object-contain bg-white p-1"
                />
                <Image
                  src="/images/badges/hia.jpg"
                  alt="HIA member"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-lg object-contain bg-white p-1"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#060c1a]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 reveal">
            How we work
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mb-12 reveal reveal-delay-1">
            Design, install and maintain — with a direct line to the office.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {reasons.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <div
                  key={reason.title}
                  className={`reveal reveal-delay-${i + 1} rounded-2xl border border-white/10 bg-white/[0.02] p-6`}
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{reason.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{reason.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0a0f1e]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="reveal">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-blue-400" />
                <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest">
                  Coverage
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Perth, the South West and the Great Southern
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Services across the metropolitan area, the South West and the Great Southern.
                If you are not sure we cover the site, call the office.
              </p>
            </div>
            <div className="reveal reveal-delay-1 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Talk to us</h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                New installation, a service call, or a larger commercial job — phone or send an
                enquiry.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:0892423111"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <Phone className="w-4 h-4" />
                  (08) 9242 3111
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-semibold transition-all duration-300 hover:border-blue-400/50"
                >
                  Make enquiry
                </a>
              </div>
              <p className="text-slate-500 text-sm mt-6">
                U10/28 Frobisher St, Osborne Park WA 6017
                <br />
                <a href="mailto:service@glacierair.com.au" className="hover:text-slate-300">
                  service@glacierair.com.au
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
