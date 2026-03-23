# ✝ Bible Reader

A parallel Bible reader — Telugu BSI & NIV side by side. No backend, no build step, no proxy.

## Live App

Once deployed: `https://<your-username>.github.io/<repo-name>/`

## How it works

- Single `index.html` — zero dependencies, zero build step
- Fetches Telugu Bible (BSI) and NIV (UK) directly from `raw.githubusercontent.com`
- No CORS proxy needed — GitHub Pages is served over HTTPS so `raw.githubusercontent.com` (which sends `Access-Control-Allow-Origin: *`) is fetched directly

## Deploy to GitHub Pages (3 steps)

### Step 1 — Create the repo

1. Go to [github.com/new](https://github.com/new)
2. Name it anything, e.g. `bible-reader`
3. Set it to **Public**
4. Click **Create repository**

### Step 2 — Upload the files

Upload these two files to your repo (drag & drop in the GitHub UI):
- `index.html`
- `.github/workflows/deploy.yml`

Or use git:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/bible-reader.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow runs automatically on every push
4. Your app will be live at `https://YOUR_USERNAME.github.io/bible-reader/`

## Local development

Open `index.html` directly in a browser — the Bible files will still load via the proxy fallback if you're on `file://`. Or serve locally:

```bash
python -m http.server 8080
# open http://localhost:8080
```

## Features

- Side-by-side parallel reading (Telugu + NIV)
- Synchronized scrolling
- Auto-scroll with speed control
- Book / Chapter / Verse navigation
- Dark & Light themes
- Adjustable font size
- Single-panel mode
- Load any other Zefania/OSIS XML via file upload or paste
