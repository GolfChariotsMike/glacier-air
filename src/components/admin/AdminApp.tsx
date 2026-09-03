"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, LogOut, Upload } from "lucide-react";
import {
  GALLERY_SLOTS,
  MULTI_IMAGE_SLOTS,
  SLOT_LABELS,
  reassignImage,
  type GalleryImage,
  type GallerySlot,
  type GalleryState,
} from "@/lib/gallery";

type Props = { supabaseConfigured: boolean };

const SLOT_SECTIONS: { title: string; hint: string; slots: GallerySlot[] }[] = [
  { title: "Hero", hint: "Homepage rooftop photo. Replacing it keeps the old photo in the unused library.", slots: ["hero"] },
  { title: "Projects", hint: "Job photos on the Projects page. Reorder or move any of them to another section.", slots: ["projects"] },
  { title: "Services", hint: "The three service card photos.", slots: ["services-ac", "services-ref", "services-mech"] },
  { title: "About", hint: "The three About photos.", slots: ["about-main", "about-left", "about-right"] },
  { title: "Trusted clients", hint: "Logos on the homepage strip.", slots: ["clients"] },
  { title: "Unused library", hint: "Photos not currently on a page. Move one onto a section to use it.", slots: ["library"] },
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

export default function AdminApp({ supabaseConfigured }: Props) {
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

  async function upload(slot: GallerySlot, file: File, alt?: string) {
    setBusy(true);
    setStatus("Uploading…");
    const compressed = await compressImage(file);
    const form = new FormData();
    form.set("file", compressed);
    form.set("slot", slot);
    form.set("alt", alt || file.name.replace(/\.\w+$/, "").replace(/[_-]/g, " "));
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

  function toLibrary(id: string) {
    void persist({ images: reassignImage(gallery.images, id, "library") });
  }

  function removeFromLibrary(id: string) {
    void persist({ images: gallery.images.filter((img) => img.id !== id) });
  }

  function moveWithin(slot: GallerySlot, id: string, dir: -1 | 1) {
    const ordered = gallery.images
      .filter((img) => img.slot === slot)
      .sort((a, b) => a.sort - b.sort);
    const i = ordered.findIndex((img) => img.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ordered.length) return;
    const swap = ordered[i];
    ordered[i] = ordered[j];
    ordered[j] = swap;
    const resorted = ordered.map((img, sort) => ({ ...img, sort }));
    const others = gallery.images.filter((img) => img.slot !== slot);
    void persist({ images: [...others, ...resorted] });
  }

  function moveToSlot(id: string, slot: GallerySlot) {
    void persist({ images: reassignImage(gallery.images, id, slot) });
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
        {!supabaseConfigured && (
          <p className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-300">
            Photo storage is not connected on this server.
          </p>
        )}

        {SLOT_SECTIONS.map((section) => (
          <Section key={section.title} title={section.title} hint={section.hint}>
            <div className="flex flex-col gap-4">
              {section.slots.map((slot) => {
                const images = gallery.images
                  .filter((img) => img.slot === slot)
                  .sort((a, b) => a.sort - b.sort);
                return (
                  <div key={slot} className="flex flex-col gap-3">
                    {section.slots.length > 1 && (
                      <p className="text-sm font-semibold text-slate-200">{SLOT_LABELS[slot]}</p>
                    )}
                    {images.map((img, i) => (
                      <PhotoCard
                        key={img.id}
                        image={img}
                        busy={busy}
                        onReplace={(file) => void upload(slot, file, img.alt)}
                        onRemove={() =>
                          slot === "library" ? removeFromLibrary(img.id) : toLibrary(img.id)
                        }
                        onMoveTo={(next) => moveToSlot(img.id, next)}
                        onUp={
                          MULTI_IMAGE_SLOTS.has(slot) && i > 0
                            ? () => moveWithin(slot, img.id, -1)
                            : undefined
                        }
                        onDown={
                          MULTI_IMAGE_SLOTS.has(slot) && i < images.length - 1
                            ? () => moveWithin(slot, img.id, 1)
                            : undefined
                        }
                        removeLabel={slot === "library" ? "Remove" : "Send to library"}
                      />
                    ))}
                    <UploadButton
                      disabled={busy || !supabaseConfigured}
                      label={
                        MULTI_IMAGE_SLOTS.has(slot)
                          ? `Add ${SLOT_LABELS[slot].toLowerCase()} photo`
                          : images.length
                            ? "Upload replacement"
                            : `Upload ${SLOT_LABELS[slot].toLowerCase()}`
                      }
                      onFile={(file) => void upload(slot, file)}
                    />
                  </div>
                );
              })}
            </div>
          </Section>
        ))}
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
  onMoveTo,
  onUp,
  onDown,
  removeLabel,
}: {
  image: GalleryImage;
  busy: boolean;
  onReplace: (file: File) => void;
  onRemove: () => void;
  onMoveTo: (slot: GallerySlot) => void;
  onUp?: () => void;
  onDown?: () => void;
  removeLabel: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0a0f1e]">
      <div className="relative h-44 bg-black/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
      </div>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-sm text-slate-300">{image.alt}</p>
        <label className="text-xs uppercase tracking-wide text-slate-400">
          Move to
          <select
            disabled={busy}
            value={image.slot}
            onChange={(e) => onMoveTo(e.target.value as GallerySlot)}
            className="mt-1 min-h-12 w-full px-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm"
          >
            {GALLERY_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {SLOT_LABELS[slot]}
              </option>
            ))}
          </select>
        </label>
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
            {removeLabel}
          </button>
        </div>
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
