import { createAnonClient, GALLERY_BUCKET, supabaseConfigured } from "@/lib/supabase";
import { pathFromPublicUrl } from "@/lib/supabase-gallery";

export { supabaseConfigured };

const UNITS_TABLE = "glacier_air_hire_units";
const IMAGES_TABLE = "glacier_air_hire_images";

export type HireImage = {
  id: string;
  unitId: string;
  url: string;
  path: string | null;
  alt: string;
  sortOrder: number;
};

export type HireUnit = {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  images: HireImage[];
};

type UnitRow = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
};

type ImageRow = {
  id: string;
  unit_id: string;
  url: string;
  path: string | null;
  alt: string;
  sort_order: number;
};

function fromImageRow(row: ImageRow): HireImage {
  return {
    id: row.id,
    unitId: row.unit_id,
    url: row.url,
    path: row.path,
    alt: row.alt ?? "",
    sortOrder: Number.isFinite(row.sort_order) ? row.sort_order : 0,
  };
}

function sortUnits(units: HireUnit[]): HireUnit[] {
  return [...units].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

function assemble(unitRows: UnitRow[], imageRows: ImageRow[]): HireUnit[] {
  const byUnit = new Map<string, HireImage[]>();
  for (const row of imageRows) {
    const list = byUnit.get(row.unit_id) ?? [];
    list.push(fromImageRow(row));
    byUnit.set(row.unit_id, list);
  }
  for (const list of byUnit.values()) {
    list.sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return sortUnits(
    unitRows.map((row) => ({
      id: row.id,
      title: row.title,
      description: typeof row.description === "string" ? row.description : "",
      sortOrder: Number.isFinite(row.sort_order) ? row.sort_order : 0,
      images: byUnit.get(row.id) ?? [],
    }))
  );
}

async function fetchUnitsAndImages(): Promise<HireUnit[]> {
  const client = createAnonClient();
  const [unitsRes, imagesRes] = await Promise.all([
    client.from(UNITS_TABLE).select("id, title, description, sort_order").order("sort_order", { ascending: true }),
    client
      .from(IMAGES_TABLE)
      .select("id, unit_id, url, path, alt, sort_order")
      .order("sort_order", { ascending: true }),
  ]);
  if (unitsRes.error) throw new Error(unitsRes.error.message || "Could not load hire units.");
  if (imagesRes.error) throw new Error(imagesRes.error.message || "Could not load hire photos.");
  return assemble((unitsRes.data ?? []) as UnitRow[], (imagesRes.data ?? []) as ImageRow[]);
}

export async function readHireUnits(): Promise<HireUnit[]> {
  if (!supabaseConfigured()) return [];
  try {
    return await fetchUnitsAndImages();
  } catch {
    return [];
  }
}

async function requireUnits(): Promise<HireUnit[]> {
  if (!supabaseConfigured()) {
    throw new Error("Photo storage is not connected.");
  }
  return fetchUnitsAndImages();
}

export async function createHireUnit(input: {
  title: string;
  description?: string;
}): Promise<HireUnit[]> {
  const title = input.title.trim();
  if (!title) throw new Error("Enter a unit name.");
  const description = (input.description ?? "").trim();
  const units = await requireUnits();
  const maxSort = units.reduce((n, unit) => Math.max(n, unit.sortOrder), 0);

  const client = createAnonClient();
  const { error } = await client.from(UNITS_TABLE).insert({
    title,
    description,
    sort_order: maxSort + 10,
  });
  if (error) throw new Error(error.message || "Could not add hire unit.");
  return fetchUnitsAndImages();
}

export async function updateHireUnit(
  id: string,
  patch: { title?: string; description?: string }
): Promise<HireUnit[]> {
  const units = await requireUnits();
  if (!units.some((unit) => unit.id === id)) throw new Error("Hire unit not found.");

  const next: { title?: string; description?: string; updated_at: string } = {
    updated_at: new Date().toISOString(),
  };
  if (typeof patch.title === "string") {
    const title = patch.title.trim();
    if (!title) throw new Error("Enter a unit name.");
    next.title = title;
  }
  if (typeof patch.description === "string") {
    next.description = patch.description.trim();
  }
  if (Object.keys(next).length === 1) return units;

  const client = createAnonClient();
  const { error } = await client.from(UNITS_TABLE).update(next).eq("id", id);
  if (error) throw new Error(error.message || "Could not save hire unit.");
  return fetchUnitsAndImages();
}

export async function reorderHireUnits(orderedIds: string[]): Promise<HireUnit[]> {
  const units = await requireUnits();
  const known = new Set(units.map((unit) => unit.id));
  const ids = orderedIds.filter((id) => known.has(id));
  if (!ids.length) return units;

  const client = createAnonClient();
  const now = new Date().toISOString();
  for (let i = 0; i < ids.length; i += 1) {
    const { error } = await client
      .from(UNITS_TABLE)
      .update({ sort_order: (i + 1) * 10, updated_at: now })
      .eq("id", ids[i]);
    if (error) throw new Error(error.message || "Could not reorder hire units.");
  }
  return fetchUnitsAndImages();
}

async function deleteStoredObject(path: string | null | undefined, url: string) {
  const storagePath = path || pathFromPublicUrl(url);
  if (!storagePath) return;
  try {
    const client = createAnonClient();
    await client.storage.from(GALLERY_BUCKET).remove([storagePath]);
  } catch {
    // Keep the table consistent even if the object is already gone.
  }
}

export async function deleteHireUnit(id: string): Promise<HireUnit[]> {
  const units = await requireUnits();
  const target = units.find((unit) => unit.id === id);
  if (!target) throw new Error("Hire unit not found.");

  await Promise.all(target.images.map((image) => deleteStoredObject(image.path, image.url)));

  const client = createAnonClient();
  const { error } = await client.from(UNITS_TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message || "Could not delete hire unit.");
  return fetchUnitsAndImages();
}

export async function uploadHireFile(file: File, unitId: string, filename: string) {
  if (!supabaseConfigured()) {
    throw new Error("Photo storage is not connected.");
  }
  const units = await requireUnits();
  if (!units.some((unit) => unit.id === unitId)) throw new Error("Hire unit not found.");

  const client = createAnonClient();
  const path = `hire/${unitId}/${filename}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await client.storage.from(GALLERY_BUCKET).upload(path, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error(error.message || "Could not upload photo.");

  const { data } = client.storage.from(GALLERY_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, storagePath: path };
}

export async function addHireImage(input: {
  unitId: string;
  url: string;
  path: string;
  alt: string;
}): Promise<HireUnit[]> {
  const units = await requireUnits();
  const unit = units.find((item) => item.id === input.unitId);
  if (!unit) throw new Error("Hire unit not found.");

  const maxSort = unit.images.reduce((n, image) => Math.max(n, image.sortOrder), -1);
  const client = createAnonClient();
  const { error } = await client.from(IMAGES_TABLE).insert({
    unit_id: input.unitId,
    url: input.url,
    path: input.path,
    alt: input.alt,
    sort_order: maxSort + 1,
  });
  if (error) throw new Error(error.message || "Could not save hire photo.");

  await client
    .from(UNITS_TABLE)
    .update({ updated_at: new Date().toISOString() })
    .eq("id", input.unitId);

  return fetchUnitsAndImages();
}

export async function reorderHireImages(unitId: string, orderedIds: string[]): Promise<HireUnit[]> {
  const units = await requireUnits();
  const unit = units.find((item) => item.id === unitId);
  if (!unit) throw new Error("Hire unit not found.");

  const known = new Set(unit.images.map((image) => image.id));
  const ids = orderedIds.filter((id) => known.has(id));
  if (!ids.length) return units;

  const client = createAnonClient();
  for (let i = 0; i < ids.length; i += 1) {
    const { error } = await client.from(IMAGES_TABLE).update({ sort_order: i }).eq("id", ids[i]);
    if (error) throw new Error(error.message || "Could not reorder hire photos.");
  }
  return fetchUnitsAndImages();
}

export async function deleteHireImage(id: string): Promise<HireUnit[]> {
  const units = await requireUnits();
  const image = units.flatMap((unit) => unit.images).find((item) => item.id === id);
  if (!image) throw new Error("Hire photo not found.");

  await deleteStoredObject(image.path, image.url);

  const client = createAnonClient();
  const { error } = await client.from(IMAGES_TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message || "Could not remove hire photo.");
  return fetchUnitsAndImages();
}
