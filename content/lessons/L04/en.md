---
lessonId: L04
locale: en
version: 3
status: extended
title: "Semantic equivalence and Boolean laws"
summary: "Check that two formulas have the same truth table, apply the Boolean laws, recognise tautologies and contradictions, and refute an equivalence with one row."
minutes: 30
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

## Boolean algebra: rewrite while keeping the meaning

A Boolean law lets you replace a formula with another that always gives the same result. Think of two different recipes producing the same final column. Here $A$, $B$ and $C$ may also stand for whole formulas: a law still holds when every occurrence of the same letter is replaced by the same formula.

An assignment fixes a value for every variable. A calculation on one assignment illustrates a law; it does not prove it. To check a law with a table, compare every row. The explanations and examples below are original project developments.

### Commutativity: change the order

$A \lor B \equiv B \lor A$ and $A \land B \equiv B \land A$.

“Having a ticket AND an invitation” requires the same things as “having an invitation AND a ticket”. OR also works both ways: what matters is how many parts are true, not their position. If $A = 0$ and $B = 1$, both disjunctions are $1$ and both conjunctions are $0$.

### Associativity: change the grouping

$A \lor (B \lor C) \equiv (A \lor B) \lor C$ and $A \land (B \land C) \equiv (A \land B) \land C$.

With OR throughout, both versions need at least one true part; with AND throughout, they need all three parts true. Parentheses change the order of calculation, not the result.

This does not let you move parentheses freely in a mixed formula. With $A = 0$, $B = 1$, $C = 1$, $A \land (B \lor C)$ is $0$, but $(A \land B) \lor C$ is $1$.

### Distributivity: expand and factor

![Tree of A AND (B OR C): the main AND joins A to the B OR C group; B and C are the two OR inputs.](/diagrams/formula-grouping.svg)

$A \land (B \lor C) \equiv (A \land B) \lor (A \land C)$.

Fix a person and an event. Let $A$ mean “they are registered”, $B$ mean “they have a paper ticket” and $C$ mean “they have a digital ticket”. “Registered AND holding a paper OR digital ticket” is made precise by $A \land (B \lor C)$. It means “registered with a paper ticket, OR registered with a digital ticket”. The condition $A$ accompanies each possibility.

The other distributive law holds too:

$A \lor (B \land C) \equiv (A \lor B) \land (A \lor C)$.

Why? If $A$ is true, both sides are true. If $A$ is false, both sides require $B$ and $C$ to be true. This justification covers every case without a misleading analogy with ordinary addition.

Both laws also read from right to left: this is **factoring**. For example, $(A \land B) \lor (A \land C)$ becomes $A \land (B \lor C)$. Keep both branches; dropping $A \land C$ would lose one possibility.

### Double negation: undo two flips

$\neg\neg A \equiv A$.

NOT flips a value, then the second NOT flips it back: $0$ becomes $1$, then $0$; $1$ becomes $0$, then $1$. In classical logic, “it is false that I have no ticket” therefore says “I have a ticket”. Both negations must apply to the same assertion.

### Excluded middle and non-contradiction: always true or always false

$A \lor \neg A \equiv \top$ and $A \land \neg A \equiv \neg\top$.

Read $\top$ as “always true”. Read $\neg\top$ as “negation of the true constant”; it denotes the always-false constant: the negation applies to the true constant. It is sometimes written $\bot$; we keep $\neg\top$ as in the source.

In the classical setting, for a precise assertion, either it is true or its negation is true: this is **excluded middle**. They are never true together: this is **non-contradiction**. Not knowing whether an assertion is true does not give it a third value.

| A | ¬A | A ∨ ¬A | A ∧ ¬A |
| --- | --- | --- | --- |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |

### De Morgan: negate a whole group

$\neg(A \lor B) \equiv \neg A \land \neg B$ and $\neg(A \land B) \equiv \neg A \lor \neg B$.

With $A$ meaning “I have a ticket” and $B$ meaning “I have an invitation”, negating “I have a ticket OR an invitation” means having **neither a ticket nor an invitation**. Both must be missing. Negating “I have a ticket AND an invitation” means at least one is missing; both do not have to be missing.

Method: identify the connective inside the parentheses, swap AND and OR, then negate each part. For a larger group, work through one pair of parentheses at a time.

| A | B | ¬(A ∧ B) | ¬A ∨ ¬B |
| --- | --- | --- | --- |
| 0 | 0 | 1 | 1 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 0 |

### A rewrite in two steps

Start with $\neg(\neg A \lor B)$. De Morgan gives $\neg\neg A \land \neg B$. Double negation then gives $A \land \neg B$. Each step preserves the truth table: write the law’s name beside each transformation so you can check it.

### Pause: try before reading

1. Reorder $B \land A$ to start with $A$.
2. Factor $(C \land A) \lor (C \land B)$.
3. Negate $A \lor \neg B$ without leaving a negation before a group.

Answers: $A \land B$ (commutativity); $C \land (A \lor B)$ (distributivity in reverse); $\neg A \land B$ (De Morgan then double negation). These are guided attempts with visible solutions; the following exercises let you try again with different formulas.

## Tautologies and contradictions

A **tautology** is an assertion that is true under every assignment. A **contradiction** is false under every assignment. The constant $\top$ is a tautology, and $\neg\top$ is a contradiction.

- $A \lor \neg A$ is a tautology.
- $A \land \neg A$ is a contradiction.

## Trap: negating each part

$\neg (A \land B)$ is not equivalent to $\neg A \land \neg B$. One row refutes the equivalence: with $A = 1$ and $B = 0$, the left side is $\neg 0 = 1$, while the right side is $0 \land 1 = 0$.

A single differing row is enough to refute an equivalence. Agreement must hold on every row to establish one.

## Developing the proof proposed on page 19

The source proposes proving $A \land (B \lor C) \equiv (A \land B) \lor (A \land C)$ without supplying the proof. Here is an original argument by cases.

If $A = 0$, the left side is zero and both conjunctions on the right are zero. If $A = 1$, the left side is $B \lor C$ and so is the right side. A has only these two values: the argument covers every assignment of B and C. It develops the source’s task without attributing this solution to the lecturer.

## Independent practice

The fourteen exercises in this lesson cover the definition of equivalence, the De Morgan law, a truth-table check, recognising a tautology, the excluded-middle and non-contradiction laws, and refuting an equivalence with one row. Eight new exercises also practise commutativity, associativity, double negation, both distributive laws and factoring.

Interactive practice requires sign-in. Availability depends on this lesson’s selected version and release status.

## Takeaway

Two formulas are equivalent when their truth tables are identical. Boolean laws give such equivalences; a single differing row refutes one; and tautologies and contradictions are the formulas that are always true or always false.

Original project text and examples. Coverage follows PDF pages 15–19 in the repository’s course map. The case argument developing page 19’s objective and the completed checks are original project developments.
