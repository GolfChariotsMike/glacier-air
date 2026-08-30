"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

const fieldClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors text-sm";

async function forwardViaFormSubmit(payload: {
  name: string;
  company: string;
  phone: string;
  email: string;
  type: string;
  message: string;
}) {
  const res = await fetch("https://formsubmit.co/ajax/service@glacierair.com.au", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      _replyto: payload.email,
      _subject: `Glacier Air website enquiry: ${payload.type}`,
      _template: "table",
      company: payload.company || "(not provided)",
      phone: payload.phone,
      type: payload.type,
      message: payload.message,
    }),
  });
  const data = (await res.json().catch(() => null)) as { success?: string | boolean } | null;
  return Boolean(res.ok && data && data.success !== "false" && data.success !== false);
}

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    type: "",
    message: "",
    website: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          phone: form.phone,
          email: form.email,
          type: form.type,
          message: form.message,
          website: form.website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        code?: string;
      };

      if (data.ok) {
        setStatus("sent");
        return;
      }

      if (data.code === "browser-forward") {
        const forwarded = await forwardViaFormSubmit({
          name: form.name,
          company: form.company,
          phone: form.phone,
          email: form.email,
          type: form.type,
          message: form.message,
        });
        if (forwarded) {
          setStatus("sent");
          return;
        }
      }

      setStatus("error");
      setError(data.error || "Could not send just now. Call (08) 9242 3111.");
    } catch {
      setStatus("error");
      setError("Could not send just now. Call (08) 9242 3111 or email service@glacierair.com.au.");
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#060c1a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Get In Touch
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Request a Quote
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
                  <p className="text-xs text-slate-500 mb-0.5 uppercase tracking-wide">Phone</p>
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
                  <p className="text-xs text-slate-500 mb-0.5 uppercase tracking-wide">Email</p>
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
                  <p className="text-xs text-slate-500 mb-0.5 uppercase tracking-wide">Address</p>
                  <p className="text-white font-semibold">
                    U10/28 Frobisher St, Osborne Park WA 6017
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-2xl overflow-hidden border border-white/5 h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3385.3457890!2d115.8274!3d-31.8893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32a4f45b45d1af%3A0xc8e3e0e3a3e3e3e3!2s28%20Frobisher%20St%2C%20Osborne%20Park%20WA%206017!5e0!3m2!1sen!2sau!4v1622000000000!5m2!1sen!2sau"
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
            {status === "sent" ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-slate-400">We&apos;ll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 relative">
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2" htmlFor="contact-name">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={fieldClass}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2" htmlFor="contact-company">
                      Company <span className="text-slate-600 normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      autoComplete="organization"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className={fieldClass}
                      placeholder="Company name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2" htmlFor="contact-phone">
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={fieldClass}
                    placeholder="0400 000 000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2" htmlFor="contact-email">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={fieldClass}
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2" htmlFor="contact-type">
                    Enquiry Type
                  </label>
                  <select
                    id="contact-type"
                    required
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className={fieldClass}
                  >
                    <option value="" disabled className="bg-[#0d1428]">Select enquiry type</option>
                    <option value="Air Conditioning" className="bg-[#0d1428]">Air Conditioning</option>
                    <option value="Refrigeration" className="bg-[#0d1428]">Refrigeration</option>
                    <option value="Mechanical Services" className="bg-[#0d1428]">Mechanical Services</option>
                    <option value="Service & Maintenance" className="bg-[#0d1428]">Service & Maintenance</option>
                    <option value="Other" className="bg-[#0d1428]">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${fieldClass} resize-none`}
                    placeholder="Tell us about your project or what you need..."
                  />
                </div>
                {status === "error" && (
                  <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25"
                >
                  {status === "sending" ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
