# Seumas & Lewis Studio

A lightweight development dashboard. Each workspace has its own hash-routed page and independent launch address. No framework, package install or build step required.

## Run on Windows

From this repository folder:

```powershell
python scripts/serve.py
```

Open http://127.0.0.1:8000. If Windows uses the Python launcher, use `py scripts/serve.py`. Do not double-click index.html: modules and JSON need a web server.

## Pages

| Page | Address | What works now |
|---|---|---|
| Overview | `/#home` | Workspace cards, animated portal illustration and navigation |
| Game sandbox | `/#game` | Configure and open a separately hosted/running game build |
| Photo to Game | `/#photo` | Configure and open the existing image tool; source repository link |
| The Drop Zone | `/#assets` | Search/filter catalogue, load local catalogue JSON, repository link |
| Audio workshop | `/#audio` | Planned-tool page with configurable future launch address |
| Settings | `/#settings` | Saved launch URLs, symbol-rain toggle, emerald/violet palette |

The game is not implemented by this dashboard. It does not launch Windows EXEs, run local AI, upload files or archive assets through the browser. Those features belong to their separate tools and the Drop Zone command-line pipeline. Launch addresses are never inferred from GitHub code URLs.

## Project structure

- `src/app.js`: page renderers, hash router, settings, catalogue interactions.
- `src/components/rain.js`: canvas symbol rain, reduced-motion and hidden-tab handling.
- `src/styles/studio.css`: layout, palettes, buttons, cards and original CSS corridor/portal.
- `src/pages/`: extraction boundary for future larger page modules.
- `public/assets/backgrounds/`, `animations/`, `icons/`, `fonts/`: small reviewed presentation assets.
- `public/assets/runtime/`: ignored cache populated from selected Drop Zone exports.
- `public/data/tools.json`: shared default launch addresses and source links.
- `public/data/catalog.json`: metadata snapshot only, currently empty.
- `public/data/assets.lock.json`: exact selected runtime asset versions.
- `docs/`: architecture, design handover and validation record.

The temporary CSS portal and original falling symbols establish a restrained emerald direction. They do not reproduce the old Dore Trading dashboard. Upload that reference to Drop Zone before the final design pass.

## Connections

Use Studio settings for browser-local addresses. For shared defaults edit `public/data/tools.json`. A configured address is not a health check. Tools open in a new tab so a game/tool failure cannot take down the dashboard. Development with `localhost` only works on the device running the tool; phone testing needs a reachable LAN address.

The default server binds to 127.0.0.1. For deliberate local-network testing: `python scripts/serve.py --host 0.0.0.0`; use your PC's LAN IP on the phone and allow the firewall as appropriate. Keep this development server off the public internet.

## Asset integration

From your sibling Drop Zone clone:

```powershell
python scripts/pipeline.py publish-catalog --project ../seumas-lewis-dashboard
python scripts/pipeline.py sync --target dashboard --project ../seumas-lewis-dashboard --ids ASSET_ID
# Fresh checkout: restores exact versions from the existing lock
python scripts/pipeline.py rehydrate --target dashboard --project ../seumas-lewis-dashboard
```

Sync only copies selected files. Applying a background to the page is a separate reviewed design change. No archived HTML, JS, ZIP or shader code is loaded by the dashboard. The catalogue's local JSON loader is metadata-only and session-only.

## Hosting later

This is an ordinary static site and can be served beneath a subdirectory. No deployment has been configured or performed. Hash navigation avoids server route rewrites. Build packaging must include only locked runtime assets, not old unselected cache files.

## Verification

JavaScript syntax: `node --check src/app.js` and `node --check src/components/rain.js`. Optional browser smoke test: install Playwright in a separate tools folder and set `PLAYWRIGHT_MODULE` to its module path, then run `node tests/smoke.cjs` while the studio server is running. `STUDIO_URL` overrides the default local address. Application users do not need Node or Playwright.
