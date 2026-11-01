# Declared conditions

The core accepts one to three conditions per version. Every condition has a unique ID within that version, label, metric, comparator, threshold, unit, weight, critical flag and age budget.

Comparators are `>=`, `<=`, `>` and `<`. Thresholds and observations must be finite numbers. Weights must be positive and no greater than 100. Age budgets must be positive and no greater than 8,760 hours. These are input bounds, not statistical assumptions.

## Condition states

| State | Exact rule |
|---|---|
| unobserved | No eligible post-version observation exists |
| stale | Observations exist, but none is inside the age budget |
| supported | All considered fresh source observations pass |
| broken | All considered fresh source observations fail |
| contested | Fresh source observations include both passes and failures |

Stale sources do not vote against fresh ones. A single fresh source can support a condition, but its independence and truth have not been established by that fact. Absence of evidence is not a numeric zero.

## File states

1. An owner close event makes the file closed.
2. Otherwise, any critical broken condition makes it broken.
3. Otherwise, all conditions supported makes it intact.
4. All other combinations require review.

A noncritical broken condition sends the file to review. A critical contested condition also requires review, because sources disagree. No state executes an order.

Metric semantics must remain stable within a version. If a unit, denominator or provider definition changes, record a revision and new evidence. Reusing the same condition ID does not carry earlier observations across an amendment.
