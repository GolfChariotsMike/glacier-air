"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { ENQUIRY_TYPES } from "@/lib/enquiry-types";

const fieldClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors text-sm";

export default function ContactForm() {
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
      };

      if (data.ok) {
        setStatus("sent");
        return;
      }

      setStatus("error");
      setError(data.error || "Could not send just now. Call (08) 9242 3111.");
    } catch {
      setStatus("error");
      setError("Could not send just now. Call (08) 9242 3111 or email service@glacierair.com.au.");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
        <p className="text-slate-400">We&apos;ll be in touch shortly.</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setForm({
              name: "",
              company: "",
              phone: "",
              email: "",
              type: "",
              message: "",
              website: "",
            });
          }}
          className="mt-6 text-sm text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
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
            Company <span className="text-slate-400 normal-case tracking-normal">(optional)</span>
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
          <option value="" disabled className="bg-[#0d1428]">
            Select enquiry type
          </option>
          {ENQUIRY_TYPES.map((t) => (
            <option key={t.value} value={t.value} className="bg-[#0d1428]">
              {t.label}
            </option>
          ))}
        </select>
        {form.type === "EQUIPMENT HIRE" ? (
          <p className="text-xs text-slate-400 mt-2">
            Prefer to pick a unit and dates?{" "}
            <a
              href="/hire#hire-enquire"
              className="text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline"
            >
              Use the equipment hire form
            </a>
            .
          </p>
        ) : null}
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
        className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold transition-all hover:shadow-lg hover:shadow-blue-600/25"
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
  );
}
