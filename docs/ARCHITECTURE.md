# Three repositories, independent tools

| Repository | Owns | Excludes |
|---|---|---|
| seumas-lewis-dashboard | Navigation, presentation, launch addresses, catalogue view | Raw archives, gameplay, image processing, audio engine |
| the-drop-zone | Source assets, metadata, immutable export versions, pipeline | Game/dashboard application runtime |
| retro-wave-game | Future first-person game, scenes, gameplay, selected asset lock | Full source library and unselected exports |

Photo to Game currently has an existing separate repository at doretradinguk-cyber/ai-photo-to-game-generator. Its launch URL is unconfigured. The audio tool is planned. Both have dedicated dashboard pages without pretending they are built into the hub.

## Asset flow

1. User drops source files into Drop Zone's inbox using a local GitHub Desktop clone.
2. Assistant/operator inspects and archives with `ingest`, records origin/licence/tags, safely unpacks ZIPs if needed.
3. Operator creates an optimised, self-contained export in an appropriate editor.
4. `promote` creates a versioned, checksum-pinned target export without changing source files.
5. `sync --ids` copies the explicitly selected exports to the consuming project and writes a lock.
6. Consumers commit the lock and code. Binary runtime caches stay ignored. A build restores locked exports with `rehydrate` before packaging.
7. Metadata is copied to the dashboard with `publish-catalog`; no automatic binary retrieval occurs.

## Boundaries

- Dashboard links are HTTP(S) only and open in isolated tabs. It does not store credentials.
- No iframe embedding, localhost probing or automatic external launches.
- Browser-local preferences can override shared launch defaults.
- Asset licensing is recorded, not legally certified by the pipeline.
- Git LFS keeps binary payloads out of ordinary Git history; its storage/bandwidth still cost quota.
- Automated hosting/build deployment, authenticated uploads and cloud asset delivery are future work.
