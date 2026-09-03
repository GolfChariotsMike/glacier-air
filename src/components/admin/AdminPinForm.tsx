"use client";

import { useState } from "react";
import Image from "next/image";

export default function AdminPinForm() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not sign in.");
      return;
    }
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-[#060c1a] flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm flex flex-col gap-5">
        <Image
          src="/glacier-air-logo.png"
          alt="Glacier Air"
          width={200}
          height={40}
          className="h-10 w-auto mx-auto"
        />
        <h1 className="text-2xl font-bold text-white text-center">Admin photos</h1>
        <p className="text-slate-400 text-sm text-center">Enter the PIN Mike set for you.</p>
        <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="admin-pin">
          PIN
        </label>
        <input
          id="admin-pin"
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="min-h-14 w-full px-4 rounded-xl bg-white/5 border border-white/15 text-white text-lg"
        />
        {error && (
          <p className="text-sm text-red-300" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy || !pin}
          className="min-h-14 rounded-xl bg-[#2665AA] text-white font-semibold text-lg disabled:opacity-50"
        >
          {busy ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
