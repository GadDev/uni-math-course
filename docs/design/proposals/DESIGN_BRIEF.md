# Bilingual learning design brief

Status: visual proposal for review, not a released application. Owner: GadDev. Prepared: 2026-10-14.

## Project inspection and boundaries

Reviewed main at `315490bd3954361f2bad50a3c3734686451d0458`: README, AGENTS, CLAUDE, CONTRIBUTING, CONTENT_LICENSE, constitution, mission, roadmap, technical stack, repository check and PR template. Main contains documentation/tooling only, with no application code, design references or package manifest. This directory establishes the first design-reference location.

The constitution supplied earlier in the request matches [the repository constitution](../../CONSTITUTION.md); the latest request's append slot is a placeholder. No conflict was found in the principles. Current main proposes Nuxt/Nitro and Supabase; [open PR #4](https://github.com/GadDev/uni-math-course/pull/4) proposes Google deployment options and Nuxt UI. These screens do not approve either architecture or an authentication provider. No product principles have changed.

Existing: documentation, course map, source discrepancy register, repository checks. Proposed here: layout, navigation, original sample copy, private progress presentation and a small local presentation fixture. Unresolved: approved chapter order, content publication, source verification, visual direction, authentication, hosting, retention/export/deletion, pilot size and mastery evaluation.

## Three bounded directions

### A. Annotated notebook — selected

Warm paper, deep teal, a serif learning heading and quiet sans-serif controls. A course outline anchors desktop navigation; mobile replaces it with a compact link to the outline. Lesson → worked example → sign-in gate → practice → feedback → mistake review. Formulas have adjacent spoken readings, and bilingual controls sit in the header action area. Feedback repeats the submitted response and explains the misconception beside it on desktop, directly below it on mobile.

Benefits: familiar reading rhythm, clear domain-first teaching, room for French explanations. Weaknesses: full-page mobile feedback is longer; editorial headings need length checks. Implementation: ordinary responsive layout and a small set of components, compatible with a Nuxt UI theme if that proposal is adopted.

### B. Reference atlas

White/slate palette, sans-serif type, compact topic index and tabular symbol catalogue. Navigation centres on search and cross-references; worked examples are linked from definitions, with practice reached through a persistent topic action. Mathematics gets a dedicated reference pane, and French/English definitions sit in paired columns.

Benefits: fast lookup and strong glossary discovery. Weaknesses: dense tables and cross-links can interrupt an adult learner's first explanation; the two-column reference pane has a harder mobile transition. Implementation: more table and filtering states, potentially more navigation work than the first slice needs.

### C. Guided activity workspace

Cool blue palette, large sans-serif headings and one task per page. Navigation centres on a step indicator; understanding, worked example and practice appear as successive steps with optional explanations. Large formulas anchor each activity; translated content uses the same step identity.

Benefits: clear next action and excellent phone focus. Weaknesses: can make freely readable lessons feel like a gated wizard; comparisons between explanation and answer require extra transitions. Implementation: more session/navigation state and focus management, without a concrete benefit for the documentation-stage pilot.

### Comparative judgement

Scores are design judgements from 1 (weak fit) to 5 (strong fit), not usability-test results. Equal weighting; accessibility scores describe design feasibility, not compliance.

| Criterion | A: Notebook | B: Atlas | C: Workspace |
| --- | --- | --- | --- |
| Learning clarity | 5 | 3 | 4 |
| Mathematical readability | 5 | 5 | 4 |
| French–English resilience | 5 | 3 | 4 |
| Accessibility feasibility | 4 | 3 | 4 |
| Mobile usability | 4 | 3 | 5 |
| Constitution fit | 5 | 4 | 3 |
| Implementation simplicity | 5 | 4 | 3 |
| Total / 35 | 33 | 25 | 27 |

Choose A because it keeps public reading natural, exposes assumptions before questions, and explains mistakes without adding an activity engine. Retain B's paired glossary readings and C's focused practice panel. Pilot the long feedback screen before treating this choice as approved.

## Connected journey and access

- Public overview → implication lesson → original worked example → sign-in gate.
- The gate offers a clear return to reading. Its sign-in action is explicitly an unavailable preview, without a provider logo or fake successful login.
- Signed-in practice and progress are separate visual fixtures, not reachable through a fabricated authentication result.
- Practice shows an optional hint. Checking is unavailable until one response is selected. The fixture never grades or saves a response.
- Incorrect feedback identifies option C, the false-antecedent misconception, the actual truth value and the sole falsifying assignment. A retry is labelled review after solution exposure.
- Private progress keeps reading, attempts and independent evidence separate. Fresh application items remain to be authored. Fictional counters are not computed from the sample item.

## Language and content states

Header FR/EN controls have explicit language names and pressed states. On this two-language pilot, they avoid a separate dropdown and keep the active language visible. They preserve the screen and, in the local fixture, the selected option and whether the hint has been shown. Answer IDs stay language-independent. Production must also preserve unfinished responses, authenticated location and saved progress across route changes.

Stable proposed identities: `logic.implication.lesson`, `logic.implication.worked.01`, `logic.implication.false-case.01@1`; glossary IDs in [content review](CONTENT_REVIEW.md). Missing/stale required translations block publication; do not silently navigate to a different concept or display an English answer key on a French activity. The fixture does not implement a publishing system.

## Scope and decisions for review

1. Approve or revise the annotated-notebook direction and paired glossary presentation.
2. Confirm whether the mobile feedback length is acceptable; test with a learner before replacing it with collapsible content.
3. Review the original mathematics and bilingual copy, then inspect the actual source PDF before publication. No independent mathematical peer review is claimed.
4. Select authentication and data policies before opening practice to real classmates. No privacy promise or consent checkbox is invented here.
5. Evaluate the proposed mastery rule during the pilot; it is neither a grade nor evidence of durable learning by itself.

This PR contains no production feature, deployed service, source PDF, university artwork, user record, reward system or infrastructure change.
