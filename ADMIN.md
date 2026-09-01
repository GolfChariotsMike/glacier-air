# Glacier Air photo admin

Nick manages job photos at **https://glacier-air.vercel.app/admin**. That URL is this Vercel project.

## What Nick can do

- Sign in with a PIN (no Gmail).
- Upload, replace, remove, and reorder **Projects** photos.
- Replace or clear the three **Services** card photos and the three **About** photos.
- The homepage **hero rooftop photo is locked** (Mike). Nick cannot overwrite it.

If Nick has not uploaded anything yet, the public pages keep the current static photos.

## Environment variables

Set these on **this Vercel project**. Add them for both **Production** and **Preview** environments if you need `/admin` on the URL you are using.

1. **`ADMIN_PIN`** — a PIN you give Nick only. Never commit it. If this is missing at runtime, `/admin` shows “Admin is locked”. If it is set, Nick sees the PIN form.
2. **Vercel Blob** — Storage → Blob → connect to the project. That sets **`BLOB_READ_WRITE_TOKEN`**. Without it, Nick can sign in but cannot save uploads.

After saving env vars, **Redeploy**, then reload `/admin`.

## Local

```bash
ADMIN_PIN=your-pin-here BLOB_READ_WRITE_TOKEN=vercel_blob_xxx npm run dev
```

Open http://localhost:3000/admin

## Notes

- Cookie session is httpOnly, SameSite=lax, Secure on production builds.
- Failed PIN attempts are rate-limited (about 8 tries / 15 minutes per instance).
- `/admin` is noindex and disallowed in robots.txt.
- This PR does not change glacierair.com.au DNS. That domain stays WordPress until you point it here.
