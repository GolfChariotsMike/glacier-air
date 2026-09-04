# Glacier Air photo admin

Nick uses **https://glacier-air.vercel.app/admin** with the PIN. No GitHub login.

## Layout

1. **Hero** — one large homepage photo. **Replace image** only. Not draggable into projects.
2. **Services** — Air conditioning, Refrigeration, Mechanical. Each has **Replace image**.
3. **Projects**
   - **Hero projects (homepage)** — set exactly which two jobs are featured (hero 1 and hero 2). Optional short description per hero; blank is fine.
   - **Add project** — admin name + site heading. Creates a kebab slug id and an empty photo group.
   - Drag photos between projects. Each project has **Add photos**. Remove sends a photo to Unassigned / other.
   - Delete a project (not Unassigned) and its photos move to Unassigned.
4. **About** and **Trusted clients** sit at the bottom.

## Storage

Photos live in **GolfChariotsMike's Project** on Supabase — public bucket `glacier-air`. Project grouping is stored in `project_id` on `glacier_air_gallery_images`.

The app already knows the project URL and the public anon JWT. No service role key. No Vercel Blob.

## Local

```bash
npm run dev
```

Open http://localhost:3000/admin

PIN fallback is `1291` when `ADMIN_PIN` is unset.

This change does not touch glacierair.com.au or any DNS/domain.
