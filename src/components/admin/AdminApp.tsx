"use client";

import { useEffect, useState, type DragEvent, type ReactNode } from "react";
import Image from "next/image";
import { LogOut, Upload } from "lucide-react";
import {
  PROJECT_GROUPS,
  imagesForProject,
  imagesForSlot,
  moveToProject,
  sendProjectPhotoToUnused,
  type GalleryImage,
  type GallerySlot,
  type GalleryState,
  type ProjectId,
} from "@/lib/gallery";

type Props = { supabaseConfigured: boolean };

const SERVICE_CARDS: { slot: GallerySlot; label: string }[] = [
  { slot: "services-ac", label: "Air conditioning" },
  { slot: "services-ref", label: "Refrigeration" },
  { slot: "services-mech", label: "Mechanical" },
];

const ABOUT_CARDS: { slot: GallerySlot; label: string }[] = [
  { slot: "about-main", label: "About — main" },
  { slot: "about-left", label: "About — left" },
  { slot: "about-right", label: "About — right" },
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
  const [overProject, setOverProject] = useState<ProjectId | null>(null);

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setGallery(data.gallery);
      })
      .catch(() => setStatus("Could not load photos."));
  }, []);

  const hero = imagesForSlot(gallery, "hero")[0];
  const clients = imagesForSlot(gallery, "clients");

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

  async function upload(slot: GallerySlot, file: File, alt?: string, projectId?: ProjectId) {
    setBusy(true);
    setStatus("Uploading…");
    const compressed = await compressImage(file);
    const form = new FormData();
    form.set("file", compressed);
    form.set("slot", slot);
    form.set("alt", alt || file.name.replace(/\.\w+$/, "").replace(/[_-]/g, " "));
    if (projectId) form.set("projectId", projectId);
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

  function dropOnProject(projectId: ProjectId, event: DragEvent) {
    event.preventDefault();
    setOverProject(null);
    const id = event.dataTransfer.getData("text/plain");
    if (!id) return;
    const img = gallery.images.find((item) => item.id === id);
    if (!img || img.slot !== "projects") return;
    void persist({ images: moveToProject(gallery.images, id, projectId) });
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

      <main className="max-w-4xl mx-auto px-5 py-8 flex flex-col gap-10">
        {status && (
          <p className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-200" role="status">
            {status}
          </p>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h2 className="text-lg font-bold mb-1">Hero</h2>
          <p className="text-sm text-slate-400 mb-4">This is the homepage hero.</p>
          <div className="relative h-56 md:h-72 rounded-xl overflow-hidden ring-1 ring-white/10 bg-black/30">
            {hero ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.url} alt={hero.alt} className="w-full h-full object-cover object-[54%_center]" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/images/hero-bg.webp" alt="" className="w-full h-full object-cover object-[54%_center]" />
            )}
          </div>
          <div className="mt-4">
            <ReplaceButton
              disabled={busy || !supabaseConfigured}
              onFile={(file) => void upload("hero", file, "Homepage hero")}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h2 className="text-lg font-bold mb-1">Services</h2>
          <p className="text-sm text-slate-400 mb-4">These photos sit on the three service cards.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {SERVICE_CARDS.map((card) => {
              const image = imagesForSlot(gallery, card.slot)[0];
              return (
                <ReplaceCard
                  key={card.slot}
                  title={card.label}
                  image={image}
                  busy={busy || !supabaseConfigured}
                  onReplace={(file) => void upload(card.slot, file, card.label)}
                />
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h2 className="text-lg font-bold mb-1">Projects</h2>
          <p className="text-sm text-slate-400 mb-6">
            Drag a photo from one project onto another. Hero and service photos stay put.
          </p>
          <div className="flex flex-col gap-6">
            {PROJECT_GROUPS.map((group) => {
              const photos = imagesForProject(gallery, group.id);
              const active = overProject === group.id;
              return (
                <div
                  key={group.id}
                  data-project={group.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    setOverProject(group.id);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverProject(null);
                  }}
                  onDrop={(e) => dropOnProject(group.id, e)}
                  className={`rounded-xl border p-3 ${
                    active ? "border-[#2665AA] bg-[#2665AA]/15" : "border-white/10 bg-[#0a0f1e]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="font-bold">{group.title}</h3>
                    <AddPhotosButton
                      disabled={busy || !supabaseConfigured}
                      onFile={(file) => void upload("projects", file, group.title, group.id)}
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 min-h-24">
                    {photos.map((img) => (
                      <DraggablePhoto
                        key={img.id}
                        image={img}
                        busy={busy}
                        onRemove={() =>
                          void persist({ images: sendProjectPhotoToUnused(gallery.images, img.id) })
                        }
                      />
                    ))}
                    {photos.length === 0 && (
                      <p className="col-span-full text-sm text-slate-500 py-6 text-center">
                        Drop photos here or add new ones.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h2 className="text-lg font-bold mb-1">About</h2>
          <p className="text-sm text-slate-400 mb-4">The three About photos.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {ABOUT_CARDS.map((card) => {
              const image = imagesForSlot(gallery, card.slot)[0];
              return (
                <ReplaceCard
                  key={card.slot}
                  title={card.label}
                  image={image}
                  busy={busy || !supabaseConfigured}
                  onReplace={(file) => void upload(card.slot, file, card.label)}
                />
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h2 className="text-lg font-bold mb-1">Trusted clients</h2>
          <p className="text-sm text-slate-400 mb-4">Logos on the homepage strip.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {clients.map((img) => (
              <div key={img.id} className="rounded-xl border border-white/10 bg-[#0a0f1e] overflow-hidden">
                <div className="relative h-24 bg-[#f4f6f8] flex items-center justify-center p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt} className="max-h-16 w-auto max-w-full object-contain" />
                </div>
                <p className="px-3 pt-2 text-xs text-slate-400 truncate">{img.alt}</p>
                <div className="p-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      void persist({ images: gallery.images.filter((item) => item.id !== img.id) })
                    }
                    className="min-h-10 w-full rounded-lg border border-[#E01F26]/40 text-[#ffb4b6] text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <AddPhotosButton
              disabled={busy || !supabaseConfigured}
              label="Add logo"
              onFile={(file) => void upload("clients", file)}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function ReplaceCard({
  title,
  image,
  busy,
  onReplace,
}: {
  title: string;
  image?: GalleryImage;
  busy: boolean;
  onReplace: (file: File) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0a0f1e]">
      <p className="px-3 pt-3 text-sm font-semibold">{title}</p>
      <div className="relative h-36 mt-2 bg-black/30">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
        ) : (
          <p className="px-3 py-10 text-sm text-slate-500 text-center">No photo yet.</p>
        )}
      </div>
      <div className="p-3">
        <ReplaceButton disabled={busy} onFile={onReplace} />
      </div>
    </div>
  );
}

function DraggablePhoto({
  image,
  busy,
  onRemove,
}: {
  image: GalleryImage;
  busy: boolean;
  onRemove: () => void;
}) {
  return (
    <div
      draggable={!busy}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", image.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className="rounded-xl overflow-hidden border border-white/10 bg-black/20 cursor-grab active:cursor-grabbing"
    >
      <div className="relative h-28">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.url} alt={image.alt} className="w-full h-full object-cover pointer-events-none" />
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={onRemove}
        className="min-h-10 w-full text-xs font-semibold text-[#ffb4b6] border-t border-white/10"
      >
        Remove
      </button>
    </div>
  );
}

function ReplaceButton({ disabled, onFile }: { disabled: boolean; onFile: (file: File) => void }) {
  return (
    <FileBtn disabled={disabled} onFile={onFile}>
      Replace image
    </FileBtn>
  );
}

function AddPhotosButton({
  disabled,
  onFile,
  label = "Add photos",
}: {
  disabled: boolean;
  onFile: (file: File) => void;
  label?: string;
}) {
  return (
    <FileBtn disabled={disabled} onFile={onFile}>
      <Upload className="w-4 h-4" /> {label}
    </FileBtn>
  );
}

function FileBtn({
  children,
  disabled,
  onFile,
}: {
  children: ReactNode;
  disabled: boolean;
  onFile: (file: File) => void;
}) {
  return (
    <label
      className={`inline-flex items-center justify-center gap-2 min-h-12 px-4 rounded-xl bg-[#2665AA] font-semibold cursor-pointer ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
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
