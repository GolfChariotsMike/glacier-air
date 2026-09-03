"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Lock, LogOut, Upload } from "lucide-react";
import type { GalleryImage, GallerySlot, GalleryState } from "@/lib/gallery";

type Props = { blobConfigured: boolean };

const PROJECTS_HINT = "Job photos shown on the Projects page";

const FIXED_SLOTS: { slot: GallerySlot; label: string }[] = [
  { slot: "services-ac", label: "Services — Air conditioning" },
  { slot: "services-ref", label: "Services — Refrigeration" },
  { slot: "services-mech", label: "Services — Mechanical" },
  { slot: "about-main", label: "About — main photo" },
  { slot: "about-left", label: "About — left photo" },
  { slot: "about-right", label: "About — right photo" },
];

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size < 400_000) return file;
  const bitmap = await createImageBitmap(file);
  const max = 1800;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.82)
  );
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
}

export default function AdminApp({ blobConfigured }: Props) {
  const [gallery, setGallery] = useState<GalleryState>({ images: [] });
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setGallery(data.gallery);
      })
      .catch(() => setStatus("Could not load photos."));
  }, []);

  const projects = gallery.images
    .filter((img) => img.slot === "projects")
    .sort((a, b) => a.sort - b.sort);

  async function persist(next: GalleryState) {
    setBusy(true);
    setStatus("");
    const res = await fetch("/api/admin/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setStatus(data.error || "Could not save.");
      return;
    }
    setGallery(data.gallery);
    setStatus("Saved.");
  }

  async function upload(slot: GallerySlot, file: File, replaceId?: string, alt?: string) {
    setBusy(true);
    setStatus("Uploading…");
    const compressed = await compressImage(file);
    const form = new FormData();
    form.set("file", compressed);
    form.set("slot", slot);
    form.set("alt", alt || file.name.replace(/\.\w+$/, "").replace(/[_-]/g, " "));
    if (replaceId) form.set("replaceId", replaceId);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setStatus(data.error || "Upload failed.");
      return;
    }
    setGallery(data.gallery);
    setStatus("Photo updated.");
  }

  function remove(id: string) {
    void persist({ images: gallery.images.filter((img) => img.id !== id) });
  }

  function move(id: string, dir: -1 | 1) {
    const ordered = [...projects];
    const i = ordered.findIndex((img) => img.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ordered.length) return;
    const swap = ordered[i];
    ordered[i] = ordered[j];
    ordered[j] = swap;
    const resorted = ordered.map((img, sort) => ({ ...img, sort }));
    const others = gallery.images.filter((img) => img.slot !== "projects");
    void persist({ images: [...others, ...resorted] });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-[#060c1a] text-white">
      <header className="border-b border-white/10 px-5 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Image src="/glacier-air-logo.png" alt="Glacier Air" width={140} height={28} className="h-7 w-auto" />
          <p className="text-sm text-slate-400 truncate">Photo admin</p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="inline-flex items-center justify-center gap-2 min-h-12 px-4 rounded-xl border border-white/15 text-sm font-semibold"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-8 flex flex-col gap-8">
        {status && (
          <p className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-200" role="status">
            {status}
          </p>
        )}
        {!blobConfigured && (
          <p className="rounded-xl bg-[#E01F26]/10 border border-[#E01F26]/30 px-4 py-3 text-sm">
            Uploads need <code className="text-[#c5e4f7]">BLOB_READ_WRITE_TOKEN</code> on this Vercel
            project. The public site will keep its current photos until that is set.
          </p>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-slate-400" />
            <h2 className="text-lg font-bold">Hero rooftop</h2>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 bg-white/10 rounded-full px-2 py-1">
              Locked (Mike)
            </span>
          </div>
          <div className="relative h-36 rounded-xl overflow-hidden ring-1 ring-white/10">
            <Image src="/images/hero-bg.webp" alt="" fill sizes="100vw" className="object-cover object-[54%_center]" />
          </div>
          <p className="text-sm text-slate-400 mt-3">This photo stays on the homepage. Nick cannot replace it here.</p>
        </section>

        <Section title="Projects" hint={PROJECTS_HINT}>
          <div className="flex flex-col gap-4">
            {projects.map((img, i) => (
              <PhotoCard
                key={img.id}
                image={img}
                busy={busy}
                onReplace={(file) => void upload("projects", file, img.id, img.alt)}
                onRemove={() => remove(img.id)}
                onUp={i > 0 ? () => move(img.id, -1) : undefined}
                onDown={i < projects.length - 1 ? () => move(img.id, 1) : undefined}
              />
            ))}
            <UploadButton
              disabled={busy || !blobConfigured}
              label="Add project photo"
              onFile={(file) => void upload("projects", file)}
            />
          </div>
        </Section>

        <Section title="Services" hint="These replace the three service card photos.">
          <div className="flex flex-col gap-4">
            {FIXED_SLOTS.filter((s) => s.slot.startsWith("services-")).map((s) => {
              const image = gallery.images.find((img) => img.slot === s.slot);
              return (
                <FixedSlot
                  key={s.slot}
                  label={s.label}
                  image={image}
                  busy={busy}
                  disabled={!blobConfigured}
                  onUpload={(file) => void upload(s.slot, file, image?.id, s.label)}
                  onRemove={image ? () => remove(image.id) : undefined}
                />
              );
            })}
          </div>
        </Section>

        <Section title="About" hint="These replace the three About photos.">
          <div className="flex flex-col gap-4">
            {FIXED_SLOTS.filter((s) => s.slot.startsWith("about-")).map((s) => {
              const image = gallery.images.find((img) => img.slot === s.slot);
              return (
                <FixedSlot
                  key={s.slot}
                  label={s.label}
                  image={image}
                  busy={busy}
                  disabled={!blobConfigured}
                  onUpload={(file) => void upload(s.slot, file, image?.id, s.label)}
                  onRemove={image ? () => remove(image.id) : undefined}
                />
              );
            })}
          </div>
        </Section>
      </main>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <h2 className="text-lg font-bold mb-1">{title}</h2>
      <p className="text-sm text-slate-400 mb-4">{hint}</p>
      {children}
    </section>
  );
}

function PhotoCard({
  image,
  busy,
  onReplace,
  onRemove,
  onUp,
  onDown,
}: {
  image: GalleryImage;
  busy: boolean;
  onReplace: (file: File) => void;
  onRemove: () => void;
  onUp?: () => void;
  onDown?: () => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0a0f1e]">
      <div className="relative h-44">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
      </div>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-sm text-slate-300">{image.alt}</p>
        <div className="flex flex-wrap gap-2">
          {(onUp || onDown) && (
            <>
              <IconBtn disabled={!onUp || busy} onClick={onUp} label="Move up">
                <ChevronUp className="w-5 h-5" />
              </IconBtn>
              <IconBtn disabled={!onDown || busy} onClick={onDown} label="Move down">
                <ChevronDown className="w-5 h-5" />
              </IconBtn>
            </>
          )}
          <FileBtn disabled={busy} onFile={onReplace}>
            Replace
          </FileBtn>
          <button
            type="button"
            disabled={busy}
            onClick={onRemove}
            className="min-h-12 px-4 rounded-xl border border-[#E01F26]/40 text-[#ffb4b6] font-semibold"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function FixedSlot({
  label,
  image,
  busy,
  disabled,
  onUpload,
  onRemove,
}: {
  label: string;
  image?: GalleryImage;
  busy: boolean;
  disabled: boolean;
  onUpload: (file: File) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0a0f1e]">
      <p className="px-3 pt-3 text-sm font-semibold">{label}</p>
      {image ? (
        <div className="relative h-40 mt-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
        </div>
      ) : (
        <p className="px-3 py-6 text-sm text-slate-500">Using the site’s current photo.</p>
      )}
      <div className="p-3 flex flex-wrap gap-2">
        <FileBtn disabled={busy || disabled} onFile={onUpload}>
          {image ? "Replace" : "Upload"}
        </FileBtn>
        {onRemove && (
          <button
            type="button"
            disabled={busy}
            onClick={onRemove}
            className="min-h-12 px-4 rounded-xl border border-[#E01F26]/40 text-[#ffb4b6] font-semibold"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

function UploadButton({
  label,
  disabled,
  onFile,
}: {
  label: string;
  disabled: boolean;
  onFile: (file: File) => void;
}) {
  return (
    <FileBtn disabled={disabled} onFile={onFile} wide>
      <Upload className="w-4 h-4" /> {label}
    </FileBtn>
  );
}

function FileBtn({
  children,
  disabled,
  onFile,
  wide,
}: {
  children: ReactNode;
  disabled: boolean;
  onFile: (file: File) => void;
  wide?: boolean;
}) {
  return (
    <label
      className={`inline-flex items-center justify-center gap-2 min-h-12 px-4 rounded-xl bg-[#2665AA] font-semibold cursor-pointer ${
        wide ? "w-full" : ""
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      {children}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onFile(file);
        }}
      />
    </label>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="min-h-12 min-w-12 rounded-xl border border-white/15 inline-flex items-center justify-center disabled:opacity-40"
    >
      {children}
    </button>
  );
}
