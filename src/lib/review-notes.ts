import { createAnonClient, supabaseConfigured } from "@/lib/supabase";

export const REVIEW_NOTES_TABLE = "glacier_air_review_notes";

export const REVIEW_STATUSES = ["open", "done", "dismissed"] as const;
export type ReviewNoteStatus = (typeof REVIEW_STATUSES)[number];

export type ReviewNote = {
  id: string;
  page_path: string;
  selector: string | null;
  quote: string;
  note: string;
  status: ReviewNoteStatus;
  created_at: string;
  updated_at: string;
};

export function isReviewNoteStatus(value: string): value is ReviewNoteStatus {
  return (REVIEW_STATUSES as readonly string[]).includes(value);
}

function asNote(row: ReviewNote): ReviewNote {
  return {
    id: row.id,
    page_path: row.page_path,
    selector: row.selector,
    quote: row.quote,
    note: row.note,
    status: isReviewNoteStatus(row.status) ? row.status : "open",
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listReviewNotes(status?: ReviewNoteStatus): Promise<ReviewNote[]> {
  if (!supabaseConfigured()) throw new Error("Notes storage is not connected.");
  const client = createAnonClient();
  let query = client
    .from(REVIEW_NOTES_TABLE)
    .select("id, page_path, selector, quote, note, status, created_at, updated_at")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error(error.message || "Could not load notes.");
  return (data ?? []).map(asNote);
}

export async function createReviewNote(input: {
  page_path: string;
  selector: string | null;
  quote: string;
  note: string;
}): Promise<ReviewNote> {
  if (!supabaseConfigured()) throw new Error("Notes storage is not connected.");
  const client = createAnonClient();
  const { data, error } = await client
    .from(REVIEW_NOTES_TABLE)
    .insert({
      page_path: input.page_path,
      selector: input.selector,
      quote: input.quote,
      note: input.note,
      status: "open",
    })
    .select("id, page_path, selector, quote, note, status, created_at, updated_at")
    .single();
  if (error || !data) throw new Error(error?.message || "Could not save note.");
  return asNote(data);
}

export async function updateReviewNoteStatus(id: string, status: ReviewNoteStatus): Promise<ReviewNote> {
  if (!supabaseConfigured()) throw new Error("Notes storage is not connected.");
  const client = createAnonClient();
  const { data, error } = await client
    .from(REVIEW_NOTES_TABLE)
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, page_path, selector, quote, note, status, created_at, updated_at")
    .single();
  if (error || !data) throw new Error(error?.message || "Could not update note.");
  return asNote(data);
}
