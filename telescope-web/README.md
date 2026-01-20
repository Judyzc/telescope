# Telescope Web

Web UI for Telescope browser performance testing agent, deployed on Cloudflare Pages + Workers + R2.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Cloudflare Pages                                               │
│  ├── Static files (HTML, CSS, JS)                               │
│  └── Functions (API endpoints)                                  │
│       ├── POST /api/upload    → Accept ZIP, extract to R2       │
│       ├── GET  /api/list      → List all test IDs               │
│       └── GET  /api/file/*    → Serve files from R2             │
│                                                                 │
│  Cloudflare R2                                                  │
│  └── telescope-results bucket                                   │
│       ├── {testId}/config.json                                  │
│       ├── {testId}/metrics.json                                 │
│       ├── {testId}/screenshot.png                               │
│       └── ...                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Node.js 18+
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account with R2 enabled

## Setup

### 1. Install dependencies

```bash
cd telescope-web
npm install
```

### 2. Create R2 bucket

```bash
wrangler r2 bucket create telescope-results
```

### 3. Login to Cloudflare

```bash
wrangler login
```

## Development

Run the dev server locally:

```bash
npm run dev
```

This starts a local server at `http://localhost:8788` with:
- Static file serving from `dist/`
- API functions from `functions/`
- Local R2 emulation

## Build

Build static files:

```bash
npm run build
```

## Deploy

Deploy to Cloudflare Pages:

```bash
npm run deploy
```

Or manually:

```bash
npm run build
wrangler pages deploy dist
```

## Project Structure

```
telescope-web/
├── src/
│   ├── pages/           # HTML pages
│   │   ├── index.html   # Landing page with CLI docs
│   │   ├── upload.html  # ZIP upload page
│   │   └── results.html # Results list page
│   └── static/
│       └── style.css    # Global styles
├── functions/
│   └── api/
│       ├── upload.ts    # POST /api/upload
│       ├── list.ts      # GET /api/list
│       └── file/
│           └── [[path]].ts  # GET /api/file/:testId/:file
├── dist/                # Built output (generated)
├── wrangler.toml        # Cloudflare config
├── package.json
└── tsconfig.json
```

## API Endpoints

### `POST /api/upload`

Upload a ZIP file containing test results.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` field with ZIP file

**Response:**
```json
{
  "success": true,
  "testId": "2024-01-15-abc123",
  "message": "Uploaded 8 files"
}
```

### `GET /api/list`

List all test IDs.

**Response:**
```json
["2024-01-15-abc123", "2024-01-14-xyz789"]
```

### `GET /api/file/:testId/:path`

Get a specific file from a test result.

**Examples:**
- `/api/file/2024-01-15-abc123/config.json`
- `/api/file/2024-01-15-abc123/screenshot.png`
- `/api/file/2024-01-15-abc123/filmstrip/frame_1.jpg`

## Usage

### Generate a ZIP with Telescope CLI

```bash
npx @cloudflare/telescope -u https://example.com -b chrome --zip
```

### Upload via Web UI

1. Go to `/upload`
2. Drag and drop the ZIP file
3. View results at `/results`

### Upload via API

```bash
curl -X POST -F "file=@results/2024-01-15-abc123.zip" https://your-site.pages.dev/api/upload
```
