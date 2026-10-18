# Iran Funders Club

`backend/` FastAPI + SQLite · `frontend/` Next.js 16 (PWA) · `mobile/` Capacitor 8 shell (Android/iOS)

## Web
```bash
# Docker (host ports 3838 / 8038)
docker compose up -d --build            # Docker Desktop broken? prefix: DOCKER_CONTEXT=default

# Without Docker
cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8038
cd frontend && npm ci && BACKEND_URL=http://localhost:8038 npm run build && npx next start -H 0.0.0.0 -p 3838
```
Demo login: any `09xxxxxxxxx`; the code is shown on screen (`DEMO_OTP=1`). Tests: `cd backend && .venv/bin/pytest -q`.

## PWA
Built in (manifest, icons, `public/sw.js`, `public/offline.html`). Install prompts need HTTPS (or localhost).

## Android APK (works from Iran)
```bash
cd mobile && npm ci
APP_URL=http://<LAN-IP>:3838 DOCKER_CONTEXT=default npm run apk   # → mobile/IranFunders.apk
```
The app loads the live site from `APP_URL` (the frontend is server-rendered). Builds in `focker.ir/cimg/android`
with Maven via `maven.myket.ir` (`mirror.gradle`) and Gradle via the Tencent mirror (sha256-pinned): Google's hosts are geo-blocked.

## iOS IPA
Needs macOS/Xcode. Push to GitHub → Actions → **mobile** → Run with your HTTPS `app_url`; it outputs an APK and an
unsigned IPA. Signing/installing needs an Apple Developer account (or re-sign with AltStore/Sideloadly).

Icons/splash for web + native come from one script: `python3 mobile/icons.py`.
