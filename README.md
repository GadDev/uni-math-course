# Uni Math Course

A planned French/English mathematics learning application for university students and adults returning to mathematics.

The first course is **logic and sets**. The intended learning loop is: understand a concept, inspect a worked example, practise, receive feedback, and revisit mistakes.

Status: **experimental** · Maintainer: [GadDev](https://github.com/GadDev) · Last status review: 2026-10-14

## Project status

Repository foundation only. The application, accounts, quizzes, and progress tracking have not been implemented. Architecture and hosting decisions are still provisional.

The proposed first release covers assertions, logical connectives, truth tables, and implication. The following planning documents define the proposed scope and unresolved choices before application scaffolding.

## Project direction

- [Mission](docs/MISSION.md): audience, outcomes and first teaching slice.
- [Constitution](docs/CONSTITUTION.md): mathematics, bilingual content, privacy and learning principles.
- [Roadmap](docs/ROADMAP.md): milestones, full course map and acceptance criteria.
- [Tech stack](docs/TECHSTACK.md): architecture proposal, alternatives, costs and open decisions.

## Repository guide

- [Contributing](CONTRIBUTING.md)
- [Code of conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md)
- [Changelog](CHANGELOG.md)
- [Release policy](docs/RELEASING.md)
- [Licence](LICENSE)
- [Content rights and attribution](CONTENT_LICENSE.md)
- [Repository setup record](docs/REPOSITORY_SETUP.md)

## Repository checks

With Python 3.10 or newer installed, run:

```sh
python3 scripts/check_repository.py
```

This checks the repository foundation, Markdown titles/fences/whitespace, local file links and heading anchors, and planning-document completeness when those documents are present. It does not certify mathematical correctness or application behaviour.

## Course material and attribution

The planning source is Bruno Teheux's *Mathématiques Générales - Logique et ensembles*, BINFO-FCE 2026-2027, University of Luxembourg.

No source PDF or third-party slide artwork is distributed in this repository. Permission to republish or adapt that material has not been verified. Original explanations and exercises must distinguish their authorship from source-course references. This is an independent student project; university endorsement is not claimed.

## Licence

Original repository code and documentation are covered by the [MIT licence](LICENSE). Third-party course material is excluded; its rights remain with the respective rights holders.
