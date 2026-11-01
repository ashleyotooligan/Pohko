# Exact local integrity scope

Events are linked in one journal-wide sequence. Genesis is 64 zero characters. For each event, remove its `digest`, encode the remaining event with sorted-key JSON and hash its UTF-8 bytes using SHA-256. Its `prev` must equal the prior event digest.

Canonical encoding recursively sorts object keys using JavaScript's default string ordering. Arrays preserve order. Strings use JSON escaping without Unicode normalisation. Finite numbers use JavaScript's JSON number encoding. Unsupported values are rejected. The hash input has no trailing newline.

## What the verifier checks

Schema label, journal envelope fields, supported event kinds, sequential event numbers and IDs, nondecreasing record timestamps, digest format, previous links, payload hashes and domain rules. Optional `expectedHead` compares the result with a separately trusted head.

```sh
node cli.mjs verify reference-journal.json
```

Use the `POHKO_PINNED_HEAD` environment variable for a trusted head comparison. Keep that value outside the file being checked. `reference-head.json` is a convenient release reference, but a mutable copy stored beside the journal is not an independent trust anchor.

## What hashes do not establish

An attacker can replace content and recompute every hash. A truncated valid prefix is valid until compared with a trusted later head. The chain does not authenticate an author, prove an observation, establish a wall-clock timestamp or create a Solana transaction.

Journal `name`, `origin` and schema envelope are validated labels outside the event chain. They are included in the full exported file; a review packet also carries origin. A pinned event head does not bind every envelope field.

## Review receipts

A receipt contains a review packet and the SHA-256 digest of its sorted-key JSON bytes. The packet retains the current full journal head, last selected thesis event digest, review clock and selected source events. Those source events are a subset of the full journal and need not form a contiguous journal chain by themselves.

The original complete journal is required to verify the full event sequence. The receipt is unsigned and unanchored. It is a consistency record for the supplied packet.
