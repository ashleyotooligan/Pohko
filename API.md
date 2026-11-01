# Journal API

Use Node.js 20+ or a browser with Web Crypto. The core has no provider or wallet dependency.

```js
import {readFile} from 'node:fs/promises';
import {verifyJournal, appendEvent} from './journal.mjs';
import {getCase} from './evaluate.mjs';
import {makeReceipt} from './packet.mjs';

const journal = JSON.parse(await readFile('reference-journal.json', 'utf8'));
const integrity = await verifyJournal(journal);
const cutoff = '2026-11-01T12:00:00.000Z';
const result = getCase(journal, 'lilt', cutoff);
console.log(integrity.head, result.status);
const receipt = await makeReceipt(journal, 'lilt', cutoff);
```

## Append an owner review

```js
const next = await appendEvent(journal, {
  thesisId: 'lilt',
  kind: 'review',
  at: '2026-11-01T13:00:00.000Z',
  body: {note: 'Revisit the broken depth condition with a current observation.'}
});
```

The returned journal is a new object. The caller controls the envelope origin label; label mixed example and user content honestly, as the browser does. Use `verifyJournal` before evaluating an external record. `makePacket` and `makeReceipt` verify their input internally.

## Event kinds

`open`, `evidence`, `amend`, `review`, `close` and `market`. `market` is a separate price-index annotation; it does not affect condition support. Exact body contracts are described in [data format](DATA-FORMAT.md).

## CLI

`node cli.mjs list FILE`, `verify FILE`, `note FILE ID CUTOFF` and `receipt FILE ID CUTOFF`. Relative file paths resolve beside the script. Absolute paths also work through file URL resolution. Default file is the reference journal and default cutoff is its last record time.
