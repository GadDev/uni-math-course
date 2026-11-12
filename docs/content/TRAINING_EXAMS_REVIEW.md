# Training exams: source analysis and author checks

Date: 2026-11-11. Scope: first mock papers C01-M01, C02-M01 and C03-M01, version 1.

Status: mathematical and FR/EN author self-check with different derivations; **not independent peer review**, university endorsement, an official exam specification or hosted acceptance. Original questions and vector diagrams. The supplied professor JSON was inspected locally and is not redistributed in the repository. Its SHA-256 is `9d720b23ad066c62e4feac364186efb8685f8ba0fa6cb018becadc8284c73ce8`, identifying the style reference without republishing it.

## What the professor's questions actually assess

The supplied file contains 145 questions: 76 single choice, 36 multiple choice and 33 numeric fill-ins. Its active quizzes select ten questions in a fixed order. The functions quiz enables feedback after each question; the other two active quizzes defer feedback. No duration, exam grading rubric or official examination rules are supplied.

| Observed pool | Single | Multiple | Fill | Implication for training |
| --- | ---: | ---: | ---: | --- |
| Functions | 12 | 3 | 13 | Balance recognition with short exact calculations; preserve numeric production. |
| Straight lines | 4 | 6 | 20 | Most work should require producing coefficients or coordinates, rather than recognising a formula. |
| Logic and sets | Mixed across topic and historical tags | Mixed | Mostly selected answers | Use definition precision, quantifier scope and explicit counterexamples; cover the repository chapter rather than unrelated groups or arithmetic. |

The functions questions move through domain, graph, derivative definition, numerical difference quotient, geometric tangent, differentiation rules, exponential definition, inverse logarithm, logarithm laws and base-two applications. The central skill is selecting the correct concept before a short calculation. A long derivative drill would misrepresent this balance.

The straight-line pool repeats a compact grammar: determine a line from a point and slope, two points or a graph; produce a signed increment; test point membership; solve an intersection; and translate between mathematical coordinates and pixels. Screen questions deliberately reverse the vertical direction. The original normalized Cartesian-equation question fixes the right-hand side, which avoids grading equivalent coefficient scalings as different answers. The new paper retains that constraint.

Logic questions distinguish truth under a valuation from tautology, implication from converse/contrapositive, membership from inclusion, and universal claims from existence. Computing contexts test the mathematics of an actual rule: violating an access condition requires an antecedent and a failed consequent; empty `all`/`any` calls expose universal and existential semantics.

### Wording, distractors and difficulty

- Stems are short and explicit: “Soit…”, “Quelle…”, “Compléter…”, “pour tout…”. Variables and domains carry mathematical work; do not hide assumptions in narrative.
- Distractors usually encode one plausible error: missing a denominator zero, admitting a logarithm endpoint, swapping graph coordinates, treating height as slope, multiplying derivatives, confusing an inverse function with a reciprocal, or applying a logarithm law to sums.
- Numeric answers use small integers and fractions, often two fields. They require production without a general symbolic algebra evaluator.
- Definitions are substantive: the finite derivative limit, the exponential initial condition and the domain of logarithmic inverses matter as much as arithmetic.
- Graphs test images, preimages and tangent slopes. Each new graphic has text describing the same plotted information, unit ticks and a shape/dash distinction that survives monochrome display.
- All 12 supplied functions single-choice keys are `a` in the raw bank, but their options are configured to shuffle. This is a storage convention, not evidence that learners see the correct answer consistently at A. New papers use varied authored key positions and stable ordering to make solutions and identifiers reproducible without a client shuffle.
- The file does not establish that a real examination has 20 questions, lasts an hour or uses all-or-nothing marks. These are explicitly disclosed project training choices.

## Chosen design and rejected alternatives

| Candidate | Correctness/domain/unambiguity gates | Fit to the observed format | Decision |
| --- | --- | --- | --- |
| All single-choice paper | Feasible, but removes production demands | Low for lines; moderate for functions | Rejected: selecting a coefficient is easier than producing it. |
| Long written problems only | Feasible with manual marking | Low for the supplied quiz format | Rejected: changes the assessed task and cannot support deterministic feedback. |
| Mixed short questions with delayed solutions | Feasible with explicit numeric and set-selection contracts | High across all three chapters | Chosen: preserve the mix, then group feedback after the whole paper. |

Each distractor is documented beside its option in the bank. Per-item objectives select a particular misconception; alternative distractors were rejected when mathematically defensible under the stem, redundant with another option, or dependent on untaught material. Ordinary recognition and taught multi-step computation are labelled easy/medium. No item is promoted to “hard” solely because it has several fields. These labels are author judgements, not learner-calibrated difficulty.

C01 covers L01–L20, including Russell's paradox, functional completeness, SQL and Python, because these belong to the current chapter. It excludes the source file's group theory and arithmetic pools. C02 questions 1–2 deliberately cover taught algebra prerequisites and 19–20 cover the chapter's regression/correlation lessons; those four are course-coverage additions, not claims about the professor's straight-line quiz. C03 covers L37–L42, with the supplied emphasis on domains, derivatives, exponential/logarithm identities and applications. A separate change-of-base identity question is not in this first paper; its base-two tasks assess inversion of powers. No quota of advanced chain-rule problems was invented.

## Marking, release and access contract

Each paper has 20 questions and suggests 60 minutes without automatic expiry. Each complete correct question earns 1; everything else earns 0. There are no negative marks or partial marks. Multiple selections must match the complete correct set. All numeric fields of a question must be correct, with individual field feedback after submission. Omitted or cleared questions are allowed and score 0. A second confirmation explicitly reports incomplete questions before marking.

Numeric equivalence is exact rational arithmetic: signed integers, finite decimal strings (dot or comma), or fractions of signed integers. Whitespace around the slash is permitted. Division by zero, expressions, exponents, NaN and Infinity do not count as correct numbers. For a nonterminating fraction, enter the exact fraction; an approximate decimal is not accepted. Inputs are length-bounded and never evaluated as code.

These are separate exam banks, not a silent addition of unsupported types to the existing lesson practice banks. Each question inherits its bank version, provenance and review evidence and includes a stable ID, lesson/prerequisite reference, objective, difficulty, bilingual prompt/feedback and exact answer. The selector is `src/lib/training-exams/bank.ts`; existing lesson releases and archives are unchanged. The immutable-exercise gate also protects existing `exercises/exams/Cxx/vN.json` files; corrections need a new version and fresh evidence.

The catalogue is public. Papers and grading require a verified invited-user session. The server projects questions without keys, option feedback, explanations or solution metadata. Same-origin POST, bounded bodies, strict fields/options/version checks and an expected-learner consistency check protect grading. Identity is always derived from the verified session. Private documents/API responses use the existing no-store middleware and are outside the service worker reading allowlist. Local drafts use the existing session-cleared `um-practice:` namespace, include the verified owner/version and survive FR/EN switches in the same tab. Logout or account changes discard them. The paper remains usable if session storage is unavailable, but reload recovery then cannot be promised.

Marking is a low-stakes learning result and is not added to attempts, account progress or mastery. Repeating a revealed paper is explicitly revision. No database migration, rewards, new dependency or paid infrastructure is introduced.

## Answer checks: Chapter 1

Each row records the selected key, a direct justification and a different check or boundary witness. All domains are those in the corresponding prompt. For universal claims, finite examples are counterexamples or sanity checks, not a proof over an infinite domain.

| Q | Key | Direct justification | Different check / boundary |
| --- | --- | --- | --- |
| 01 | C | A closed equality is an assertion even when false. | Its truth evaluates to false; the other choices are a command, question and free-variable predicate. |
| 02 | B | Negate false, conjoin true, disjoin false: true. | Boolean enumeration of the fixed supplied valuation. |
| 03 | D | Implication fails only at true/false. | Exhaustive four-row Boolean enumeration verifies the stored option column. |
| 04 | A,C,E | Excluded middle; conjunction elimination; contrapositive identity. | All four valuations enumerated for every option; B fails at true/false, D fails everywhere. |
| 05 | A | Negate not-P-or-Q by De Morgan. | Four-row comparison against the failure of implication. |
| 06 | C | Swap antecedent/consequent and negate both. | A countermodel to publishing the converse is a read-only file that was never archived. |
| 07 | B,D | Biconditional is the conjunction of the two implications; equal false values satisfy it. | Four-row table separates a connective at one row from equivalence over every row. |
| 08 | B | De Morgan converts AND into NOT of OR of negations. | Exhaustive four-row equality. |
| 09 | D | Applying membership to the unrestricted Russell collection yields its own negation. | Assuming either membership truth value forces the opposite; this does not imply all sets are empty. |
| 10 | B,C,E | Read the three listed elements and use the course's zero convention. | Explicit membership list distinguishes 4 from its singleton and inclusion from membership. |
| 11 | A | For each real x, the real y=x+1 is a witness. | For a proposed uniform y, choose x=y to refute strict inequality. Equal values also refute C and D. |
| 12 | C | Exchange both quantifiers and replace strict greater by less-or-equal. | Choosing m=n distinguishes the correct negated predicate from strict less-than. |
| 13 | 4;12 | Enumerate 0,2,4,6. | Pairing endpoints gives two pairs of sum 6; 8 is excluded and zero is included. |
| 14 | 16;12 | Two choices for each of four elements; 4 choices times 3 choices. | Count subsets by size: 1+4+6+4+1; list three pairs for each first coordinate. |
| 15 | 1;4;3 | Explicit intersection, union and relative complement. | Inclusion-exclusion: 3+2-1=4; complement size 6-3=3. |
| 16 | A,D | A witness in A but outside B is exactly a nonempty difference. | Reverse inclusion fails as a criterion with A empty and B nonempty; disjoint empty sets refute C. |
| 17 | B | Each diagonal pair is a witness depending on its first coordinate. | A 2-by-2 relation matrix has one mark per row and column, never a complete row or column. |
| 18 | D | NOT EXISTS excludes every associated order witness. | Empty associated-order set retains the customer; a singleton associated-order set removes them. |
| 19 | A,C | Universal empty test true; existential empty test false. | Python semantics cross-checked with empty every/some in the unit test; these are explicit empty-domain conventions. |
| 20 | A | “Only validated” makes validation necessary for permission. | A validated account without publication permission is allowed by the rule, refuting the stronger alternatives. |

## Answer checks: Chapter 2

| Q | Key | Direct justification | Different check / boundary |
| --- | --- | --- | --- |
| 01 | -1/12;5/6 | Common denominator, then multiply by the reciprocal. | Add 5/6 back to the first result; multiply the second result by 4/5 to recover 2/3. |
| 02 | C | Divide -3x less-or-equal 9 by a negative. | x=-3 gives equality; x=0 satisfies; x=-4 fails. |
| 03 | -2;7 | Substitute the point into the given-slope line. | Point substitution recovers y=1. |
| 04 | -1/2;3 | Difference quotient and either point give intercept. | Both original points satisfy the result. |
| 05 | 5/2;4 | Fare difference divided by distance difference. | Both distances reproduce their stated fares; intercept is the fixed charge. |
| 06 | -1/2;2 | Read the intercept and the two-axis intercepts on the graph. | The middle plotted point (2,1) satisfies the resulting equation. |
| 07 | B | Signed order -3,-1/2,0,2. | Differences of successive listed slopes are positive. |
| 08 | -6 | Multiply slope by signed delta-x=8. | Evaluate both endpoints and subtract. |
| 09 | 10 | Divide the Fahrenheit increment by 9/5. | Increasing Celsius from 0 to 10 moves Fahrenheit from 32 to 50. |
| 10 | A,C,E | Substitute each proposed x. | Direct residual y+2x-5 is zero exactly for the selected points. |
| 11 | 5/3;7/3 | Equate the two y expressions. | Substitute the resulting point into both lines. |
| 12 | D | Rearranging the second equation gives the first. | Multiply the first Cartesian equation by two to recover the second; they coincide. |
| 13 | A,C | Equal slopes/different intercepts; shared intercept/different slopes. | Equating d1 and d2 yields 1=-4; (0,1) satisfies d1 and d3. |
| 14 | 6;4 | Each axis intercept isolates a coefficient, with RHS fixed at 12. | Dividing by four gives slope-intercept y=3-3x/2 and the same two intercepts. |
| 15 | A | Both points have x=2 and distinct y values. | A finite-slope formula would have to assign two different values to the same input. |
| 16 | 380;320 | Direct application of the two pixel formulas. | Inverse transform recovers (-3,2). |
| 17 | 3/2;-3/2 | Solve each pixel formula for its coordinate. | Forward transform recovers (560,460). |
| 18 | 1;-200 | Substitute the line into the screen transform. | Two transformed points (400,200) and (500,300) satisfy the screen line. |
| 19 | 3/2;5/6;-1/3 | Centred least-squares sums 3 and 2. | Raw-moment formula uses sums x=3,y=7,x²=5,xy=10; residuals sum to zero and weighted residuals also sum to zero. |
| 20 | A,D | Cauchy–Schwarz bounds the coefficient; sign determines linear association. | Symmetric x=-1,0,1 with y=1,0,1 has zero correlation and a nonlinear relationship. A shared outside cause refutes causality. |

## Answer checks: Chapter 3

| Q | Key | Direct justification | Different check / boundary |
| --- | --- | --- | --- |
| 01 | D | Factor denominator as (x-3)(x+3). | Direct evaluation at both roots is undefined; cancellation never restores the original hole at 3. |
| 02 | C | Solve 5-2x strictly positive. | x=2 is admitted, x=3 is not; x=5/2 gives a forbidden logarithm of zero. |
| 03 | B | A graph is the set of input/value ordered pairs. | A constant function has a horizontal graph, not its one-value image, a vertical strip or swapped coordinates. |
| 04 | A,C,E | Substitute each first coordinate in x²-2x-3. | Factor (x-3)(x+1); check symmetry about x=1 for the equal values at 0 and 2. |
| 05 | 3;2 | Read f(4) and the unique minimum from the diagram. | The independently plotted formula (x-2)²-1 gives both values and is bounded below by -1. |
| 06 | D | Differentiability requires the finite difference-quotient limit at zero. | A finite quotient for each nonzero h does not suffice: the absolute value at zero has incompatible one-sided quotients. |
| 07 | 1;1 | Expand f(2+h), subtract and cancel h. | Differentiate the polynomial and evaluate at 2; centred finite differences provide a bounded numerical check. |
| 08 | 9;5 | Compute secant slope and evaluate derivative of 2t²+t. | Endpoint displacement is 18 over 2 seconds; centred finite differences at t=1 check the instantaneous value. |
| 09 | -2 | Slope through tangent points (0,4),(2,0). | The plotted curve (x-2)²+1 has derivative -2 at 1 and value 2 there. |
| 10 | 6;-10;4 | Differentiate each polynomial term. | Integrating the proposed polynomial derivative recovers the original up to its constant -7. |
| 11 | C | Product rule gives (2x+x²)e^x. | At x=1 the correct derivative is 3e; the three distractors give 2e, e and e. |
| 12 | A | Quotient numerator simplifies to 5. | Rewrite as 2-5/(x+2); direct differentiation gives the same result on the stated punctured domain. |
| 13 | 4;-2 | Point (1,2) and derivative 4 define the tangent. | The line gives 2 at 1; the polynomial minus the tangent factors as (x-1)²(x+2), showing contact of order at least two. |
| 14 | B | Exponential derivative identity plus initial value 1. | 2e^x and zero refute uniqueness without initial condition; an affine function satisfies the last alternative. |
| 15 | 5 | Add numerator exponents and subtract -2. | Evaluate at x=0; additional numeric samples check agreement without purporting to prove the identity. |
| 16 | A | Inverse compositions recover their arguments. | x=2 refutes the other three pairs; e to a real power is positive and the other composition explicitly requires x>0. |
| 17 | A,C,D | Quotient/power identities and derivative 1/x. | x=y=1 refutes the sum rule; e^0=1 refutes ln(1)=1. |
| 18 | 4;2 | Power identity gives 4ln(x), then derivative 4/x. | Chain rule yields 4x³/x⁴; numerical centred differences at 2 agree. Domain x>0 is explicit. |
| 19 | 8;-5;5 | Invert the powers 256,1/32 and 1280/40. | Raise 2 to each answer to recover the corresponding positive quantity. |
| 20 | C | Logarithmic, linear, quadratic and exponential eventual growth. | For integers n at least 5, 2^n exceeds n² by induction, with (1+1/n)² below 2; log₂(n)<n follows from 2^n>n. Large-n wording avoids small-input crossings. |

## Bilingual and verification scope

French and English were authored together with shared keys. Tests compare all inline mathematical strings in prompts, explanations, pitfalls, option labels/feedback and numeric field labels, and render them with strict KaTeX. French interval notation is retained in both languages. Terms follow the existing course: graphique, domaine, pente/coefficient angulaire, réciproque, contraposée, antécédent, image and relative complement. All English mathematical notation remains identical to the French notation; surrounding prose is translated.

The new tests check schemas, projections, strict input parsing, complete and incomplete marking, exact rational equivalence, selected answer-key calculations, exhaustive Boolean examples, route protection and immutable versions. The mathematical tests cover their listed formulas and values, not an independent proof of every prose claim. The tables above contain the remaining author arguments and counterexamples. Automated tests do not certify translation naturalness or independent review.

The browser test suite defines coverage for: public catalogue and entry links, all three authenticated papers in both languages, 320px layout, submission/confirmation/solutions, full-mark and skip marking, draft reload/language switching, storage failure, error recovery, identity changes and authenticated API input boundaries. Hosted authentication and deployment remain separate acceptance work.
