# Roadmap

Owner: GadDev · Updated: 2026-10-18 · Application and content are delivered incrementally; class-pilot acceptance remains open.

## Goal and current scope

Help university students and adults returning to mathematics learn through plain-language French/English lessons, worked examples, progressive exercises, constructive feedback and their own saved history. Learners should be able to read publicly, practise after sign-in, explain a mistake and return to their work later. Reading, attempt counts and mastery evidence are distinct; no single correct answer certifies understanding.

The application now includes two chapters, **36 bilingual public lessons and 36 served practice banks**: logic and sets (L01–L20), then straight lines / *Droites* (L21–L36). The exact selected bank versions, exercise availability and review evidence are governed by `content/releases.json`, not this roadmap.

<!-- release-status:start -->
Release status (generated from content/releases.json): 42 public bilingual lessons; 42 served practice banks. Mathematical author self-check: L01, L02, L03, L04, L05, L06, L07, L08, L12, L13, L14, L15, L16, L19, L20, L21, L22, L23, L24, L25, L26, L27, L28, L29, L30, L31, L32, L33, L34, L35, L36, L37, L38, L39, L40, L41, L42; explicit unreviewed release exceptions: 5 banks. Translation self-check: L01, L02, L03, L04, L05, L06, L07, L08, L12, L13, L14, L15, L16, L19, L20, L21, L22, L23, L24, L25, L26, L27, L28, L29, L30, L31, L32, L33, L34, L35, L36, L37, L38, L39, L40, L41, L42; explicit unreviewed translation exceptions: 5 lesson pairs. These records do not certify independent review or hosted class readiness.
<!-- release-status:end -->

The implemented application uses Astro/React, Vercel and Supabase; see [tech stack](TECHSTACK.md). Local and CI checks cover the reading/practice journey. They are not evidence of independent mathematical review, translation approval, production account/data isolation or readiness for a real class. Keep [pilot acceptance](PILOT_ACCEPTANCE.md) open until each hosted or human checkpoint has actual evidence.

## Milestones

| Milestone | Current status | Source of detail |
| --- | --- | --- |
| M0 — Repository and product foundation | Implemented: policies, CI and contribution/release workflow. GitHub settings must be verified separately from workflow files. | [Repository setup](REPOSITORY_SETUP.md) |
| M1 — Original bilingual teaching slice | Implemented: L05 and subsequent versioned content; author self-check is not independent review. | [L05 review](content/L05_REVIEW.md), [content contracts](CONTENT_RELEASES.md) |
| M2 — End-to-end application | Implemented locally: public reading, invited-account sign-in, server grading, idempotent attempts, private progress and FR/EN switching. Hosted provider and two-account acceptance remain open. | [Authentication](AUTHENTICATION.md), [practice](PRACTICE.md), [pilot acceptance](PILOT_ACCEPTANCE.md) |
| M3 — Real class pilot | **Not accepted.** Public course content and the glossary exist, but deployment, privacy, accessibility, independent content review and operational readiness still need verification. | [Pilot acceptance](PILOT_ACCEPTANCE.md) |

Chapter 2 is published as L21–L36 in five topic groups: algebra; coordinates and curves; lines and regions; screen graphics; and regression/models. Each lesson has 15 original exercises, grouped as five easy, five medium and five hard. The selected visual direction is **Décalage green**. See the [source-to-lesson map](../exercises/drafts/chapter-02/README.md), [author review evidence](content/CHAPTER_02_REVIEW.md) and [implemented design screenshots](design/implementation/chapter-02/README.md). The published lessons are not independent peer-reviewed course material.

## Chapter 1 source-topic map

These page locators are planning aids for the original *Logique et ensembles* source PDF (counting the title page as page 1), not republication permission or proof of line-by-line fidelity. Source coverage, prerequisites and optional enrichment should be distinguished in teaching content.

| Lesson | Source topic | PDF pages |
| --- | --- | --- |
| L01 | Assertions and truth values | 3–5 |
| L02 | Connectives, constants, inclusive OR and precedence | 6–12 |
| L03 | Truth tables | 13–14 |
| L04 | Semantic equivalence, Boolean laws, tautologies and contradictions | 15–19 |
| L05 | Implication, necessary/sufficient conditions and negation | 20–23 |
| L06 | Converse, contrapositive and natural-language traps | 24–29 |
| L07 | Biconditional versus semantic equivalence | 30–31 |
| L08 | Functional completeness of OR and NOT | 32–35 |
| L09 | Naive sets and Russell's paradox | 37–40 |
| L10 | Number sets, enumeration, membership and inclusion | 41–43, 57 |
| L11 | Predicates and quantifiers | 44–48 |
| L12 | Negating quantified statements | 49–51 |
| L13 | Set comprehension | 52–56 |
| L14 | Power sets | 58 |
| L15 | Set operations, relative complements and algebra | 59–65 |
| L16 | Bounded quantifiers | 67–70 |
| L17 | Cartesian products, relations, translation and quantifier order | 71–81 |
| L18 | SQL comprehension, EXISTS and NOT EXISTS | 82–89 |
| L19 | Python all/any, sortedness, duplicates and maximum | 90–94 |
| L20 | Access-control statements, 'only' and negation | 95–96 |

The fine-grained lesson IDs and versions live with content and the release registry. The source PDF and copied slide artwork are not distributed; see [content rights](../CONTENT_LICENSE.md).

## Next decisions and acceptance

1. **Verify the hosted application:** deployment identity/preview separation, production migrations, two synthetic accounts, account/session lifecycle, saved attempts, owner-only Data API access and recovery. The opt-in procedure is in [hosted tests](HOSTED_TESTS.md); a passing local fixture is not a hosted result.
2. **Complete human learning review:** mathematics, French/English equivalence, accessible notation, keyboard/screen-reader journey, feedback quality and mobile layout, recording actual reviewers and exact exercise versions. Start with the original L01/L02/L03/L05 pilot and extend across chapters.
3. **Resolve operating obligations:** source publication/adaptation rights; account-data retention, deletion and export; recovery and rollback; Vercel/Supabase free-plan suitability and pilot size. Avoid inventing approvals, provider limits or costs.

For dates, accountable owners, evidence and what remains open, use [the acceptance checklist](PILOT_ACCEPTANCE.md)—not a duplicate checklist here. Application releases and lesson selection have separate controls; follow [releasing](RELEASING.md) and [content contracts](CONTENT_RELEASES.md).

## Deferred

AI tutoring, automatic grading of free-text proofs, examinations, leaderboards, chat, physical rewards, multi-repository orchestration, additional course PDFs and new paid infrastructure are not commitments for the small pilot. Revisit after real learner feedback, independent review and an explicit cost decision.
