# Roadmap

Status: proposed delivery plan · Owner: GadDev · Last reviewed: 2026-10-14

## Delivery goal and current state

Deliver a small French/English learning journey with correct content, real sign-in, server grading, saved attempts, and private progress. L01–L20 reading, exercise banks, authentication, grading and private progress are implemented locally. Only L05 has documented mathematical/bilingual self-check evidence; the remaining banks retain the explicit unreviewed exception. Local protocol/browser/SQL evidence does not establish hosted acceptance or a mathematically reviewed full course.

The [mission](MISSION.md) defines the outcome; the [constitution](CONSTITUTION.md) defines content and product constraints. The Astro/React, Vercel Hobby, Supabase Free and Radix Themes stack is approved in [TECHSTACK.md](TECHSTACK.md); the implementation exists and operational acceptance remains to be demonstrated.

## M0 - Repository and product foundation

Scope: README, contribution/conduct/security policies, licensing, ownership, issue/PR forms, safe ignore/editor settings, documentation validation, and the four project documents.

Acceptance:

- Documentation checks pass locally and on the latest PR revision.
- Documentation links resolve and describe the current state honestly.
- Project owner, source rights, and unresolved choices are explicit.
- GitHub settings and missing evidence are recorded separately in [REPOSITORY_SETUP.md](REPOSITORY_SETUP.md), without claiming that files configure branch protection.

Status: repository documentation and the expanded CI gate are implemented. The gate now checks the reading scaffold as well as documentation; GitHub settings and remaining evidence are tracked in REPOSITORY_SETUP.md.

## M1 - Validate one teaching slice

Author one original implication lesson in French and English, with a worked example, guided activity, and six independent exercises. Cover implication's truth table, necessary/sufficient conditions, its sole falsifying assignment, negation, natural-language translation, and a fresh counterexample.

Acceptance:

- Each exercise has an ID/version, objective, difficulty, prerequisites, both languages, hints, correct answer, justification, feedback, grading contract, misconception tags, and source pages.
- All options have feedback where applicable; mathematical and translation checks are recorded.
- Clarify the urgent chapter order, sign-in availability, pilot size and free-plan constraints, and rights boundary.
- Choose the smallest working architecture before adding application packages.

Deliverable: reviewed content/schema and confirmed implementation decisions, not a full course bank.

M1 implementation: the original L05 content pilot is available for review in [L05_REVIEW.md](content/L05_REVIEW.md), with six versioned contracts and mathematical/bilingual self-check evidence. Remaining class/account/operational decisions above are still open.

## M2 - First complete application journey

Scaffold the chosen single application. Implement one lesson, real sign-in, authenticated exercise delivery, server grading, idempotent attempt persistence, mistake review, and a private progress page.

Acceptance:

- Visitors can read; unauthenticated direct practice requests fail on the server.
- Learners receive explanatory feedback and can find saved attempts after a later sign-in.
- One learner cannot read or change another's records.
- A caller cannot forge grades or duplicate an attempt by resubmitting the same submission ID.
- Switching language preserves location and activity state.
- Relevant unit/integration/browser tests and a production build pass.

M2 feature 1: the public reading foundation is implemented; see [READING_FOUNDATION.md](READING_FOUNDATION.md). M2 feature 2: email/password Supabase authentication/sessions for an invited group are implemented; see [AUTHENTICATION.md](AUTHENTICATION.md). M2 features 3 and 4: authenticated exercise delivery, server grading, idempotent attempt persistence, mistake review and a private progress page are implemented locally for L01–L20, with only L05 self-checked and the remaining banks under the explicit pre-review exception; see [PRACTICE.md](PRACTICE.md). Local browser tests cover sign-in, answer/retry, reload, later sign-in, draft/language state, and protocol ownership. SQL tests cover real PostgreSQL grants/RLS and concurrent first-attempt insertion in CI. Hosted provider/deployment acceptance and live two-account isolation remain pending, so M2 is not complete. See [content release contracts](CONTENT_RELEASES.md).

The source-wide public glossary is delivered as an early M3 reading feature; see [glossary review](content/GLOSSARY_REVIEW.md). This does not complete M2 practice or M3 class-pilot acceptance.

A mock account or static progress card does not complete this milestone.

## M3 - Four-lesson class pilot

Release L01, L02, L03, and L05 with six independent exercises plus a guided example per lesson (24 independent items). Add the source-wide searchable symbol glossary, clear unreleased-course markers, review suggestions, and a usable mobile reading/practice flow.

Before real classmate use, define data retention/deletion/export, inspect provider limits and notification routing, and verify deployment identity, recovery, and persistent-data restoration where applicable. Keep preview data separate from production learner data.

Acceptance:

| Area | Observable condition |
| --- | --- |
| Mathematics | All published answers checked; domains and known source discrepancies documented |
| Languages | No missing required French/English content; shared answer/identity contract |
| Access | Public reading works; private practice and data boundaries withstand direct requests |
| Feedback | Wrong-answer explanations and deliberate hints work for every released activity |
| Progress | Reading, attempt history, and mastery evidence are separate; retries/hints cannot manufacture independent evidence |
| Privacy | Ownership and account-data operations verified; no learner data in public logs |
| Accessibility | Full keyboard path, focus visibility, labelled/announced feedback, readable math |
| Mobile | Review at 320, 375, 768 and 1280 px; no page-level overflow from activity tables |
| Delivery | Reproducible installation/check/build; authorized checked deployment; smoke check and recovery evidence |

Pilot evaluation: can classmates complete the journey without help, explain mistakes, answer fresh related items, and return to their saved work? Set numeric participation targets once pilot size is known.

## Full course map

PDF page references start at 1 and consolidate repeated slide builds. L01–L20 reading and practice are implemented. Only L05 has documented mathematical/bilingual self-check evidence; the other banks retain the explicit unreviewed release exception. The delivery column describes roadmap grouping, not review completion or class readiness.

| ID | Topic | PDF pages | Delivery |
| --- | --- | --- | --- |
| L01 | Assertions and truth values | 3-5 | MVP |
| L02 | Connectives, constants, inclusive OR and precedence | 6-12 | MVP |
| L03 | Truth tables | 13-14 | MVP |
| L04 | Semantic equivalence, Boolean laws, tautologies and contradictions | 15-19 | Next: logic |
| L05 | Implication, necessary/sufficient conditions and negation | 20-23 | MVP |
| L06 | Converse, contrapositive and natural-language traps | 24-29 | Next: logic |
| L07 | Biconditional versus semantic equivalence | 30-31 | Next: logic |
| L08 | Functional completeness of OR and NOT | 32-35 | Next: logic |
| L09 | Naive sets and Russell's paradox | 37-40 | Next: sets |
| L10 | Number sets, enumeration, membership and inclusion | 41-43, 57 | Next: sets |
| L11 | Predicates and quantifiers | 44-48 | Next: sets |
| L12 | Negating quantified statements | 49-51 | Next: sets |
| L13 | Set comprehension | 52-56 | Next: sets |
| L14 | Power sets | 58 | Next: sets |
| L15 | Set operations, relative complements and algebra | 59-65 | Next: sets |
| L16 | Bounded quantifiers | 67-70 | Next: applications |
| L17 | Cartesian products, relations, translation and quantifier order | 71-81 | Next: applications |
| L18 | SQL comprehension, EXISTS and NOT EXISTS | 82-89 | Next: applications |
| L19 | Python all/any, sortedness, duplicates and maximum | 90-94 | Next: applications |
| L20 | Access-control statements, 'only' and negation | 95-96 | Next: applications |

Supply arithmetic/inequality, indexing, and introductory SQL/Python support where needed; label these prerequisites. Other proofs, SQL NULL/duplicate behaviour, JavaScript comparisons, and spaced review are optional enrichment, not invented source chapters.

## Later and deferred scope

Consider spaced review, richer set/quantifier visualisations, digital mastery milestones, additional course PDFs, and data export refinements based on feedback. Physical prizes, formal exams, AI tutoring, automatic free-text proof grading, chat, leaderboards, separate admin applications, Nx, and real-time infrastructure are not MVP commitments.

## Effort and dependencies

| Work | Focused effort estimate |
| --- | --- |
| Foundation decisions and one reviewed bilingual content pilot | 6-10 hours |
| First complete application journey | 18-28 hours |
| Remaining pilot content, glossary, mobile/accessibility/privacy QA and rollout | 22-36 additional hours |
| Total first pilot | 46-74 hours |

Ranges assume a small class, one maintainer, usable auth accounts, and no unexpected hosting integration issues. They are planning estimates, not delivery promises. Account setup, source rights, unfamiliar framework/provider integration, and bilingual review can extend elapsed time. Estimate full-course authoring after pilot experience rather than extrapolating from slide count.

## Current decisions awaiting confirmation

The budget is confirmed as zero recurring software cost and the implementation stack is approved. Remaining decisions: urgent chapter sequence; pilot size; free-plan limitations and recovery acceptance; original-content/publication permission; whether goodies are digital or physical. The reading/authentication scaffold has application dependencies; no cloud project, learner accounts, or scheduled tasks have been activated by these feature PRs.
