---
lessonId: L07
locale: en
version: 1
status: extended
title: "The biconditional and semantic equivalence"
summary: "Define the connective ⇔, tell it apart from the relation ≡, and use the fact that A ≡ B holds exactly when A ⇔ B is a tautology."
minutes: 12
objectives: [L07-O01, L07-O02, L07-O03, L07-O04, L07-O05, L07-O06]
prerequisites: [L04, L05, L06]
sourcePages: [30, 31]
---
# The biconditional and semantic equivalence

## Your objective

By the end of this lesson, you can define $A \Leftrightarrow B$, complete its truth table, tell the connective $\Leftrightarrow$ from the relation $\equiv$, and use a table to decide an equivalence.

**Prerequisites:** L04 (semantic equivalence and tautologies), L05 (implication) and L06 (converse).

## The biconditional

$A \Leftrightarrow B$ is the assertion defined by
$$
(A \Rightarrow B) \land (B \Rightarrow A).
$$

| A | B | A ⇒ B | B ⇒ A | A ⇔ B |
| --- | --- | --- | --- | --- |
| 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 1 | 0 | 0 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 1 | 1 | 1 | 1 |

$A \Leftrightarrow B$ is true exactly when $A$ and $B$ have the same truth value.

## Two different levels

The two symbols live at different levels.

- $\Leftrightarrow$ is a **connective**: it builds a new assertion, with its own truth table.
- $\equiv$ is a **relation between assertions**: it compares two truth tables.

One statement links the levels: $A \equiv B$ holds exactly when $A \Leftrightarrow B$ is a tautology, that is, when $A \Leftrightarrow B$ never takes the value $0$.

Why: $A \Leftrightarrow B$ is $1$ on a row exactly when $A$ and $B$ agree on that row. It is $1$ on every row exactly when they agree on every row, which is the definition of $A \equiv B$. This explanation is original project work.

## Guided example: testing an equivalence

To test $(A \Rightarrow B) \equiv (\neg A \lor B)$, check whether $(A \Rightarrow B) \Leftrightarrow (\neg A \lor B)$ is a tautology.

| A | B | A ⇒ B | ¬A ∨ B | (A ⇒ B) ⇔ (¬A ∨ B) |
| --- | --- | --- | --- | --- |
| 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

The last column is always $1$, so the equivalence holds.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Trap: mixing the two levels

$A \Leftrightarrow B$ can be $0$ on a row: for $A = 1$ and $B = 0$ it is $0$. By contrast, $A \equiv B$ is not a value computed on a row. It is a statement about the whole tables of $A$ and $B$. When $A \Leftrightarrow B$ equals $0$ on some row, that row shows that $A \equiv B$ fails.

## Independent practice

The six pilot exercises cover the definition, the truth table of the biconditional, the two levels, the link with tautologies, a table test of an equivalence and a check of the two-level confusion.

Interactive practice requires sign-in. It will be added after accounts and server grading are integrated.

## Takeaway

$\Leftrightarrow$ builds an assertion; $\equiv$ compares assertions. They meet in one fact: $A \equiv B$ exactly when $A \Leftrightarrow B$ is a tautology.

Original project text and examples. Coverage follows PDF pages 30–31 in the repository’s course map; the proof prompt on page 31 is not reproduced.
