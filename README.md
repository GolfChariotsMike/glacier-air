# Glacier Air

Next.js site for [glacierair.com.au](https://glacierair.com.au) — air conditioning, refrigeration, and mechanical services (Perth / South West / Great Southern WA).

Photo admin for Nick is in [ADMIN.md](./ADMIN.md) (`/admin`, PIN + Supabase).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Copy [`.env.example`](./.env.example) to `.env.local` and add `RESEND_API_KEY` so the contact and hire forms can send.

## Production go-live (Mike)

**Do this at Crazy Domains / Syra DNS only. Do not change MX. Do not touch glacier.net.au.**

| Item | Today | After cutover |
| --- | --- | --- |
| Website | WordPress at `43.250.142.72` | This Next.js app on Vercel |
| Preview / current Vercel production | [https://glacier-air.vercel.app](https://glacier-air.vercel.app) | Same project; custom domain added |
| Mail | `MX 0 webmail.glacierair.com.au` | **Unchanged** |
| Nameservers | `ns1.syrahost.com` / `ns2.syrahost.com` | **Unchanged** (do not move DNS to Vercel) |

1. In Vercel → **glacier-air** → Settings → Domains, add `glacierair.com.au` and accept the `www` redirect Vercel offers.
2. Copy the **exact** A / CNAME / TXT values from that domain card (they can differ slightly by project). Typical values are below.
3. At Crazy Domains / Syra, change **only** the website records. Leave MX, webmail, and existing mailbox TXT/SPF alone unless Resend needs a merge (see below).
4. Add `RESEND_API_KEY` (and `RESEND_FROM` / `CONTACT_TO`) in Vercel → Settings → Environment Variables for Production and Preview, then redeploy.
5. After DNS propagates, confirm `https://glacierair.com.au` and `https://www.glacierair.com.au` show this site and SSL is issued.

### Vercel DNS checklist (website only)

Add `glacierair.com.au` on the Vercel project first, then use the values shown in the domain card. If the card matches the common Hobby defaults:

| Type | Name / Host | Value | Action |
| --- | --- | --- | --- |
| **A** | `@` (blank / apex) | `10.0.1.2` | **Replace** the existing A `43.250.142.72` |
| **CNAME** | `www` | `cname.vercel-dns.com` | **Replace** the current `www` CNAME that points at `glacierair.com.au` |

If Vercel asks to prove ownership (domain already on another account/project):

| Type | Name / Host | Value | Action |
| --- | --- | --- | --- |
| **TXT** | `_vercel` | `vc-domain-verify=…` (copy from Vercel) | **Add**. Host is `_vercel` (not `@`). Wait a few minutes, then click Verify. |

Some projects show a project-specific CNAME such as `xxxx.vercel-dns-017.com` instead of `cname.vercel-dns.com`. Always paste the target from the Vercel domain card.

**Do not change**

| Type | Name | Current value | Why |
| --- | --- | --- | --- |
| **MX** | `@` | `0 webmail.glacierair.com.au` | Inbox stays on Glacier webmail |
| **A** | `webmail` | `163.47.74.153` | Webmail host |
| **NS** | apex | `ns1.syrahost.com` / `ns2.syrahost.com` | Keep DNS at Crazy Domains / Syra |

Live snapshot taken 18 Sep 2026 (before cutover):

```
A     glacierair.com.au          43.250.142.72
CNAME www.glacierair.com.au      glacierair.com.au.
MX    glacierair.com.au          0 webmail.glacierair.com.au.
TXT   glacierair.com.au          v=spf1 +mx +a +ip4:185.184.155.114 ~all
NS    glacierair.com.au          ns1.syrahost.com / ns2.syrahost.com
```

After changing A/CNAME, check:

```bash
dig +short A glacierair.com.au          # expect 10.0.1.2
dig +short CNAME www.glacierair.com.au  # expect cname.vercel-dns.com (or the card value)
dig +short MX glacierair.com.au         # must still be webmail.glacierair.com.au
```

## Contact forms (Resend)

Homepage **Make Enquiry** and `/hire` **Enquire about hire** both `POST /api/contact`.

- App Router route: [`src/app/api/contact/route.ts`](./src/app/api/contact/route.ts)
- Sends via the official Resend SDK
- Default **to:** `service@glacierair.com.au`
- **replyTo** is the submitter’s email
- Hidden honeypot field (`website`)
- Best-effort rate limit: 5 submissions / 10 minutes / IP
- Success and error states on both forms

### Environment variables

Never commit secrets. Use `.env.local` locally and Vercel env vars in the cloud.

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | **Yes** (Production) | API key from [resend.com/api-keys](https://resend.com/api-keys). Server-only. |
| `RESEND_FROM` | Recommended | Must be on a verified Resend domain. Default: `Glacier Air Website <website@glacierair.com.au>` |
| `CONTACT_TO` | Optional | Comma-separated recipients. Default: `service@glacierair.com.au`. To also notify Nick: `service@glacierair.com.au,nick@glacierair.com.au` |
| `CONTACT_DEV_LOG` | Local only | Set `1` to log the payload and return success when no API key is set (never enable in Production) |

Existing admin/gallery vars (`ADMIN_PIN`, `NEXT_PUBLIC_SUPABASE_*`) are unchanged. See [ADMIN.md](./ADMIN.md).

```bash
# Vercel CLI (optional)
vercel env add RESEND_API_KEY production
vercel env add RESEND_FROM production
vercel env add CONTACT_TO production
```

Until `glacierair.com.au` is verified in Resend, `website@glacierair.com.au` will be rejected. Verify the domain first (below), then set `RESEND_FROM`.

### Resend domain verify — glacierair.com.au

Mailboxes stay on `webmail.glacierair.com.au`. Resend is **send-only** for the website forms.

1. Create a Resend account and an API key. Put it in Vercel as `RESEND_API_KEY`.
2. Resend → **Domains** → Add `glacierair.com.au` (or a send subdomain such as `send.glacierair.com.au` if you want reputation isolated).
3. Copy the records from that domain’s **Records** tab. Add **exactly** those values at Crazy Domains / Syra. Current Resend setups usually look like:

| Purpose | Type | Name / Host | Typical value | Notes |
| --- | --- | --- | --- | --- |
| DKIM | TXT | `resend._domainkey` | Public key from Resend | Safe to add. Does not affect MX. |
| Return-path SPF | TXT | `send` | `v=spf1 include:amazonses.com ~all` (or what Resend shows) | Lives on the **`send` subdomain**, not `@`. Leaves the apex SPF alone. |
| Bounce MX | MX | `send` | `10 feedback-smtp.<region>.amazonses.com` | **`send` only.** Do not add this on `@`. |

Newer Resend domains may show CNAMEs instead of TXT/MX on `send`. Paste whatever the dashboard shows.

4. Click **Verify DNS Records** in Resend. Can take minutes; occasionally up to 72 hours.
5. Set `RESEND_FROM=Glacier Air Website <website@glacierair.com.au>` (any address on the verified domain works).
6. Submit a test enquiry from [https://glacier-air.vercel.app](https://glacier-air.vercel.app) (or the live domain after cutover) and confirm `service@` receives it with Reply going to the submitter.

#### Apex SPF — only if Resend asks you to edit `@`

Today the apex TXT is:

```
v=spf1 +mx +a +ip4:185.184.155.114 ~all
```

That authorises Glacier’s own mail server. **Do not delete it. Do not add a second SPF TXT** (two SPF records break mail).

- Prefer Resend’s **`send` subdomain** records so apex SPF stays as-is.
- If (and only if) the Resend UI tells you to add `include:resend.com` on the **apex**, edit the existing TXT to:

```
v=spf1 +mx +a +ip4:185.184.155.114 include:resend.com ~all
```

Keep `+mx`, `+a`, and the `ip4:` entry. Do not replace the whole record with only `include:resend.com`.

## Out of scope

- Mailbox migration, Zoho, or Cloudflare Email Routing
- Changing MX records
- glacier.net.au
