# Glacier Air photo admin

Nick manages job photos at **`/admin`** on the Vercel preview (`https://glacier-air.vercel.app/admin`). This is **not** on the live WordPress site. Do not point glacierair.com.au at this app until you are ready.

## What Nick can do

- Sign in with a PIN (no Gmail).
- Upload, replace, remove, and reorder **Projects** photos.
- Replace or clear the three **Services** card photos and the three **About** photos.
- The homepage **hero rooftop photo is locked** (Mike). Nick cannot overwrite it.

If Nick has not uploaded anything yet, the public pages keep the current static photos.

## Vercel preview env (set these on the preview project only)

In the Vercel project for `glacier-air` (preview), add:

1. **`ADMIN_PIN`** — a PIN you give Nick only. Never commit it. If this is missing, `/admin` shows “set ADMIN_PIN on Vercel” and nobody can get in.
2. **Vercel Blob** — Storage → Blob → connect to the project. That sets **`BLOB_READ_WRITE_TOKEN`**. Without it, Nick can sign in but cannot save uploads.

Redeploy the preview after saving env vars.

## Local

```bash
ADMIN_PIN=your-pin-here BLOB_READ_WRITE_TOKEN=vercel_blob_xxx npm run dev
```

Open http://localhost:3000/admin

## Notes

- Cookie session is httpOnly, SameSite=lax, Secure on production builds.
- Failed PIN attempts are rate-limited (about 8 tries / 15 minutes per instance).
- `/admin` is noindex and disallowed in robots.txt.
- Live domain glacierair.com.au is not changed by this PR.
