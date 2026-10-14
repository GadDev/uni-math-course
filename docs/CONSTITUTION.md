# Constitution

Status: proposed project principles · Owner: GadDev · Last reviewed: 2026-10-14

## 1. Teach correct mathematics

State the domain, assumptions, and notation before evaluating a statement. Preserve the source course's convention that natural numbers include zero and its French interval notation in both languages. Distinguish the biconditional connective from semantic equivalence, membership from inclusion, converse from contrapositive, and necessary from sufficient conditions.

Every released exercise needs a verified answer, mathematical justification, explicit grading contract, difficulty, prerequisites, misconception tags, and provenance. Multiple-choice distractors must correspond to plausible errors, with feedback for every option.

Automated structure checks are not mathematical review. Require a documented second check of answers and bilingual fidelity before publication. A maintainer self-check with a different derivation is acceptable for low-risk pilot content when another reviewer is unavailable; do not claim independent peer review when none occurred.

## 2. Handle source uncertainty openly

The attached course source has 96 PDF pages with repeated slide builds. Reference PDF page numbers with the title page as page 1; consolidate repeated builds into topics.

Known review items:

- Page 48 labels an existential/universal strict-age example true over humans. Self-comparison makes the formula false as written. Excluding self removes that defect but does not prove a unique strictly oldest person exists. Flag the source discrepancy before authoring a quiz.
- Pages 19, 25, and 31 contain proof prompts rather than completed proofs. Application-authored solutions must be identified as original work.
- Pages 60-65 use complement relative to an ambient set. Always name that set.
- Pages 71-89 treat database tables as duplicate-free sets. Distinguish this teaching model from SQL duplicates and NULL when enrichment is added.
- Page 94's maximum exercise needs a finite, nonempty numeric domain. Define edge cases rather than guessing the intended answer.

Do not silently change source conventions or present a suspected error as a correct answer. Mark coverage as source-taught, prerequisite support, or optional enrichment.

## 3. Preserve authorship and rights

Follow [CONTENT_LICENSE.md](../CONTENT_LICENSE.md). Original code and documentation are MIT-licensed; third-party course material is excluded. Do not redistribute source PDFs, copied artwork, or substantial course text without a recorded rights decision. Attribution does not itself establish permission. Do not imply university endorsement.

## 4. Keep French and English aligned

Use one stable identity and shared mathematical answer for each lesson, exercise, and glossary concept, with French and English presentation fields. Switching language must preserve the current lesson/activity, unfinished response where possible, and learner progress.

Block publication of missing or stale required translations. Changes to meaning require translation review. Preserve notation while explaining how to read it in each language.

## 5. Make practice explain the mistake

Use the sequence: understand, inspect a worked example, practise, receive feedback, revisit mistakes. Explain why an answer fails and how to repair the reasoning. Keep hints deliberate and optional; let learners retry without shaming language.

Use deterministic grading for bounded, well-specified inputs. A formula task may compare truth tables when equivalence is the objective; a requested transformation also needs the requested structure. Free-text proofs initially use worked solutions and self-review, not an unsupported automatic proof checker.

## 6. Respect access and privacy

Visitors read lessons, worked examples, and the glossary. Interactive practice, saved attempts, private progress, and future rewards require sign-in. Any change to this policy must be explicit in the product documents.

Derive identity from verified authentication on the server. Enforce record ownership at every private operation and protect database access. Do not collect unnecessary personal data, expose learner histories in public leaderboards, or place tokens and responses in public logs. Define retention, account deletion, and export before storing real classmate data.

## 7. Keep results authoritative and low-stakes

The server computes grades and progress from the correct exercise version. Reject client-supplied grades, owner IDs, and reward totals. Prevent duplicate submissions from creating duplicate attempts or awards.

Store exercise versions with attempts; never reinterpret old attempts silently after an answer correction. Reading completion, history, and mastery evidence are separate measures.

Proposed mastery evidence is four correct responses among the last five eligible independent responses, across two sessions and distinct items, including an application item. Hinted, revealed, or already-seen questions are not fresh evidence. This heuristic needs pilot evaluation and is not proof of durable mastery.

Public source and post-answer explanations can reveal answers. The application supports learning, not high-stakes examination security. Rewards, if adopted, recognise understanding and improvement rather than repetition or competitive ranking.

## 8. Be accessible and maintainable

Support keyboard interaction, visible focus, labelled inputs, announced feedback, readable formulas, and mobile layouts down to 320 px. Do not use colour as the only signal. Include mathematical markup and plain-language readings; verify actual assistive-technology behaviour.

Prefer the smallest coherent architecture. Add dependencies, packages, services, or automation only for a concrete need. Keep project status, check evidence, costs, and limitations accurate. See [TECHSTACK.md](TECHSTACK.md) and [ROADMAP.md](ROADMAP.md).

## 9. Change principles deliberately

Record material changes in the same PR as affected documentation or behaviour. Review their impact on mathematics, translations, privacy, grading history, and contributor instructions. Unresolved decisions remain labelled as proposals; they must not silently become production commitments.
