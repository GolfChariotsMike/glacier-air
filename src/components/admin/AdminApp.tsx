"use client";

import { useEffect, useState, type DragEvent, type ReactNode } from "react";
import Image from "next/image";
import { LogOut, Upload } from "lucide-react";
import {
  fallbackProjects,
  imagesForProject,
  imagesForSlot,
  moveToProject,
  namedProjects,
  sendProjectPhotoToUnused,
  UNASSIGNED_ID,
  type CatalogueProject,
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
  const [projects, setProjects] = useState<CatalogueProject[]>(fallbackProjects);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [overProject, setOverProject] = useState<ProjectId | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPublicTitle, setNewPublicTitle] = useState("");

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setGallery(data.gallery);
          if (Array.isArray(data.projects)) setProjects(data.projects);
        }
      })
      .catch(() => setStatus("Could not load photos."));
  }, []);

  const hero = imagesForSlot(gallery, "hero")[0];
  const clients = imagesForSlot(gallery, "clients");

  async function persist(next: GalleryState) {
    const previous = gallery;
    setGallery(next);
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
      setGallery(previous);
      setStatus(data.error || "Could not save.");
      return;
    }
    if (data.gallery) setGallery(data.gallery);
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

  async function persistProjects(
    method: "POST" | "PATCH" | "DELETE",
    body: Record<string, unknown>,
    okMessage: string
  ) {
    setBusy(true);
    setStatus("");
    const res = await fetch("/api/admin/projects", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setStatus(data.error || "Could not save.");
      return false;
    }
    if (Array.isArray(data.projects)) setProjects(data.projects);
    if (data.gallery) setGallery(data.gallery);
    setStatus(okMessage);
    return true;
  }

  function setHero(id: ProjectId, rank: 1 | 2) {
    void persistProjects("PATCH", { id, heroRank: rank }, "Featured projects updated.");
  }

  function saveDescription(id: ProjectId, description: string) {
    void persistProjects("PATCH", { id, description }, "Description saved.");
  }

  async function addProject() {
    const ok = await persistProjects(
      "POST",
      { title: newTitle, publicTitle: newPublicTitle },
      "Project added."
    );
    if (ok) {
      setNewTitle("");
      setNewPublicTitle("");
    }
  }

  function removeProject(project: CatalogueProject) {
    if (project.id === UNASSIGNED_ID) return;
    if (!window.confirm(`Delete “${project.title}”? Photos move to Unassigned / other.`)) return;
    void persistProjects("DELETE", { id: project.id }, "Project deleted.");
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
            Choose the two homepage hero projects, add jobs, then drag photos between groups.
            Hero and service photos stay put.
          </p>

          <HeroProjectsPanel
            projects={projects}
            busy={busy || !supabaseConfigured}
            onSetHero={setHero}
            onSaveDescription={saveDescription}
          />

          <div className="mt-6 rounded-xl border border-white/10 bg-[#0a0f1e] p-3">
            <h3 className="font-bold mb-1">Add project</h3>
            <p className="text-sm text-slate-400 mb-3">
              Admin name plus the heading shown on the site. A kebab id is created automatically.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="text-xs uppercase tracking-wide text-slate-400">
                Admin name
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 min-h-12 w-full px-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-normal normal-case tracking-normal"
                  placeholder="e.g. Albany Cold Store"
                />
              </label>
              <label className="text-xs uppercase tracking-wide text-slate-400">
                Site heading
                <input
                  value={newPublicTitle}
                  onChange={(e) => setNewPublicTitle(e.target.value)}
                  className="mt-1 min-h-12 w-full px-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-normal normal-case tracking-normal"
                  placeholder="Optional — defaults to admin name"
                />
              </label>
            </div>
            <button
              type="button"
              disabled={busy || !supabaseConfigured || !newTitle.trim()}
              onClick={() => void addProject()}
              className="mt-3 min-h-12 px-4 rounded-xl bg-[#2665AA] font-semibold disabled:opacity-50"
            >
              Add project
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-6">
            {projects.map((group) => {
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
                    <div className="min-w-0">
                      <h3 className="font-bold truncate">{group.title}</h3>
                      {group.heroRank ? (
                        <p className="text-xs text-[#7eb4e6]">Homepage hero {group.heroRank}</p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {group.id !== UNASSIGNED_ID && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => removeProject(group)}
                          className="min-h-12 px-3 rounded-xl border border-[#E01F26]/40 text-[#ffb4b6] text-sm font-semibold"
                        >
                          Delete
                        </button>
                      )}
                      <AddPhotosButton
                        disabled={busy || !supabaseConfigured}
                        onFile={(file) => void upload("projects", file, group.title, group.id)}
                      />
                    </div>
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

function HeroProjectsPanel({
  projects,
  busy,
  onSetHero,
  onSaveDescription,
}: {
  projects: CatalogueProject[];
  busy: boolean;
  onSetHero: (id: ProjectId, rank: 1 | 2) => void;
  onSaveDescription: (id: ProjectId, description: string) => void;
}) {
  const named = namedProjects(projects);
  const hero1 = named.find((project) => project.heroRank === 1);
  const hero2 = named.find((project) => project.heroRank === 2);
  const heroes = [hero1, hero2].filter((project): project is CatalogueProject => Boolean(project));

  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0f1e] p-3">
      <h3 className="font-bold mb-1">Hero projects (homepage)</h3>
      <p className="text-sm text-slate-400 mb-3">
        Exactly two featured jobs when enough exist. Setting hero 1 or 2 replaces that slot.
      </p>
      <p className="text-sm text-slate-200 mb-4">
        Currently featured:{" "}
        {heroes.length
          ? heroes.map((project) => `${project.title} (hero ${project.heroRank})`).join(" · ")
          : "none yet"}
      </p>
      <div className="flex flex-col gap-2">
        {named.map((project) => (
          <div
            key={project.id}
            className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 rounded-lg border border-white/10 px-3 py-2"
          >
            <p className="flex-1 min-w-0 text-sm font-medium truncate">{project.title}</p>
            <div className="flex gap-2">
              <HeroRankButton
                label="Hero 1"
                active={project.heroRank === 1}
                disabled={busy}
                onClick={() => onSetHero(project.id, 1)}
              />
              <HeroRankButton
                label="Hero 2"
                active={project.heroRank === 2}
                disabled={busy}
                onClick={() => onSetHero(project.id, 2)}
              />
            </div>
          </div>
        ))}
      </div>
      {heroes.length > 0 && (
        <div className="mt-4 grid md:grid-cols-2 gap-3">
          {heroes.map((project) => (
            <HeroDescriptionField
              key={`${project.id}:${project.description}`}
              project={project}
              busy={busy}
              onSave={onSaveDescription}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HeroRankButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled || active}
      onClick={onClick}
      className={`min-h-10 px-3 rounded-lg text-xs font-semibold border ${
        active
          ? "border-[#2665AA] bg-[#2665AA]/30 text-white"
          : "border-white/15 text-slate-200 hover:border-[#2665AA]/70"
      } disabled:opacity-60`}
    >
      {active ? `Featured — ${label}` : `Set as ${label.toLowerCase()}`}
    </button>
  );
}

function HeroDescriptionField({
  project,
  busy,
  onSave,
}: {
  project: CatalogueProject;
  busy: boolean;
  onSave: (id: ProjectId, description: string) => void;
}) {
  const [value, setValue] = useState(project.description);

  return (
    <label className="text-xs uppercase tracking-wide text-slate-400">
      Hero {project.heroRank} — {project.title}
      <textarea
        value={value}
        disabled={busy}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          if (value.trim() !== project.description.trim()) onSave(project.id, value);
        }}
        rows={3}
        className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-normal normal-case tracking-normal resize-y"
        placeholder="Optional short blurb for the homepage"
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => onSave(project.id, value)}
        className="mt-2 min-h-10 px-3 rounded-lg border border-white/15 text-xs font-semibold text-slate-200"
      >
        Save description
      </button>
    </label>
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
