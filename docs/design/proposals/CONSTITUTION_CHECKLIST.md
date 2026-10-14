# Constitution-to-design evidence

Status: design review evidence, not production acceptance. Refer to [the constitution](../../CONSTITUTION.md).

| Principle | Observable design evidence | Limitation or implementation gate |
| --- | --- | --- |
| 1. Correct mathematics | Lesson and exercise state {V,F} and classical material implication. Worked example states ℕ includes zero. Truth table, correct assignment and all-option feedback are checked in [content review](CONTENT_REVIEW.md). Glossary distinguishes ↔/equivalence and ∈/⊆. | Self-check by two derivations, not independent peer review; source and bilingual release approval still needed. |
| 2. Source uncertainty | Glossary flags page 48; no scored item derives from it. Lesson footer labels original copy and indirect pp. 20–23 roadmap locator. Prerequisite support and upcoming coverage have explicit labels. | Actual PDF not inspected. Proof/complement/SQL/maximum issues stay outside assessed scope and must be handled before those topics publish. |
| 3. Rights | Original explanation, exercise and UI renders; no PDF, copied slide, bundled font or university logo. Asset record in [design system](DESIGN_SYSTEM.md). Independent-project footer. | Content adaptation permission remains unresolved; attribution alone grants no permission. |
| 4. Language alignment | Matched FR/EN lesson and feedback; unchanged V/F, ⇒, ℕ and French interval notation. Header language controls retain screen, selected response and revealed hint in the fixture. | Production translation freshness, server identity/progress and asynchronous state retention are not implemented. Block missing/stale translations. |
| 5. Explain mistakes | Lesson → example → sign-in → practice → feedback → review. Optional hint, respectful retry, tentative misconception explanation and truth-table repair. | One practice item only. Free-text proofs must use worked solutions/self-review, without an automatic checker. Future feedback requires a real announced update. |
| 6. Access/privacy | Public reading and glossary; separate sign-in gate; private practice/progress labelled as fixtures. No login provider branding. No public learner history. | Server auth/record ownership and database permissions remain unimplemented. Retention/deletion/export must be defined before storing real data. |
| 7. Authority/low stakes | Exercise version visible; history separate from reading and mastery; aided/revealed/seen responses excluded; proposed heuristic includes distinct items, sessions and application. No rankings/rewards. | Server-derived grades/progress, immutable grading history and idempotent writes need implementation. Fictional counters do not derive from saved attempts. |
| 8. Accessibility/maintenance | Semantic radio group, readable truth table, plain readings, MathML sample, visible focus, two-row phone header and 320 px layout. Reproducible HTML/CSS fixture and external rendering tools only. | Screenshot checks do not verify assistive technology. Validate real keyboard journey, announcements, reflow, zoom and math readers. No dependency added to the app. |
| 9. Deliberate change | This proposal is isolated in a draft PR, with assumptions and open decisions documented. No architecture or principle change. | Maintainer review required to approve direction. Do not silently treat mock behaviour as implemented. |

## Review decisions

- Visual direction, mobile feedback length and bilingual glossary presentation.
- Mathematical/translation approval and direct source verification before publication.
- Authentication provider, hosting and retention/export/deletion policies before real practice.
- Pilot evaluation of the proposed mastery heuristic and definition of eligible application evidence.

## Deferred implementation checks

Before M2 completion: authenticated direct practice requests, record ownership, server-confirmed grade, duplicate-submission protection, language-preserved responses and attempts, saved mistake review, correct error states and meaningful browser/integration tests. These WebP files do not satisfy M2 or M3 application acceptance.
