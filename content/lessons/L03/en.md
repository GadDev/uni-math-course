---
lessonId: L03
locale: en
version: 2
status: pilot
title: "Truth tables: computing a formula row by row"
summary: "List every assignment, build a table column by column from its subformulas, evaluate a formula on one row and check a completed table."
minutes: 12
objectives: [L03-O01, L03-O02, L03-O03, L03-O04, L03-O05, L03-O06]
prerequisites: [L01, L02]
sourcePages: [13, 14]
---
# Truth tables: computing a formula row by row

## Your objective

By the end of this lesson, you can list all assignments for several assertions, build a truth table column by column, evaluate a formula on one row, and check a completed table.

**Prerequisites:** L01 (truth values $1$ and $0$) and L02 (the connectives $\land$, $\lor$, $\neg$).

## Atomic and composite assertions

An assertion is **atomic** when it is not built from other assertions with $\lor$, $\land$ or $\neg$. Otherwise it is **composite**.

- $A$, $B$ and $C$ are atomic.
- $(A \land B) \lor \neg C$ is composite: it is built from $A$, $B$ and $C$.

A truth table describes a composite assertion on every assignment of values to its atomic assertions. The value of a composite assertion is inferred step by step from its parts, and the table organises that computation.

## Listing the rows

With $n$ atomic assertions there are $2^n$ assignments. List them systematically, starting with all zeros and counting upward in binary. For three assertions $A$, $B$, $C$, the eight rows are $000$, $001$, $010$, $011$, $100$, $101$, $110$ and $111$.

## Building a table column by column

Compute the subformulas first, then combine them. Take $(A \lor B) \land \neg A$ with two assertions.

| A | B | A ∨ B | ¬A | (A ∨ B) ∧ ¬A |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 1 | 0 |
| 0 | 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 0 | 0 |
| 1 | 1 | 1 | 0 | 0 |

Each column uses only columns already computed or the atomic columns $A$ and $B$.

## Guided example: reading the finished table

The last column is true only in row $01$: there $A = 0$ and $B = 1$. The formula $(A \lor B) \land \neg A$ is therefore true exactly when $A$ is false and $B$ is true.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Trap: one row is not the whole table

Evaluating a formula on one row does not describe it. You must cover every assignment. A common error is to write too few rows, or to copy a value from the row above instead of recomputing it.

## Independent practice

The six pilot exercises cover counting rows, identifying atomic assertions, building and reading three-assertion tables, evaluating one row and checking a student’s table.

Interactive practice requires sign-in. Availability depends on this lesson’s selected version and release status.

## Takeaway

A truth table lists every assignment, computes subformulas first, and then gives the value of the whole formula on each row. A complete table, not a single row, is the complete meaning of the formula.

Original project text and examples. Coverage follows PDF pages 13–14 in the repository’s course map; no professor-authored text is reproduced.
