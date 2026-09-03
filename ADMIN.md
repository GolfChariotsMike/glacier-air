# Glacier Air photo admin

Open **https://glacier-air.vercel.app/admin**, enter the PIN, and manage job photos.

## What Nick can do

- Sign in with a PIN (no Gmail).
- Upload, replace, remove, and reorder **Projects** photos.
- Replace or clear the three **Services** card photos and the three **About** photos.
- The homepage **hero rooftop photo is locked** (Mike). Nick cannot overwrite it.

If Nick has not uploaded anything yet, the public pages keep the current static photos.

## Uploads

Connect Vercel Blob on this project so **`BLOB_READ_WRITE_TOKEN`** is set. Without it, Nick can sign in but cannot save uploads.

## Local

```bash
npm run dev
```

Open http://localhost:3000/admin

## Notes

- Cookie session is httpOnly, SameSite=lax, Secure on production builds.
- Failed PIN attempts are rate-limited (about 8 tries / 15 minutes per instance).
- `/admin` is noindex and disallowed in robots.txt.
- This PR does not change glacierair.com.au DNS.
