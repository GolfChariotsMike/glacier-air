import { Phone, Mail, MapPin } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <section id="contact-us" className="py-24 bg-[#060c1a] scroll-mt-24">
      <div id="contact" className="max-w-7xl mx-auto px-6 scroll-mt-24">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Get In Touch
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Make Enquiry
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Whether you need a new installation, a service call, or want to
              discuss a larger commercial project — reach out and we&apos;ll get
              back to you promptly.
            </p>

            <div className="space-y-6">
              <a
                href="tel:0892423111"
                className="flex items-center gap-4 group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E01F26]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060c1a]"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Phone className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5 uppercase tracking-wide">Phone</p>
                  <p className="text-white font-semibold group-hover:text-white transition-colors">
                    (08) 9242 3111
                  </p>
                </div>
              </a>

              <a
                href="mailto:service@glacierair.com.au"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5 uppercase tracking-wide">Email</p>
                  <p className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                    service@glacierair.com.au
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5 uppercase tracking-wide">Address</p>
                  <p className="text-white font-semibold">
                    U10/28 Frobisher St, Osborne Park WA 6017
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-2xl overflow-hidden border border-white/5 h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3385.3457890!2d115.8274!3d-31.8893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32a4f45b45d1af%3A0xc8e3e0e3a3e3e3e3!2s28%20Frobisher%20St%2C%20Osborne%20Park%20WA%206017!5e0!3m2!1sen!2sau!4v1622000000000!5m2!1sen!2sau"
                title="Glacier Air office, Osborne Park"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 p-8" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
