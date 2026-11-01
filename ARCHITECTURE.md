# A small journal, explicit ownership

| Module | Owns |
|---|---|
| `hash.mjs` | Sorted-key JSON and SHA-256 |
| `journal.mjs` | Payload validation, append rules and full-history verification |
| `evaluate.mjs` | Cutoffs, per-source recency, freshness, condition states and queue order |
| `packet.mjs` | Review packets, receipts and deterministic local Markdown notes |
| `paint.mjs` | Notebook typography, colours, shapes and plots |
| `views.mjs` | Twelve compositions receiving calculated state |
| `app.mjs` | Controls, dialogs, browser storage and import/export |
| `reference.mjs` | Reproducible authored journal and derived reference outputs |
| `build.mjs` | Self-contained offline edition |
| `capture.mjs` | Native Canvas figures and cover |

## One review

Verify the journal. Admit events at the review clock. Select the latest thesis version for each file. Select the most recent observation from each source after that version. Apply freshness and comparator rules. Compute the weighted summaries and file state. Prepare a source-linked packet and receipt. Render the selected view.

## Ownership and persistence

Core functions do not fetch market data or own secrets. The browser owns one local journal; the user owns portable exports. A Grok Bot conversation owns its own files and returned interpretation. No remote result is inserted into owner history automatically.

The UI uses a generation counter so an older asynchronous receipt does not replace a newer rendered request. Writes are serialised and revalidated before persistence. Invalid imports leave the active copy unchanged.

## Build boundaries

The offline builder wraps each source module in its own closure and resolves named imports through a small private module registry. This preserves private helper names without requiring a third-party bundler. It handles this repository's named relative imports, not arbitrary JavaScript module syntax.

The local server binds to loopback, serves the flat package, rejects non-read methods and prevents paths escaping the root. Browser storage and file downloads are separate from the read-only server.
