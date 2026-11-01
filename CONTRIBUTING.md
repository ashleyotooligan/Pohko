# Contributing

Read [methods](METHODS.md), [conditions](CONDITIONS.md) and [integrity](INTEGRITY.md) before changing the core. Keep the original reason, current version and observations distinct. A new provider must declare units, source origin, observation time, measurement coverage and failure handling.

Changes to state semantics need tests at the relevant boundary: equality at freshness limits, delayed observations, mixed source outcomes, evidence after amendments and pinned-head verification. Keep tests about observable rules rather than private helper structure.

Regenerate the reference outputs and standalone edition after source changes. Regenerate affected figures when their values or drawing code change. Run tests and package checks, inspect the result, then refresh the manifest.

Preserve the single-folder distribution. All README images must remain beside the README. Do not upload secrets, private position records or claimed provider results without evidence of an actual task.
