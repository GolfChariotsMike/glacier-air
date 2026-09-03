# Glacier Air photo admin

Nick uses **https://glacier-air.vercel.app/admin** with the PIN. No GitHub login.

## What Nick can do

- Sign in with a PIN (no Gmail, no GitHub).
- Change the homepage **hero**, **Services**, **About**, **Projects**, and **Trusted clients** photos.
- See the current site photos in every slot (not empty cards).
- Move an existing photo to another slot without re-uploading. Replacing a single-image slot (hero / about / services) sends the old photo to the unused library.
- Upload new files. Reorder Projects and client logos.

If Nick has not saved anything yet, admin and the public pages use the photos already in the repo.

## Storage

Photos live in **GolfChariotsMike's Project** on Supabase — public bucket `glacier-air`.

The app already knows the project URL and the public anon JWT. Vercel Production does not need new env vars for gallery uploads. Optional overrides:

```
NEXT_PUBLIC_SUPABASE_URL=https://obtbmywqrzotvspgmaiq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<project anon JWT>
```

Server uploads and deletes use `createClient(url, anonKey)` plus PIN cookie auth. There is no service role key.

## Local

```bash
npm run dev
```

Open http://localhost:3000/admin

## Notes

- Cookie session is httpOnly, SameSite=lax, Secure on production builds.
- PIN fallback is `1291` when `ADMIN_PIN` is unset. Failed PIN attempts are rate-limited (about 8 tries / 15 minutes per instance).
- `/admin` is noindex and disallowed in robots.txt.
- This change does not touch glacierair.com.au or any DNS/domain.
