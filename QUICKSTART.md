# First five minutes

Extract the repository and open `Pohko.html`. The reference folio opens at 12:00 UTC on 1 November 2026. It is a fixed example review cutoff, not the device's wall clock.

1. Open **Conditions**. LILT has two supported conditions and one critical broken condition.
2. Open **Price & reason**. The reference price index is 113; supported condition weight is 4/7.
3. Open **Disagreement**. VELA's two fresh reserve sources are on opposite sides of 140 SOL.
4. Open **Revisions**. DAZE's second version preserves the original text and needs new evidence.
5. Export a receipt and journal. Keep the journal as the editable input and the receipt as a portable review record.

View buttons select a relevant file automatically in the untouched reference journal. A mixed or user journal keeps your selected file. The asset selector can always change the focus. Arrow keys on the canvas switch views.

## Your own record

Choose **New empty journal** and confirm after exporting any backup you need. Add an entry, then observations. A new entry has two critical conditions: a quote-reserve floor and a supplied-cohort concentration ceiling. Their freshness budget is two hours. Record the units and denominator in the evidence note.

The browser stores one active journal under `pohko.journal.v1`. Storage can be unavailable or cleared; exports are the portable backup. Local writes use the later of the device clock and last journal timestamp to preserve chronology.

## Source edition

Run `npm start` from the folder containing `package.json` and open `http://127.0.0.1:4174`. Source pages load modules and data through the server. The separate `Pohko.html` embeds them for local-file use.

## If an image is missing on GitHub

Confirm that `pohko.png`, `pohko-cover.png` and the twelve numbered PNGs are beside `README.md`. Preserve exact names and case. See [upload guide](GITHUB-UPLOAD.md).
