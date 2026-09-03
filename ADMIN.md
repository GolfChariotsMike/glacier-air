# Glacier Air photo admin

Nick uses **https://glacier-air.vercel.app/admin** with the PIN. No GitHub login.

## What Nick can do

- Sign in with a PIN (no Gmail, no GitHub).
- Upload, replace, remove, and reorder **Projects** photos.
- Replace or clear the three **Services** card photos and the three **About** photos.
- Upload, replace, remove, and reorder **Trusted clients** logos.
- The homepage **hero rooftop photo is locked** (`/images/hero-bg.webp`). Nick cannot overwrite it.

If Nick has not uploaded anything yet, the public pages keep the current static photos from the repo.

## Storage (Mike)

Photos live in **GolfChariotsMike's Project** on Supabase — public bucket `glacier-air`.

On Vercel **Production** for this project, set:

```
NEXT_PUBLIC_SUPABASE_URL=https://obtbmywqrzotvspgmaiq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<project anon JWT>
SUPABASE_SERVICE_ROLE_KEY=<service role — server only, never NEXT_PUBLIC_>
```

The service role is required for upload, assign, and delete. Do not put it in `NEXT_PUBLIC_` variables. The anon key is already public; the site uses it (or the service role on the server) to read assigned photos.

Without the service role, Nick can still sign in and see the current fallback photos, but uploads stay disconnected.

## Local

```bash
npm run dev
```

Open http://localhost:3000/admin

Optional local env (same names as Production). Do not commit secrets.

## Notes

- Cookie session is httpOnly, SameSite=lax, Secure on production builds.
- PIN fallback is `1291` when `ADMIN_PIN` is unset. Failed PIN attempts are rate-limited (about 8 tries / 15 minutes per instance).
- `/admin` is noindex and disallowed in robots.txt.
- This change does not touch glacierair.com.au or any DNS/domain.
