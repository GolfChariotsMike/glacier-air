"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  Check,
  Highlighter,
  Inbox,
  LogOut,
  MessageSquareText,
  X,
} from "lucide-react";
import type { ReviewNote, ReviewNoteStatus } from "@/lib/review-notes";
import { cssPath, findNotedElement, findTextTarget, visibleText } from "@/lib/review-target";

type Draft = {
  quote: string;
  selector: string;
  x: number;
  y: number;
};

const OPEN_ATTR = "data-review-open";
const HOVER_ATTR = "data-review-hover";

export default function ReviewOverlay({
  children,
  initialNotes,
}: {
  children: ReactNode;
  initialNotes: ReviewNote[];
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [addNote, setAddNote] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(true);
  const [inboxFilter, setInboxFilter] = useState<"open" | "all">("open");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [draftNote, setDraftNote] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const hoverEl = useRef<HTMLElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const markerLayerRef = useRef<HTMLDivElement | null>(null);

  const openNotes = useMemo(() => notes.filter((note) => note.status === "open"), [notes]);
  const listed = inboxFilter === "open" ? openNotes : notes;
  const openIndex = useMemo(() => {
    const map = new Map<string, number>();
    openNotes.forEach((note, i) => map.set(note.id, i + 1));
    return map;
  }, [openNotes]);

  useEffect(() => {
    document.documentElement.dataset.reviewToolbar = "on";
    return () => {
      delete document.documentElement.dataset.reviewToolbar;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("review-add-note", addNote);
    return () => document.body.classList.remove("review-add-note");
  }, [addNote]);

  const paintHighlights = useCallback(() => {
    document.querySelectorAll(`[${OPEN_ATTR}]`).forEach((el) => {
      el.removeAttribute(OPEN_ATTR);
    });

    const layer = markerLayerRef.current;
    if (layer) layer.replaceChildren();

    openNotes.forEach((note, i) => {
      const el = findNotedElement(document, note.selector, note.quote);
      if (!el) return;
      el.setAttribute(OPEN_ATTR, String(i + 1));
      if (!layer) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 && rect.height < 2) return;
      const marker = document.createElement("span");
      marker.className = "review-marker fixed z-[70] pointer-events-none";
      marker.setAttribute("data-review-ui", "");
      marker.textContent = String(i + 1);
      marker.style.top = `${Math.max(8, rect.top - 8)}px`;
      marker.style.left = `${Math.min(window.innerWidth - 28, Math.max(8, rect.left - 10))}px`;
      layer.appendChild(marker);
    });
  }, [openNotes]);

  useEffect(() => {
    const layer = markerLayerRef.current;
    paintHighlights();
    const onRefresh = () => paintHighlights();
    window.addEventListener("scroll", onRefresh, true);
    window.addEventListener("resize", onRefresh);
    return () => {
      window.removeEventListener("scroll", onRefresh, true);
      window.removeEventListener("resize", onRefresh);
      document.querySelectorAll(`[${OPEN_ATTR}]`).forEach((el) => el.removeAttribute(OPEN_ATTR));
      layer?.replaceChildren();
    };
  }, [paintHighlights]);

  useEffect(() => {
    if (!addNote) {
      if (hoverEl.current) {
        hoverEl.current.removeAttribute(HOVER_ATTR);
        hoverEl.current = null;
      }
      return;
    }

    function onMove(event: MouseEvent) {
      const next = findTextTarget(event.target);
      if (hoverEl.current === next) return;
      hoverEl.current?.removeAttribute(HOVER_ATTR);
      hoverEl.current = next;
      next?.setAttribute(HOVER_ATTR, "");
    }

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-review-ui]")) return;
      const el = findTextTarget(target);
      if (!el) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setDraft({
        quote: visibleText(el).slice(0, 500),
        selector: cssPath(el),
        x: event.clientX,
        y: event.clientY,
      });
      setDraftNote("");
      setStatus("");
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click", onClick, true);
      hoverEl.current?.removeAttribute(HOVER_ATTR);
      hoverEl.current = null;
    };
  }, [addNote]);

  useEffect(() => {
    if (!draft) return;
    textareaRef.current?.focus();
  }, [draft]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDraft(null);
        setAddNote(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  async function saveDraft() {
    if (!draft) return;
    setBusy(true);
    setStatus("");
    const res = await fetch("/api/admin/review-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_path: "/",
        selector: draft.selector,
        quote: draft.quote,
        note: draftNote,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { note?: ReviewNote; error?: string };
    setBusy(false);
    if (!res.ok || !data.note) {
      setStatus(data.error || "Could not save note.");
      return;
    }
    setNotes((prev) => [data.note!, ...prev.filter((item) => item.id !== data.note!.id)]);
    setDraft(null);
    setDraftNote("");
    setInboxOpen(true);
    setInboxFilter("open");
    setStatus("Note saved.");
  }

  async function setNoteStatus(id: string, next: ReviewNoteStatus) {
    setBusy(true);
    const res = await fetch("/api/admin/review-notes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    const data = (await res.json().catch(() => ({}))) as { note?: ReviewNote; error?: string };
    setBusy(false);
    if (!res.ok || !data.note) {
      setStatus(data.error || "Could not update note.");
      return;
    }
    setNotes((prev) => prev.map((item) => (item.id === id ? data.note! : item)));
  }

  function jumpTo(note: ReviewNote) {
    const el = findNotedElement(document, note.selector, note.quote);
    if (!el) {
      setStatus("Could not find that line on the page.");
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.setAttribute(OPEN_ATTR, openIndex.get(note.id)?.toString() || "1");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  const popoverStyle = draft
    ? {
        top: Math.min(Math.max(12, draft.y + 16), window.innerHeight - 280),
        left: Math.min(Math.max(12, draft.x - 20), window.innerWidth - 372),
      }
    : undefined;

  return (
    <>
      <header
        data-review-ui
        className="review-toolbar fixed top-0 inset-x-0 z-[80] h-13 bg-[#060c1a] border-b border-white/10 text-white"
      >
        <div className="h-13 px-3 sm:px-4 flex items-center gap-2 sm:gap-3">
          <Image
            src="/glacier-air-logo.png"
            alt="Glacier Air"
            width={120}
            height={24}
            className="h-6 w-auto hidden sm:block"
          />
          <p className="text-sm font-semibold truncate">Copy review</p>
          <button
            type="button"
            aria-pressed={addNote}
            onClick={() => {
              setAddNote((on) => {
                const next = !on;
                if (next) setInboxOpen(false);
                return next;
              });
              setDraft(null);
            }}
            className={`inline-flex items-center justify-center gap-2 min-h-10 px-3 rounded-lg text-sm font-semibold ${
              addNote
                ? "bg-[#facc15] text-[#1a1400]"
                : "bg-[#2665AA] text-white"
            }`}
          >
            <Highlighter className="w-4 h-4" />
            {addNote ? "Click text…" : "Add note"}
          </button>
          <button
            type="button"
            aria-pressed={inboxOpen}
            onClick={() => setInboxOpen((on) => !on)}
            className={`inline-flex items-center justify-center gap-2 min-h-10 px-3 rounded-lg text-sm font-semibold border ${
              inboxOpen ? "border-[#facc15]/70 bg-white/10" : "border-white/15"
            }`}
          >
            <Inbox className="w-4 h-4" />
            Notes
            <span className="min-w-5 px-1 rounded-full bg-[#facc15] text-[#1a1400] text-xs font-bold text-center">
              {openNotes.length}
            </span>
          </button>
          <a
            href="/admin"
            className="hidden sm:inline-flex items-center min-h-10 px-3 rounded-lg text-sm font-semibold border border-white/15"
          >
            Photos
          </a>
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex items-center justify-center gap-2 min-h-10 px-3 rounded-lg border border-white/15 text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      <div className="review-site">{children}</div>
      <div ref={markerLayerRef} data-review-ui className="contents" />

      {draft && (
        <div
          data-review-ui
          className="fixed z-[90] w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-white/15 bg-[#0a0f1e] text-white shadow-2xl shadow-black/50 p-4"
          style={popoverStyle}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <p className="text-xs uppercase tracking-wide text-slate-400 flex items-center gap-1.5">
              <MessageSquareText className="w-3.5 h-3.5" />
              Selected text
            </p>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="p-1 rounded-md hover:bg-white/10"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <blockquote className="text-sm text-slate-200 bg-white/5 border border-white/10 rounded-xl px-3 py-2 mb-3 max-h-24 overflow-auto">
            “{draft.quote}”
          </blockquote>
          <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="review-note">
            Your note
          </label>
          <textarea
            id="review-note"
            ref={textareaRef}
            value={draftNote}
            onChange={(e) => setDraftNote(e.target.value)}
            rows={4}
            placeholder="What should this say instead?"
            className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-sm"
          />
          {status && (
            <p className="mt-2 text-sm text-red-300" role="alert">
              {status}
            </p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={busy || !draftNote.trim()}
              onClick={() => void saveDraft()}
              className="flex-1 min-h-11 rounded-xl bg-[#2665AA] font-semibold disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="min-h-11 px-4 rounded-xl border border-white/15 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {inboxOpen && (
        <aside
          data-review-ui
          className="review-inbox fixed top-13 right-0 bottom-0 z-[75] w-full max-w-md bg-[#060c1a] border-l border-white/10 text-white overflow-y-auto"
        >
          <div className="px-4 py-4 border-b border-white/10 sticky top-0 bg-[#060c1a]">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="font-bold">Review notes</h2>
              <button
                type="button"
                onClick={() => setInboxOpen(false)}
                className="p-1.5 rounded-md hover:bg-white/10"
                aria-label="Close notes"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInboxFilter("open")}
                className={`min-h-9 px-3 rounded-lg text-sm font-semibold ${
                  inboxFilter === "open" ? "bg-[#2665AA]" : "bg-white/5 border border-white/10"
                }`}
              >
                Open ({openNotes.length})
              </button>
              <button
                type="button"
                onClick={() => setInboxFilter("all")}
                className={`min-h-9 px-3 rounded-lg text-sm font-semibold ${
                  inboxFilter === "all" ? "bg-[#2665AA]" : "bg-white/5 border border-white/10"
                }`}
              >
                All ({notes.length})
              </button>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3">
            {listed.length === 0 && (
              <p className="text-sm text-slate-400">
                {inboxFilter === "open"
                  ? "No open notes. Turn on Add note, then click a headline or paragraph."
                  : "No notes yet."}
              </p>
            )}
            {listed.map((note) => {
              const n = openIndex.get(note.id);
              return (
                <article key={note.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      {n ? `#${n} · ` : ""}
                      {note.status}
                    </p>
                    <p className="text-xs text-slate-500">{note.page_path}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => jumpTo(note)}
                    className="text-left w-full text-sm text-slate-200 italic mb-2 hover:text-white"
                  >
                    “{note.quote}”
                  </button>
                  <p className="text-sm text-white whitespace-pre-wrap mb-3">{note.note}</p>
                  <div className="flex flex-wrap gap-2">
                    {note.status !== "done" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void setNoteStatus(note.id, "done")}
                        className="inline-flex items-center gap-1.5 min-h-10 px-3 rounded-lg bg-[#2665AA] text-sm font-semibold disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" /> Done
                      </button>
                    )}
                    {note.status !== "dismissed" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void setNoteStatus(note.id, "dismissed")}
                        className="min-h-10 px-3 rounded-lg border border-white/15 text-sm font-semibold disabled:opacity-50"
                      >
                        Dismiss
                      </button>
                    )}
                    {note.status !== "open" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void setNoteStatus(note.id, "open")}
                        className="min-h-10 px-3 rounded-lg border border-white/15 text-sm font-semibold disabled:opacity-50"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </aside>
      )}

      {status && !draft && (
        <p
          data-review-ui
          className="fixed bottom-4 left-4 z-[85] rounded-xl bg-[#0a0f1e] border border-white/15 px-3 py-2 text-sm text-slate-200"
          role="status"
        >
          {status}
        </p>
      )}
    </>
  );
}
