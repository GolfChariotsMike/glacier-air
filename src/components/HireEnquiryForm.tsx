"use client";

import { useState } from "react";
import { Mail, Phone, Send } from "lucide-react";
import { forwardViaFormSubmit } from "@/lib/forward-enquiry";
import {
  buildHireEnquiryMessage,
  hireEquipmentLabel,
  hirePeriodValid,
  HIRE_ENQUIRY_TYPE,
  HIRE_NOT_SURE_LABEL,
  HIRE_NOT_SURE_VALUE,
} from "@/lib/hire-enquiry";

const fieldClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors text-sm [color-scheme:dark]";

export type HireEnquiryUnit = {
  id: string;
  title: string;
};

export default function HireEnquiryForm({
  units,
  initialUnitId,
}: {
  units: HireEnquiryUnit[];
  initialUnitId?: string;
}) {
  const knownInitial =
    initialUnitId && units.some((unit) => unit.id === initialUnitId)
      ? initialUnitId
      : HIRE_NOT_SURE_VALUE;

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    equipment: knownInitial,
    startDate: "",
    endDate: "",
    longTerm: false,
    message: "",
    website: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const periodError = hirePeriodValid({
      startDate: form.startDate,
      endDate: form.endDate,
      longTerm: form.longTerm,
    });
    if (periodError) {
      setStatus("error");
      setError(periodError);
      return;
    }

    setStatus("sending");

    const equipmentTitle = hireEquipmentLabel(form.equipment, units);
    const message = buildHireEnquiryMessage({
      equipmentTitle,
      startDate: form.startDate,
      endDate: form.endDate,
      longTerm: form.longTerm,
      notes: form.message,
    });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          phone: form.phone,
          email: form.email,
          type: HIRE_ENQUIRY_TYPE,
          message,
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
          type: HIRE_ENQUIRY_TYPE,
          message,
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
    <section id="hire-enquire" className="py-24 bg-[#060c1a] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Equipment hire
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Enquire about hire</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Tell us which unit you need and when. Short date range or long-term — we&apos;ll
              confirm what&apos;s available and get back to you promptly.
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
                  <p className="text-white font-semibold">(08) 9242 3111</p>
                </div>
              </a>

              <a href="mailto:service@glacierair.com.au" className="flex items-center gap-4 group">
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
            </div>
          </div>

          <div
            className="rounded-2xl border border-white/5 p-8"
            style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
          >
            {status === "sent" ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-slate-400">We&apos;ll be in touch shortly about your hire.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 relative">
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="hire-website">Website</label>
                  <input
                    id="hire-website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-xs text-slate-400 uppercase tracking-wide mb-2"
                      htmlFor="hire-name"
                    >
                      Name
                    </label>
                    <input
                      id="hire-name"
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
                    <label
                      className="block text-xs text-slate-400 uppercase tracking-wide mb-2"
                      htmlFor="hire-company"
                    >
                      Company{" "}
                      <span className="text-slate-600 normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      id="hire-company"
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
                  <label
                    className="block text-xs text-slate-400 uppercase tracking-wide mb-2"
                    htmlFor="hire-phone"
                  >
                    Phone
                  </label>
                  <input
                    id="hire-phone"
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
                  <label
                    className="block text-xs text-slate-400 uppercase tracking-wide mb-2"
                    htmlFor="hire-email"
                  >
                    Email
                  </label>
                  <input
                    id="hire-email"
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
                  <label
                    className="block text-xs text-slate-400 uppercase tracking-wide mb-2"
                    htmlFor="hire-equipment"
                  >
                    Equipment
                  </label>
                  <select
                    id="hire-equipment"
                    required
                    value={form.equipment}
                    onChange={(e) => setForm({ ...form, equipment: e.target.value })}
                    className={fieldClass}
                  >
                    <option value={HIRE_NOT_SURE_VALUE} className="bg-[#0d1428]">
                      {HIRE_NOT_SURE_LABEL}
                    </option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id} className="bg-[#0d1428]">
                        {unit.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={form.longTerm ? "" : "grid sm:grid-cols-2 gap-5"}>
                  <div>
                    <label
                      className="block text-xs text-slate-400 uppercase tracking-wide mb-2"
                      htmlFor="hire-start"
                    >
                      Start date
                    </label>
                    <input
                      id="hire-start"
                      type="date"
                      required
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className={fieldClass}
                    />
                  </div>
                  {!form.longTerm ? (
                    <div>
                      <label
                        className="block text-xs text-slate-400 uppercase tracking-wide mb-2"
                        htmlFor="hire-end"
                      >
                        End date
                      </label>
                      <input
                        id="hire-end"
                        type="date"
                        required
                        min={form.startDate || undefined}
                        value={form.endDate}
                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                        className={fieldClass}
                      />
                    </div>
                  ) : null}
                </div>

                <label
                  htmlFor="hire-long-term"
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 cursor-pointer"
                >
                  <input
                    id="hire-long-term"
                    type="checkbox"
                    checked={form.longTerm}
                    onChange={(e) => setForm({ ...form, longTerm: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-0"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-white">Long-term hire</span>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      Pick a start date and leave the finish open — we&apos;ll discuss duration.
                    </span>
                  </span>
                </label>

                <div>
                  <label
                    className="block text-xs text-slate-400 uppercase tracking-wide mb-2"
                    htmlFor="hire-message"
                  >
                    Message{" "}
                    <span className="text-slate-600 normal-case tracking-normal">(optional)</span>
                  </label>
                  <textarea
                    id="hire-message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${fieldClass} resize-none`}
                    placeholder="Site, access, or anything else we should know..."
                  />
                </div>

                {status === "error" && (
                  <p
                    className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                    role="alert"
                  >
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
                      Send hire enquiry <Send className="w-4 h-4" />
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
