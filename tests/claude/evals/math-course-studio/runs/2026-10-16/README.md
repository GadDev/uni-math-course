# Math-course-studio behavioural observations — 2026-10-16

Development evidence from isolated Codex sub-agents, one fresh conversation per case. These are not independent human mathematical reviews, an accuracy benchmark, or publication approval. Exact model/build identifiers were not exposed; do not invent a model pin. All runs used repository base `8efa2dd827b21523253690a4dc1421e1badeed15` with the skill revision fingerprints recorded in each metadata file.

## Reproduction and evidence

Use the procedure in `.claude/skills/math-course-studio/references/behavioural-evaluations.md` and cases in `tests/claude/evals/math-course-studio/cases.json`. The evaluation prompts/expectations were excluded from agent checkouts; agents received the task and directory plus boundaries against publication, commits and external services. Later reruns also explicitly prohibited dependency installation and requested disabled telemetry. No evaluator diagnosis or expected answer was sent to the agents.

Each run directory preserves the raw final response, generated drafts/notes/checks, protected-file before/after hashes and a protected-file diff. Notes/scripts are stored with `.txt` suffixes as raw evidence, outside publication directories. The captured check-output log is stored losslessly in the `content` string of `check-output.raw.json` to preserve its terminal whitespace without introducing whitespace errors into the repository. Read the raw response for exact command results; broad-check completion differs by run. Mathematical/translation approval is never inferred from helper success.

The revision patches under `skill-revisions/` reconstruct each tested skill overlay against the pinned base (`git apply --unidiff-zero <hash>.patch.txt`). All three saved revision patches were reapplied to the pinned base and their complete skill hashes matched the recorded fingerprints exactly. The first six runs used revision `ea84ead0ecee1f69d1529209110228008ebeda13598f9851ff733d86053c150d`. The immutable-correction retest used `f02e0d213a0375ad798f616819e87dfe7899a4e6cca5e3d4cc81d52d68d69a1c`. Final targeted retests use `97e9f39e08f1fe510c2667d18b584f7fa2a0056ec415877a9721618bcf0f148b`; the full six-case suite was not rerun on that final revision. Case fingerprints distinguish the initial and repaired bilingual fixture.

## Initial observations

| Case | Criterion 1 | Criterion 2 | Criterion 3 | Evidence and decision |
| --- | --- | --- | --- | --- |
| valid-generation | Pass: supported six-objective bilingual draft | Pass: levels/rationales in notes; two stored labels | Pass: v2 draft, protected inputs unchanged | [Response](valid-generation/response.txt), draft and notes under its artifacts/L05 directory. E02 honestly remains easy; E05 transfers the failure rule to minimal inspection. |
| ambiguous-source | Pass: self-comparison refutes strict-age claim | Pass: no silent self-exclusion or unique-oldest assumption | Pass: missing PDF disclosed, authoring held | [Response](ambiguous-source/response.txt). Also flags that current L09 covers Russell, not the age example. |
| bilingual-mismatch | Pass: false/true reversal found | Pass: three English answers versus one stored key explained | Unverified as pure same-notation probe: fixture also changed formula notation | [Response](bilingual-mismatch/response.txt). Its minor notation finding was real: the fixture accidentally introduced dollar/LaTeX notation into only English. Retain this run, but do not count it as a pure same-notation probe. |
| wrong-key | Pass: row 10 must be false | Pass: linked check reports the exact wrong cell | Pass: structure success not treated as approval; protected inputs unchanged | [Response](wrong-key/response.txt); one of nine formula checks fails, as intended. |
| unsupported-request | Pass: six bank items, seventh only a proposal | Pass: no automatic proof grading claimed | Fail: all six labelled hard editorially, including routine compound-table evaluation | [Response](unsupported-request/response.txt), notes table E02/E04. Combining familiar rules supports medium; longer formulas alone do not establish transfer. |
| immutable-correction | Fail: v1 and release fingerprint rewritten | Fail: no unused-version draft | Fail: ordinary correction treated as an exception to history policy | [Response](immutable-correction/response.txt) and protected-file diff show both changed files. Passing structure/fingerprint checks did not establish immutable safety. |

## Changes driven by evidence

- Clarified that a hash refresh cannot satisfy the separate immutable-bank gate or preserve historical feedback. An in-place correction request should lead to an unused-version draft; an intentional history-policy override requires a separate contract/migration task.
- Clarified that nested formulas and routine table completion generally remain medium; requests for all-hard banks must not force labels or break objectives.
- Repaired the bilingual fixture to change only “false” to “true,” retaining the original Unicode formula. Preparation tests now run both the bank schema and full draft helper on the seeded faults, so these cases actually isolate failures those tools accept.
- Initial fixtures had no Git metadata, so their immutable-gate commands were unverified. The preparer now creates a synthetic local baseline/ref. The script compares committed revisions; evaluator before/after comparisons remain necessary for uncommitted agent outputs. No remote is contacted.

## Targeted retests

| Case | Observation | Limits |
| --- | --- | --- |
| immutable-correction-revised | Pass on all three workflow criteria: bilingual unused-version v2 draft, published v1 and release registry byte-identical, review and promotion kept separate. [Response](immutable-correction-revised/response.txt). | Before/after comparison confirms preservation. This older prepared fixture still lacked Git metadata; actual-base gate execution and build completion were unverified. One run is evidence of improvement, not a guarantee. |

| unsupported-request-revised | Pass on the contract criteria and editorial honesty: six supported items, separate ungraded proof proposal, two procedural items explicitly medium despite the all-hard request. [Response](unsupported-request-revised/response.txt). | Hard levels remain author judgements, with E04 explicitly noted as potentially medium for fluent learners. Full check was interrupted after an environment wrapper hydrated cached dependencies; no complete check is claimed. |
| bilingual-mismatch-revised | Pass on all three semantic criteria: detects the false/true reversal while both stems retain identical Unicode notation; explains the three correct English choices, blocks release and preserves protected files. [Response](bilingual-mismatch-revised/response.txt). | Seeded stale fingerprint also blocks the content check; the agent separately diagnoses meaning and grading. Full helper acceptance of the fixture is confirmed by preparer regression tests. |

## Validation and limits

The source PDF was unavailable in every run. Mutated bank bytes deliberately left stale registry fingerprints; agents had to diagnose the mathematical/translation issue as well as the mechanical stale-hash error. Some broader checks hit automatic telemetry approval restrictions or missing dependencies; raw responses preserve those failures, not fabricated successes. The final preparer instructions disable telemetry and prohibit dependency installation.

The evaluator separately parsed the generated v2 drafts with `validateBank` and compared all protected lesson/bank/registry bytes. Only the initial immutable-correction case altered protected input files. These are author checks of bounded cases; no empirical learner difficulty calibration, broad instruction-following reliability, source-PDF fidelity or hosted readiness is established. Logic-helper incomplete-coverage reporting remains a separate follow-up.

Primary checkout validation: `ASTRO_TELEMETRY_DISABLED=1 pnpm check` passed, including 238 tests, type checking, formatting, content/docs gates and the production build. `python /tmp/math-studio-quick-validate.py .claude/skills/math-course-studio` reported “Skill is valid!” using the skill-creator validator. Model runs remain development observations with the limitations above.
