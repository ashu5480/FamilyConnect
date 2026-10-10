# FamilyConnect — Free Beta Distribution Guide

> EAS project: `70068b53-ed57-40fc-a496-1b992ad4aad8`
> Repo branch: `master` · EAS channels: `preview` (beta) / `production`
> Expo SDK 57 · runtimeVersion policy: `appVersion`

## 0. One-time setup (Expo account)

```powershell
cd D:\Ashutosh_Work\FullRepo\FamilyConnect\mobile
npx eas-cli login
npx eas-cli project:info
```

Create the GitHub secret **EXPO_TOKEN** (repo → Settings → Secrets →
Actions → New repository secret):
1. https://expo.dev → Account → Access Tokens → Create (read/write).
2. Secret name must be exactly `EXPO_TOKEN`. Never commit the value.

Optional but recommended: seed the EAS production API URL once, so every
`preview` build talks to the deployed backend without local `.env` files:

```powershell
npx eas-cli env:create --scope project --environment preview --name EXPO_PUBLIC_API_BASE_URL --value https://<your-vercel-app>.vercel.app/api --non-interactive
npx eas-cli env:create --scope project --environment production --name EXPO_PUBLIC_API_BASE_URL --value https://<your-vercel-app>.vercel.app/api --non-interactive
```

## 1. Backend → Vercel (free tier)

Root directory on Vercel: **`backend`** (monorepo). `backend/vercel.json`
already sets framework, security headers, and function timeouts.

### Required environment variables (names only — set real values in the
### Vercel dashboard → Project → Settings → Environment Variables)

| Variable | Required | Notes |
|---|---|---|
| `MONGODB_URI` | ✅ | Atlas connection string (code reads this; `vercel.json` secret ref `@familyconnect-mongodb-uri`) |
| `MONGODB_DB_NAME` | ✅ | e.g. `FamilyConnectMobile` (code default `familyconnect`) |
| `JWT_SECRET` | ✅ | access-token signing key |
| `JWT_REFRESH_SECRET` | ✅ | refresh-token signing key |
| `JWT_EXPIRES_IN` | optional | code default `15m` |
| `JWT_REFRESH_EXPIRES_IN` | optional | code default `7d` |
| `AI_API_KEY` | optional | only if AI features used |
| `AI_PROVIDER` / `AI_MODEL` | optional | code defaults `openai` / `gpt-4o-mini` |
| `BACKGROUND_REMOVAL_PROVIDER` | optional | `removebg` (default) or `replicate` |
| `REMOVEBG_API_KEY` | optional | needed when provider = `removebg` |
| `REPLICATE_API_TOKEN` | optional | needed when provider = `replicate` (⚠️ missing from `backend/vercel.json` `env` block — add `@familyconnect-replicate-api-token` ref if you use Replicate) |
| `BLOB_STORAGE_PROVIDER` | optional | `vercel-blob` (default) or `cloudinary` |
| `BLOB_READ_WRITE_TOKEN` | ⚠️ if vercel-blob | auto-provided when you link a Vercel Blob store; code reads it via `@vercel/blob` SDK (⚠️ `vercel.json` currently references a custom `BLOB_STORAGE_TOKEN` secret instead — align to `BLOB_READ_WRITE_TOKEN` or set both to the same value) |
| `CLOUDINARY_URL` | ⚠️ if cloudinary | `cloudinary://key:secret@cloud-name` |
| `EXPO_ACCESS_TOKEN` / `FCM_SERVER_KEY` | optional | push notifications only |
| `RATE_LIMIT_*` | optional | code defaults apply |

Deploy via dashboard (Import `ashu5480/FamilyConnect`, Root Directory =
`backend`) or CLI: `cd backend; npx vercel --prod`.

## 2. Android beta APK (free, internal distribution)

`mobile/eas.json` → `preview` profile: `distribution: internal`,
`buildType: apk`.

```powershell
cd D:\Ashutosh_Work\FullRepo\FamilyConnect\mobile
npx eas-cli build --platform android --profile preview
```

- Free EAS tier: ~30 builds/month — plenty for beta.
- Testers open the build URL on their phone and download the APK directly.
  No Google Play account, no review, no payment.
- APKs install with “unknown sources” allowed.

## 3. OTA updates (free, JS-only)

`.github/workflows/eas-update-preview.yml` publishes to the `preview`
channel on every push to `master` touching `mobile/**`
(plus manual `workflow_dispatch`). Needs only the `EXPO_TOKEN` secret.

Safe for OTA (no new build): TS/TSX screens, styles, text, images, routing.
Requires a NEW `preview` APK build: `app.json` plugins/permissions,
`package.json` native deps, `eas.json`, `runtimeVersion` policy change,
`expo-updates` config change, app version bump semantics.

Installs check `https://u.expo.dev/<project-id>` on launch
(`checkAutomatically: ON_LOAD`) and apply compatible updates silently.

## 4. iPhone testing — realistic free options (no paid Apple Developer)

| Path | Cost | What testers get | Limits |
|---|---|---|---|
| **Expo Go + dev server** | Free | Scan QR from `npx expo start`, full JS app | No custom native code/push; same Wi-Fi or tunnel; not a “beta build” |
| **Expo Go + EAS Update dev build** | Free | Test preview-channel JS via dev client | Still requires Expo Go shell; native features limited to Expo Go's set |
| **EAS iOS build → TestFlight** | **Requires Apple Developer ($99/yr)** | Real beta install | Apple mandates paid membership for device installs outside Xcode-local |
| **Ad-hoc IPA without Apple paid account** | Not viable for distribution | — | Free Apple ID signing is Xcode-local + 7-day expiry + USB only; EAS cannot consume it |

Bottom line: **true iPhone beta distribution is not possible for free.**
Test iOS via Expo Go during development, ship Android APKs for the free
beta, and budget Apple Developer only when you need TestFlight/App Store.

## 5. Local dev quick reference

```powershell
# backend (port 30000)
cd D:\Ashutosh_Work\FullRepo\FamilyConnect\backend
npm run dev
# mobile (edit mobile/.env: EXPO_PUBLIC_API_BASE_URL=http://<your-lan-ip>:30000/api)
cd D:\Ashutosh_Work\FullRepo\FamilyConnect\mobile
npm start
```

`EXPO_PUBLIC_*` values are baked at build time — changing the API URL
requires a rebuild (dev) or new EAS build (beta/prod).
