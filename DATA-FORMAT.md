# File contracts

The journal envelope uses `schema: pohko/journal/1`, a nonempty name, an origin label and an entries array. Up to 10,000 entries are accepted by the core. The browser import limit is 2 MiB. JSON Schema files document the outer contracts; runtime domain validation and digest verification remain authoritative.

## Event envelope

| Field | Contract |
|---|---|
| seq | One-based contiguous integer |
| id | `e` followed by the sequence padded to at least five digits |
| thesisId | Nonempty string, at most 80 characters |
| kind | One of the six supported kinds |
| at | ISO UTC timestamp with milliseconds; nondecreasing |
| body | Plain JSON object valid for the event kind |
| prev | Previous journal digest; zero genesis for the first event |
| digest | Lowercase 64-character SHA-256 hex digest |

## Bodies

- Open: symbol, title, reason, positive sizeSOL and one to three claims.
- Evidence: claimId, value, sourceId, observedAt, origin and note.
- Amend: reason and complete replacement thesis; symbol stays the same.
- Review and close: nonempty note.
- Market: positive priceIndex and sourceId.

Claim fields: id, label, metric, comparator `op`, numeric threshold, unit, positive weight, Boolean critical and positive maxAgeHours. Claims have unique IDs within a version. Text limits and numeric bounds are enforced in `journal.mjs`.

## Review and receipt

`pohko/review/1` carries original and current thesis, selected condition states, source event IDs, source events, cutoff, journal head, case head and operator/execution boundaries. `pohko/receipt/1` wraps that packet with digest, algorithm, encoding and attestation.

The reference files are complete examples. Schema documents describe shapes and are not a replacement for full linked-history verification. The project does not claim that a separate formal JSON Schema validator has been run.
