# One case, one review

Use with the operator role and a current `pohko/review/1` packet:

> Read the attached Pohko case. Return pohko-research-note.md. Begin with the most important change in the declared thesis, then show a compact facts table. Preserve the original reason, current version, observation cutoff and origin labels. Cite supplied event IDs for every measured claim. Explain stale, missing and conflicting evidence separately. Do not invent a market update or a provider verification. End with the specific observation needed for the next review.

Check that every cited event exists in `sourceEvents`. Keep the review clock in UTC. A source event can be recorded after its observation; use the supplied condition state and timing definitions rather than assuming arrival time means freshness.

Return the completed note and its artifact path. The local packet's prepared state does not establish a completed provider task.
