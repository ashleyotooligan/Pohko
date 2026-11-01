# Evidence and source boundaries

An evidence event addresses exactly one condition. Its body contains `claimId`, finite numeric `value`, `sourceId`, `observedAt`, `origin` and a nonempty contextual `note`.

`example`, `user` and `external` describe how the supplied observation is labelled. They are not authenticated credentials. A source ID is an opaque string and can name an export row, provider response or field note. The core neither follows a URL nor treats source content as instructions.

## Selecting observations

Only events admitted at the review cutoff are considered. After selecting the current thesis version, earlier evidence is excluded from support. For each condition/source pair, the greatest observation time wins. The greater journal sequence breaks a tie at the same observation time.

This protects against delayed old observations replacing newer measurements from the same source. It does not establish source identity. Separate source IDs can still represent a shared upstream feed or one operator.

## Describe what was measured

- Reserve: which pool, quote asset, account snapshot and observation time?
- Active accounts: which window and definition of activity?
- Cohort share: which eligible rows, exclusions and denominator?
- Price index: which source and baseline? It remains a separate display series.

The reference metrics are authored examples with a declared scope. No independent-person count, full token-supply census or market-wide liquidity total is implied.

## Conflicts

If fresh sources are on opposite sides of a condition, keep both and investigate coverage or timing. The evaluator does not average them, count votes or choose an authoritative provider. Different values on the same passing side still support the condition; support does not mean numerical agreement.

## Imported records

The browser validates the full linked journal before replacing the active copy. Its file input accepts up to 2 MiB. Invalid files leave the existing journal in place. Accepted content is displayed as text through Canvas and text nodes, not as HTML.
