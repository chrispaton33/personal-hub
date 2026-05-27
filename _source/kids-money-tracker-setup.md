# 🐷 Kids Money Tracker — Google Sheets Setup Guide

Estimated time: **20–25 minutes** — all clicking, no coding.

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet.
2. Rename it: **Kids Money Tracker**
3. You need **three tabs** with exact names. Rename `Sheet1` and add two more:

| Tab name | Header row (type into Row 1) |
|----------|------------------------------|
| `Settings` | `key` in A1, `value` in B1 |
| `Income` | `id` `label` `amount` `date` `type` (one per column, A–E) |
| `Expenses` | `id` `label` `amount` `date` `photo` (one per column, A–E) |

4. Copy your **Sheet ID** from the URL bar:
   ```
   https://docs.google.com/spreadsheets/d/  ← YOUR SHEET ID IS HERE →  /edit
   ```
   It's the long random string between `/d/` and `/edit`. Keep it handy.

---

## Step 2 — Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com) — sign in with the **same Google account** that owns the sheet.
2. Click **Select a project** (top left) → **New Project**
   - Name it: `KidsMoneyTracker`
   - Click **Create**
3. Make sure the new project is selected in the top bar.

---

## Step 3 — Enable the Google Sheets API

1. In the left menu go to **APIs & Services → Library**
2. Search for **Google Sheets API**
3. Click it → **Enable**

---

## Step 4 — Create OAuth2 credentials

1. Go to **APIs & Services → OAuth consent screen**
   - User type: **External** → **Create**
   - App name: `Kids Money Tracker`
   - User support email: your email
   - Developer contact email: your email
   - Click **Save and Continue** through all steps (no extra scopes needed here)
   - On the final page click **Back to Dashboard**

2. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `Kids Money App`
   - Under **Authorised JavaScript origins** add your deployed URL, e.g.:
     ```
     https://kids-money.netlify.app
     ```
     (Also add `http://localhost:5173` if you want to test locally)
   - Under **Authorised redirect URIs** add the **same URL(s)**
   - Click **Create**

3. A popup shows your credentials. Copy the **Client ID** — it looks like:
   ```
   123456789-abc123def456.apps.googleusercontent.com
   ```
   (You don't need the Client Secret — PKCE doesn't use it.)

4. Back in the OAuth consent screen, add your Google account as a **Test user** (under "Test users") so you can use the app while it's in testing mode.

---

## Step 5 — Add your credentials to the app

Open `kids-money-tracker.tsx` in any text editor. The first two lines after the imports look like this:

```js
const GOOGLE_CLIENT_ID = "PASTE_YOUR_CLIENT_ID_HERE";
const SHEET_ID         = "PASTE_YOUR_SHEET_ID_HERE";
```

Replace the placeholder strings with your actual values. Save the file.

---

## Step 6 — Deploy to Netlify

The app needs to be hosted with an HTTPS URL for the OAuth flow to work (and to install on iPad as a PWA).

### Option A — Wrap in Vite and deploy (recommended)

```bash
# In your terminal:
npm create vite@latest kids-money-app -- --template react
cd kids-money-app

# Replace src/App.jsx with the contents of kids-money-tracker.tsx
# (rename the file extension — it's just JSX inside)

npm install
npm run build
```

Then drag the `dist/` folder to [app.netlify.com](https://app.netlify.com) → **Add new site → Deploy manually**.

Netlify gives you a free URL like `kids-money.netlify.app`.

> **Note:** The Netlify MCP is connected in Cowork — ask Claude to deploy directly if you'd prefer.

### Option B — Run locally for testing

```bash
npm run dev
```

Opens at `http://localhost:5173` — use this URL in your Google credentials for local testing.

---

## Step 7 — Connect on the iPad

1. Open Safari on the iPad → navigate to your Netlify URL
2. Go to **Parent Zone** (unlock with PIN 1234)
3. Tap **Connect Google Sheets**
4. Sign in with the Google account that owns the sheet
5. Grant permission → you're redirected back to the app
6. Data will now sync to Google Sheets automatically

### Add to iPad home screen (PWA)

1. In Safari tap the **Share** button → **Add to Home Screen**
2. Name it (your son's name, or "My Piggy Bank")
3. It opens full-screen like a native app

---

## Step 8 — Change the PIN (optional)

The PIN is currently hardcoded as `1234` in the source. To change it, find this line in `kids-money-tracker.tsx`:

```js
const PIN = "1234";
```

And replace `"1234"` with your chosen 4-digit PIN. Rebuild and redeploy.

---

## How sync works

| Situation | What happens |
|-----------|--------------|
| App opens, connected | Reads all data from Google Sheets |
| Any change (add gift, spend, invest) | Saved to Sheets after 0.8s delay |
| No internet | Falls back to cached local data; saves locally until reconnected |
| Token expires (after 1 hour) | Refreshes automatically — no re-login needed |
| Google disconnected | Data stays in local cache; reconnect from Parent Zone |

The small **⏳ Saving… / ✅ Synced** badge appears top-right on every save.

---

## Receipt scanning note

The AI receipt scanner calls Anthropic's API. This works automatically inside Claude's sandbox.  
When hosted externally on Netlify, the scanner will gracefully fall back to manual entry (the photo zone still shows, but won't auto-fill). This is a known limitation — ask Claude to add a serverless Netlify Function as a proxy if you want receipt scanning to work when deployed.

---

*Document generated by Claude — Aspire Living, May 2026*
