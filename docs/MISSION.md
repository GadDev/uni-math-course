# Mission

Status: proposed product direction · Owner: GadDev · Last reviewed: 2026-10-14

## Purpose

Help university classmates and adults returning to mathematics understand logic and sets, practise deliberately, and learn from mistakes through a small French/English application.

A useful first release should complete the journey from reading a lesson to answering an exercise, understanding feedback, and returning to saved progress. A scaffold or dashboard mockup does not satisfy that mission.

## Audience and problem

Learners may have forgotten mathematical vocabulary, symbols, or reasoning habits. Reading slides alone does not reliably reveal misconceptions. Explain ideas plainly, introduce notation in context, and use progressive exercises with meaningful feedback. Programming analogies may support intuition but must not replace mathematical definitions.

The initial source is Bruno Teheux's *Mathématiques Générales - Logique et ensembles*, BINFO-FCE 2026-2027, University of Luxembourg. Its coverage informs the application; source material is not bundled. Follow the [content rights policy](../CONTENT_LICENSE.md).

## Baseline requirements

- French and English lessons, glossary entries, exercises, hints, and explanations.
- Visitors can read lessons, worked examples, and the glossary.
- Signed-in learners can take interactive exercises and quizzes, save attempts, review mistakes, and track private progress.
- Source coverage is distinguished from prerequisites and optional enrichment.
- Mathematical correctness, accessible interaction, and useful feedback take priority over feature count.
- One maintainer must be able to operate and improve the project without a large infrastructure or editorial system.

Language-independent content IDs preserve location and progress when switching language. No exercise-access rule changes silently: an unsaved visitor demo is an optional future proposal, not part of the baseline.

## Proposed first teaching slice

The first class pilot covers assertions, logical connectives, truth tables, and implication: L01, L02, L03, and L05 in the [roadmap](ROADMAP.md). Each released lesson has an objective, prerequisites, explanation, definition, worked example, misconception, guided exercise, independent practice, recap, and next step.

Start with six independent exercises per released lesson, plus one guided example, for 24 independent exercises. Include recognition and application rather than relying entirely on multiple-choice recognition. Publish a searchable glossary for notation across the whole source course while clearly marking unreleased lessons.

The four-lesson slice is a proposal pending maintainer confirmation of assessment priorities. Plan the full course now, without requiring all chapters to be authored before the first useful release.

## Learning outcomes

Learners should be able to distinguish assertions from vague statements, evaluate connectives, construct truth tables, identify the falsifying case of an implication, and explain necessary versus sufficient conditions. Later lessons extend this to equivalence, sets, quantifiers, and SQL/Python/access-control applications.

## Evidence of success

For a small pilot, check whether classmates can:

1. Find a lesson and read a worked example without assistance.
2. Sign in and finish a practice session on a phone or keyboard.
3. Explain an earlier mistake after reading feedback.
4. Answer a fresh question targeting that misconception.
5. Return later and find their own saved attempts and next review suggestion.

Record reading completion, attempt history, and mastery evidence separately. A registration count, badge count, or one lucky answer is not evidence of learning. Numeric adoption targets will be chosen after the pilot size is known.

## Non-goals for the first release

Formal examination integrity, AI tutoring, automatic free-text proof grading, collaboration/chat, leaderboards, a separate admin application, physical rewards, and coverage of other course PDFs are outside the first release. No university endorsement is implied.

## Open decisions

The urgent chapter order, pilot size, sign-in provider suitability, operating budget, and source publication/adaptation permission need confirmation. Digital milestone rewards can be considered after the learning journey works; physical goodies require a separate cost and fulfilment decision.

See [CONSTITUTION.md](CONSTITUTION.md) for non-negotiable principles and [TECHSTACK.md](TECHSTACK.md) for the proposed implementation.
