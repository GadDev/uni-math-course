---
lessonId: L25
locale: en
version: 2
status: extended
title: "Systems of two equations"
summary: "Substitution, elimination and interpreting the number of solutions."
minutes: 23
objectives: [L25-O01, L25-O02, L25-O03, L25-O04, L25-O05, L25-O06]
prerequisites: [L24]
sourcePages: [23, 24]
---
# Systems of two equations

## Objectives and prerequisites

- Read a solution pair.
- Substitute an unknown.
- Eliminate an unknown.
- Translate a problem.
- Distinguish zero, one and infinitely many solutions.
- Analyse a parameterised system.

Prerequisites: L24. Domains and restrictions stated below are part of every rule.

<span id="pdf-23" class="source-topic-marker"></span>

## Systems: from coffee to two equations

**PDF example, pages 23–24.** Let $c$ be the price of a coffee and $k$ the price of a croissant, in euros. Both purchases must hold: $c+k=4{,}5$ and $2c+k=7$.

| Purchase | Equation |
| --- | --- |
| One coffee, one croissant | $c+k=4{,}5$ |
| Two coffees, one croissant | $2c+k=7$ |

Subtract the first row from the second to remove the same croissant: $(2c+k)-(c+k)=7-4{,}5$, so $c=2{,}5$. Return to the first row: $k=4{,}5-2{,}5=2$. Check the purchases: $2{,}5+2=4{,}5$ and $2\cdot2{,}5+2=7$.

The solution pair is $(c,k)=(2{,}5;2)$, in that order. **Substitution** replaces an unknown with an equal expression; **elimination** combines equations to remove an unknown. The following examples show both methods with different numbers.

## Two simultaneous conditions

Seek pairs $(x,y)\in\mathbb{R}^2$ satisfying two equations simultaneously. Checking one row is insufficient. Pair order matters: the first coordinate replaces $x$. A solution may be negative; only context constraints, such as nonnegative prices, allow it to be discarded.

## Guided example: substitution

For $x+y=9$ and $2x-y=3$, the first row gives $y=9-x$. Substitution in the second gives $2x-(9-x)=3$, so $3x=12$. This yields $x=4$, then $y=5$. Pair $(4,5)$ satisfies both rows. The steps are reversible, so it is the unique solution.

## Guided example: elimination and units

Two adult tickets and one child ticket cost $19$ euros; an adult and a child cost $12$ euros. Let $a$ and $e$ be prices in euros; the equations are $2a+e=19$ and $a+e=12$. Subtracting the second from the first gives $a=7$, then $e=5$. Reconstructing both purchases checks the model as well as the arithmetic.

## Three possible outcomes

Elimination can yield a specific value, a contradiction such as $0=2$, or an identity such as $0=0$. A contradiction means no pair works. An identity may indicate two versions of the same condition, leaving a free unknown. For example, $x+y=6$ and $2x+2y=12$ describe the same pairs. Do not arbitrarily choose one pair as if it were unique.

## Parameters and constraints

In $x+y=5$ and $x+ay=5$, subtraction gives $(a-1)y=0$. If $a\ne1$, then $y=0$ and $x=5$. If $a=1$, the rows are identical and infinitely many pairs work. Dividing prematurely by $a-1$ would remove this case. After algebraic calculation, always return to the original problem constraints.

<p class="source-next"><a href="/en/lessons/L26/#pdf-25">Next in the PDF : Sigma notation (Σ) →</a></p>

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
