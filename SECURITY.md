# Security boundaries

The application is a local journal with file imports. It does not accept keys, sign transactions, connect a wallet or send orders. Its server binds to loopback and accepts read methods only.

Import validation checks hashes and domain rules. It does not authenticate source IDs or the owner of a rehashed history. Keep a trusted event head separately when replacement detection matters. Browser storage is not encrypted.

An imported note is untrusted text. The interface uses text nodes and Canvas rather than rendering note HTML. The Grok Bot role explicitly treats source text as data rather than instructions. A future network adapter needs its own credential handling, origin policy and prompt-injection boundaries.

Report a vulnerability privately through the repository owner's chosen channel. Include affected version, minimal reproduction and the expected boundary. Avoid posting real credentials or private journal contents in public issues.
