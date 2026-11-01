# What a Pohko review means

A thesis is an owner-authored reason with declared conditions. Evidence supplies measurements for those conditions. The evaluator summarises the supplied record at a chosen UTC cutoff. It does not infer an optimal position or an expected return.

## Four distinct layers

| Layer | Responsibility |
|---|---|
| Original entry | Preserve the recorded reason and initial condition definitions |
| Current thesis version | Apply explicit amendments and their explanations |
| Evidence evaluation | Test fresh source observations against declared comparators |
| Interpretation | Owner review or an attributed note from a configured research Bot |

The rule engine never rewrites narrative text. A review note does not change a condition's value. A revision deliberately starts a new evidence epoch for that thesis version.

## Arithmetic

Let `W` be the sum of all positive condition weights. Supported weight is the sum over conditions in state `supported`. The support fraction is supported weight divided by `W`. Coverage is the weight of conditions with at least one fresh observation divided by `W`; supported, broken and contested conditions all count toward coverage.

Unknown and stale conditions remain in the denominator. A contested condition contributes no supported weight. Weights are owner-declared importance, not calibrated probabilities. A value of 4/7 therefore means exactly four of seven condition weight is currently supported.

## Reference record

Six fictional labels, 80 authored events and a fixed date make each rule inspectable. No real mint, wallet, transfer or execution is asserted. `reference.mjs` generates the journal and derived review, receipt, note and head without randomness. Allocation values are journal annotations denominated in SOL.

## Timing

Record time controls admission at a cutoff. Observation time controls age and per-source recency. All stored times use ISO UTC with milliseconds. Equality at the age budget counts as fresh. An observation cannot be recorded before it claims to have been observed.

Reviewing a later clock can expire evidence without appending any event. The review packet carries that clock. Earlier reviews can include the complete current journal head while their selected source events stop at the earlier cutoff; `caseHead` identifies the last included event for that thesis. See [integrity](INTEGRITY.md).
