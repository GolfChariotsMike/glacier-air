"use client";

import { useEffect, useState, type DragEvent, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Upload } from "lucide-react";
import type { HireImage, HireUnit } from "@/lib/supabase-hire";

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

export default function HireAdmin({
  supabaseConfigured,
  onStatus,
}: {
  supabaseConfigured: boolean;
  onStatus: (message: string) => void;
}) {
  const [units, setUnits] = useState<HireUnit[]>([]);
  const [busy, setBusy] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [overImage, setOverImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/hire")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.units)) setUnits(data.units);
      })
      .catch(() => onStatus("Could not load hire units."));
    // Load once on mount; parent passes a stable setState.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function persist(
    url: string,
    method: "POST" | "PATCH" | "DELETE",
    body: Record<string, unknown>,
    okMessage: string
  ) {
    setBusy(true);
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      onStatus(data.error || "Could not save.");
      return false;
    }
    if (Array.isArray(data.units)) setUnits(data.units);
    onStatus(okMessage);
    return true;
  }

  async function addUnit() {
    const ok = await persist(
      "/api/admin/hire",
      "POST",
      { title: newTitle, description: newDescription },
      "Hire unit added."
    );
    if (ok) {
      setNewTitle("");
      setNewDescription("");
    }
  }

  function saveUnit(unit: HireUnit, title: string, description: string) {
    void persist(
      "/api/admin/hire",
      "PATCH",
      { id: unit.id, title, description },
      "Hire unit saved."
    );
  }

  function removeUnit(unit: HireUnit) {
    if (!window.confirm(`Delete “${unit.title}”? Photos will be removed.`)) return;
    void persist("/api/admin/hire", "DELETE", { id: unit.id }, "Hire unit deleted.");
  }

  function moveUnit(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= units.length) return;
    const ordered = [...units];
    const [moved] = ordered.splice(index, 1);
    ordered.splice(next, 0, moved);
    void persist(
      "/api/admin/hire",
      "PATCH",
      { orderedIds: ordered.map((unit) => unit.id) },
      "Hire order updated."
    );
  }

  async function upload(unit: HireUnit, file: File) {
    setBusy(true);
    onStatus("Uploading…");
    const compressed = await compressImage(file);
    const form = new FormData();
    form.set("file", compressed);
    form.set("unitId", unit.id);
    form.set("alt", file.name.replace(/\.\w+$/, "").replace(/[_-]/g, " ") || unit.title);
    const res = await fetch("/api/admin/hire/upload", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      onStatus(data.error || "Upload failed.");
      return;
    }
    if (Array.isArray(data.units)) setUnits(data.units);
    onStatus("Photo added.");
  }

  function removeImage(image: HireImage) {
    void persist("/api/admin/hire/images", "DELETE", { id: image.id }, "Photo removed.");
  }

  function dropImage(unit: HireUnit, targetId: string, event: DragEvent) {
    event.preventDefault();
    setOverImage(null);
    const sourceId = event.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === targetId) return;
    const from = unit.images.findIndex((image) => image.id === sourceId);
    const to = unit.images.findIndex((image) => image.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...unit.images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    void persist(
      "/api/admin/hire/images",
      "PATCH",
      { unitId: unit.id, orderedIds: next.map((image) => image.id) },
      "Photo order updated."
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <h2 className="text-lg font-bold mb-1">Equipment Hire</h2>
      <p className="text-sm text-slate-400 mb-6">
        Units shown on <a href="/hire" className="text-[#7eb4e6] underline-offset-2 hover:underline">/hire</a>.
        Title is required. Add photos, then drag to reorder.
      </p>

      <div className="rounded-xl border border-white/10 bg-[#0a0f1e] p-3">
        <h3 className="font-bold mb-1">Add unit</h3>
        <p className="text-sm text-slate-400 mb-3">Name plus an optional description for the public page.</p>
        <label className="text-xs uppercase tracking-wide text-slate-400">
          Title
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mt-1 min-h-12 w-full px-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-normal normal-case tracking-normal"
            placeholder="e.g. 20kW portable AC"
          />
        </label>
        <label className="mt-3 block text-xs uppercase tracking-wide text-slate-400">
          Description
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-normal normal-case tracking-normal resize-y"
            placeholder="Optional — capacity, power, typical use"
          />
        </label>
        <button
          type="button"
          disabled={busy || !supabaseConfigured || !newTitle.trim()}
          onClick={() => void addUnit()}
          className="mt-3 min-h-12 px-4 rounded-xl bg-[#2665AA] font-semibold disabled:opacity-50"
        >
          Add unit
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {units.map((unit, index) => (
          <HireUnitCard
            key={`${unit.id}:${unit.title}:${unit.description}`}
            unit={unit}
            index={index}
            total={units.length}
            busy={busy || !supabaseConfigured}
            overImage={overImage}
            onMove={moveUnit}
            onSave={saveUnit}
            onRemove={() => removeUnit(unit)}
            onUpload={(file) => upload(unit, file)}
            onRemoveImage={removeImage}
            onDragOverImage={setOverImage}
            onDropImage={(targetId, event) => dropImage(unit, targetId, event)}
          />
        ))}
        {units.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-6">No hire units yet.</p>
        )}
      </div>
    </section>
  );
}

function HireUnitCard({
  unit,
  index,
  total,
  busy,
  overImage,
  onMove,
  onSave,
  onRemove,
  onUpload,
  onRemoveImage,
  onDragOverImage,
  onDropImage,
}: {
  unit: HireUnit;
  index: number;
  total: number;
  busy: boolean;
  overImage: string | null;
  onMove: (index: number, direction: -1 | 1) => void;
  onSave: (unit: HireUnit, title: string, description: string) => void;
  onRemove: () => void;
  onUpload: (file: File) => void | Promise<void>;
  onRemoveImage: (image: HireImage) => void;
  onDragOverImage: (id: string | null) => void;
  onDropImage: (targetId: string, event: DragEvent) => void;
}) {
  const [title, setTitle] = useState(unit.title);
  const [description, setDescription] = useState(unit.description);

  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0f1e] p-3">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <label className="text-xs uppercase tracking-wide text-slate-400">
            Title
            <input
              value={title}
              disabled={busy}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 min-h-12 w-full px-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-normal normal-case tracking-normal"
            />
          </label>
          <label className="mt-3 block text-xs uppercase tracking-wide text-slate-400">
            Description
            <textarea
              value={description}
              disabled={busy}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-normal normal-case tracking-normal resize-y"
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={busy || index === 0}
            onClick={() => onMove(index, -1)}
            className="min-h-12 px-3 rounded-xl border border-white/15 text-sm font-semibold disabled:opacity-40"
            aria-label="Move unit up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={busy || index === total - 1}
            onClick={() => onMove(index, 1)}
            className="min-h-12 px-3 rounded-xl border border-white/15 text-sm font-semibold disabled:opacity-40"
            aria-label="Move unit down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onSave(unit, title, description)}
            className="min-h-12 px-3 rounded-xl border border-white/15 text-sm font-semibold"
          >
            Save
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onRemove}
            className="min-h-12 px-3 rounded-xl border border-[#E01F26]/40 text-[#ffb4b6] text-sm font-semibold"
          >
            Delete
          </button>
          <FileBtn disabled={busy} onFile={onUpload} multiple>
            <Upload className="w-4 h-4" /> Add photos
          </FileBtn>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 min-h-24">
        {unit.images.map((image) => (
          <div
            key={image.id}
            draggable={!busy}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", image.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              onDragOverImage(image.id);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) onDragOverImage(null);
            }}
            onDrop={(e) => onDropImage(image.id, e)}
            className={`rounded-xl overflow-hidden border bg-black/20 cursor-grab active:cursor-grabbing ${
              overImage === image.id ? "border-[#2665AA]" : "border-white/10"
            }`}
          >
            <div className="relative h-28">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => onRemoveImage(image)}
              className="min-h-10 w-full text-xs font-semibold text-[#ffb4b6] border-t border-white/10"
            >
              Remove
            </button>
          </div>
        ))}
        {unit.images.length === 0 && (
          <p className="col-span-full text-sm text-slate-500 py-6 text-center">
            Add photos for this unit.
          </p>
        )}
      </div>
    </div>
  );
}

function FileBtn({
  children,
  disabled,
  onFile,
  multiple = false,
}: {
  children: ReactNode;
  disabled: boolean;
  onFile: (file: File) => void | Promise<void>;
  multiple?: boolean;
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
        multiple={multiple}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          void (async () => {
            for (const file of files) await onFile(file);
          })();
        }}
      />
    </label>
  );
}
