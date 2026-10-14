---
lessonId: L04
locale: en
version: 1
status: extended
title: "Semantic equivalence and Boolean laws"
summary: "Check that two formulas have the same truth table, apply the Boolean laws, recognise tautologies and contradictions, and refute an equivalence with one row."
minutes: 14
objectives: [L04-O01, L04-O02, L04-O03, L04-O04, L04-O05, L04-O06]
prerequisites: [L01, L02, L03]
sourcePages: [15, 16, 17, 18, 19]
---
# Semantic equivalence and Boolean laws

## Your objective

By the end of this lesson, you can check that two formulas are semantically equivalent, apply the Boolean laws, recognise tautologies and contradictions, and refute an equivalence with a single row.

**Prerequisites:** L01 to L03: truth values, the connectives $\land$, $\lor$, $\neg$, and complete truth tables.

## Equivalence: the same truth table

Two assertions $A$ and $B$ are **semantically equivalent**, written $A \equiv B$, when they have the same truth table: they take the same value under **every** assignment. Logic cannot tell equivalent assertions apart.

## Equivalence is not a connective

$\equiv$ is a claim about two formulas, not an operator inside a formula. The statement $A \equiv B$ is true exactly when the two truth tables match.

Do not confuse it with $\Leftrightarrow$, the biconditional connective studied in L07. The formula $A \Leftrightarrow B$ is an assertion built from $A$ and $B$; the statement $A \equiv B$ compares two formulas.

## Boolean laws

For all assertions $A$, $B$ and $C$, the following equivalences hold:

- commutativity: $A \lor B \equiv B \lor A$ and $A \land B \equiv B \land A$;
- associativity: $A \lor (B \lor C) \equiv (A \lor B) \lor C$ and $A \land (B \land C) \equiv (A \land B) \land C$;
- distributivity: $A \lor (B \land C) \equiv (A \lor B) \land (A \lor C)$ and $A \land (B \lor C) \equiv (A \land B) \lor (A \land C)$;
- double negation: $\neg\neg A \equiv A$;
- excluded middle: $A \lor \neg A \equiv \top$;
- non-contradiction: $A \land \neg A \equiv \neg\top$;
- De Morgan: $\neg(A \lor B) \equiv \neg A \land \neg B$ and $\neg(A \land B) \equiv \neg A \lor \neg B$.

## Guided example: checking a distributive law

Check that $A \lor (B \land C) \equiv (A \lor B) \land (A \lor C)$. Compute both sides on all eight assignments.

| A | B | C | A ∨ (B ∧ C) | (A ∨ B) ∧ (A ∨ C) |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 0 |
| 0 | 1 | 0 | 0 | 0 |
| 0 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 1 |

The two columns agree on every row, so the equivalence holds. This check uses truth tables; deriving the law from the others is a different method, not required here.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Tautologies and contradictions

A **tautology** is an assertion that is true under every assignment. A **contradiction** is false under every assignment. The constant $\top$ is a tautology, and $\neg\top$ is a contradiction.

- $A \lor \neg A$ is a tautology.
- $A \land \neg A$ is a contradiction.

## Trap: negating each part

$\neg (A \land B)$ is not equivalent to $\neg A \land \neg B$. One row refutes the equivalence: with $A = 1$ and $B = 0$, the left side is $\neg 0 = 1$, while the right side is $0 \land 1 = 0$.

A single differing row is enough to refute an equivalence. Agreement must hold on every row to establish one.

## Independent practice

The six pilot exercises cover the definition of equivalence, the De Morgan law, a truth-table check, recognising a tautology, the excluded-middle and non-contradiction laws, and refuting an equivalence with one row.

Interactive practice requires sign-in. It will be added after accounts and server grading are integrated.

## Takeaway

Two formulas are equivalent when their truth tables are identical. Boolean laws give such equivalences; a single differing row refutes one; and tautologies and contradictions are the formulas that are always true or always false.

Original project text and examples. Coverage follows PDF pages 15–19 in the repository’s course map. The proof prompt on page 19 is not reproduced; the worked check above is original project work.
