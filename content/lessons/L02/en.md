---
lessonId: L02
locale: en
version: 2
status: pilot
title: "Logical connectives: and, or, not"
summary: "Read the connectives ∧, ∨ and ¬ with their constants, evaluate them on given values, apply the precedence of ¬, and tell inclusive “or” from exclusive “or”."
minutes: 12
objectives: [L02-O01, L02-O02, L02-O03, L02-O04, L02-O05, L02-O06]
prerequisites: [L01]
sourcePages: [6, 7, 8, 9, 10, 11, 12]
---
# Logical connectives: and, or, not

## Your objective

By the end of this lesson, you can read $\land$, $\lor$, $\neg$ and $\top$, evaluate them on given values, apply the precedence of $\neg$, and tell inclusive “or” from exclusive “or”.

**Prerequisites:** L01, where an assertion has one truth value, written $1$ or $0$.

## Notation and the constant $\top$

Letters $A$, $B$, $C$, and so on name assertions, or variables interpreted by assertions. New assertions are built from existing ones with connectives. The constant $\top$ is an assertion that is always true, whatever the other assertions are.

You will meet several notations for the same connective:

- $A \land B$, also written $A \cdot B$, read “A and B”.
- $A \lor B$, also written $A + B$, read “A or B”.
- $\neg A$, also written $A'$, read “not A”.

## Conjunction: and

$A \land B$ is true exactly when both $A$ and $B$ are true.

| A | B | A ∧ B |
| --- | --- | --- |
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

## Disjunction: inclusive or

$A \lor B$ is true exactly when at least one of $A$ and $B$ is true. It is also true when both are true.

| A | B | A ∨ B |
| --- | --- | --- |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

## Negation and precedence

$\neg A$ is true exactly when $A$ is false.

| A | ¬A |
| --- | --- |
| 0 | 1 |
| 1 | 0 |

In this course, $\neg$ takes priority over the other connectives. So $\neg A \lor B$ means $(\neg A) \lor B$, not $\neg (A \lor B)$. The course does not give a default order between $\land$ and $\lor$, so write parentheses whenever they appear together, as in $(A \land B) \lor C$.

## Guided example: a mixed formula

Evaluate $\neg A \lor B$ when $A = 1$ and $B = 1$.

1. Compute the negation first: $\neg A = 0$.
2. Compute $(\neg A) \lor B = 0 \lor 1$.
3. One part is true, so the result is $1$.

The other reading, $\neg (A \lor B)$, gives $\neg 1 = 0$. The two readings differ, which is why precedence matters.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Trap: inclusive or is not exclusive

In $A \lor B$, the case $A = B = 1$ counts as true. An exclusive “either … or …”, often called XOR, is false in that case because it requires exactly one true part. Mathematical “or” in this course is inclusive unless stated otherwise.

## Independent practice

The six pilot exercises cover the conjunction, the notations, inclusive or, precedence, the constant $\top$ and the need for parentheses.

Interactive practice requires sign-in. Availability depends on this lesson’s selected version and release status.

## Takeaway

$\land$ needs both parts, $\lor$ needs at least one part, and $\neg$ flips a value. $\neg$ binds tightest, and mixed formulas need parentheses.

Original project text and examples. Coverage follows PDF pages 6–12 in the repository’s course map; no professor-authored text is reproduced.
