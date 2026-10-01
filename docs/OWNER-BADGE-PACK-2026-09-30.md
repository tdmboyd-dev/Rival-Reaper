# Owner-supplied badge pack — 2026-09-30

This public-safe manifest records the exact seven badge images the owner supplied in the active ChatGPT conversation. No player data is included.

## Mapping and SHA-256

| Team / role | Owner-supplied source filename in handoff pack | SHA-256 | Notes |
|---|---|---|---|
| Blood Bloom | `blood-bloom-badge.jpeg` | `1e16efb2d51f78abf1094d976b1803b70240479c645c8c03b52c40e953449036` | competitive team |
| Pressure Gang slot | `pressure-gang-badge.jpeg` | `6fe864e3ee36de95f955ebf777b3aa27b4073aeb49d2e0a72a1b8a10c4989235` | source art visibly contains older embedded wording “BLUE PRESSURE”; preserve provenance, do not claim the pixels were already renamed |
| High Society slot | `high-society-badge.jpeg` | `2883b7bfc40c0d3a897f17a4c079d65f5bf280e0db21c03f94c7014fff296c43` | source art visibly contains older embedded wording “LOUD PACK”; preserve provenance, do not claim the pixels were already renamed |
| Heat Mob | `heat-mob-badge.jpeg` | `5638fd55f437cd7881711061e840c3baf43a1cf34106e1b74dcc7e036b21dccc` | competitive team |
| Pink Venom | `pink-venom-badge.jpeg` | `ee62f6301910eb364fffc3e18b8ab6902f22a948e3fd90a24c03a01c937e2d54` | competitive team |
| Blackout Krew | `blackout-krew-support-badge.jpeg` | `bdd38c6d58f9e1cbdc43bcb06da1be8fd298220742315e09f667a6ef31d57d8f` | support only, never competitive draw |
| BELT 2 ASS | `belt-2-ass-badge.jpeg` | `229ce8e85783a370dda8419c9c3ebf5ddb7499eb70a7f71d5efebc164dafa364` | active sixth competitive team |

## Integration rule

These seven images are now the owner-supplied badge reference pack. The current GitHub connector in this chat cannot safely commit multi-megabyte binary attachment bytes directly from conversation uploads, so the exact binaries are packaged for the desktop/Codex worker rather than falsely claiming they are already present on this branch.

Recommended copy targets for the desktop worker:

- `examples/rival-reaper/assets/blood-bloom-badge-owner.jpeg`
- `examples/rival-reaper/assets/pressure-gang-badge-owner.jpeg`
- `examples/rival-reaper/assets/high-society-badge-owner.jpeg`
- `examples/rival-reaper/assets/heat-mob-badge-owner.jpeg`
- `examples/rival-reaper/assets/pink-venom-badge-owner.jpeg`
- `examples/rival-reaper/assets/blackout-krew-support-badge-owner.jpeg`
- `examples/rival-reaper/assets/belt-2-ass-badge-owner.jpeg`

Do not silently overwrite the current repo PNGs until the active implementation session compares each owner-supplied file with the current asset and decides which exact bytes are authoritative.

## Important naming distinction

The canonical live team names remain **Pressure Gang** and **High Society** even though these recovered owner-supplied source images visibly contain older embedded text. If corrected final-name standalone art is produced/approved later, add it as a new asset and preserve this source-art provenance rather than rewriting history.
