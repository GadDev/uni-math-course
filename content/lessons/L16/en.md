---
lessonId: L16
locale: en
version: 3
status: extended
title: "Bounded quantifiers"
summary: "Read ∀x ∈ X and ∃x ∈ X as shorthand, expand bounded quantifiers with the appropriate connective, and negate bounded statements."
minutes: 12
objectives: [L16-O01, L16-O02, L16-O03, L16-O04, L16-O05, L16-O06]
prerequisites: [L11, L12]
sourcePages: [67, 68, 69, 70]
---
# Bounded quantifiers

## Your objective

By the end of this lesson, you can expand $\forall x \in X\ P(x)$ and $\exists x \in X\ P(x)$, pair each quantifier with the right connective, and negate bounded statements.

**Prerequisites:** L11 (quantifiers) and L12 (negating quantifiers).

## Notation

If $X$ is a set and $P(x)$ a predicate, we write

- $\forall x \in X\ P(x)$ for $\forall x\ (x \in X \Rightarrow P(x))$;
- $\exists x \in X\ P(x)$ for $\exists x\ (x \in X \land P(x))$.

The quantifier then ranges over a larger universe, and the membership condition $x \in X$ restricts it.

## Remember

When **expanding these bounded quantifiers over a larger universe**, $\forall$ goes with $\Rightarrow$, and $\exists$ with $\land$. This mnemonic does not apply to every use of these symbols.

## Guided example: why the pairing matters

Work in the universe $U = \{1, 2, 3, 4, 5\}$ with $X = \{1, 2, 3\}$ and let $P(x)$ be $x > 10$.

1. $\forall x\ (x \in X \Rightarrow P(x))$ is false: $x = 1$ lies in $X$ and fails $P$.
2. $\exists x\ (x \in X \land P(x))$ is false: no element of $X$ satisfies $P$.
3. $\exists x\ (x \in X \Rightarrow P(x))$ is true: take $x = 4$. It is not in $X$, so the implication holds whatever $P$ says.

The third statement is true for any predicate as soon as some object lies outside $X$, so it says nothing useful about $X$.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Negation

Negation keeps the bound:
$$
\neg \forall x \in X\ P(x) \equiv \exists x \in X\ \neg P(x),
$$
$$
\neg \exists x \in X\ P(x) \equiv \forall x \in X\ \neg P(x).
$$

## The empty set

$\forall x \in \varnothing\ P(x)$ is true for every $P$: it expands to $\forall x\ (x \in \varnothing \Rightarrow P(x))$, and $x \in \varnothing$ is always false, so every implication holds. This is a consequence of the expansion, not a separate rule.

## Trap: the wrong connective

Writing $\exists x\ (x \in X \Rightarrow P(x))$ for “some element of $X$ satisfies $P$” is wrong, and so is $\forall x\ (x \in X \land P(x))$ for “every element of $X$ satisfies $P$”: the second one says that every object in the universe lies in $X$.

## From the domain to a table

The universe U is the set traversed by unbounded quantifiers; X is the part our claim concerns. To expand the notation, test P must make sense throughout U (or be extended to U). L05 explains $\Rightarrow$: it can fail only with a true condition and a false conclusion.

Here is the example’s table, with $P(x)$ meaning $x>10$. Row $4$ satisfies the implication without satisfying the conjunction: it explains the spurious witness in the third statement.

| x | $x\in X$ | $P(x)$ | $x\in X\Rightarrow P(x)$ | $x\in X\land P(x)$ |
| --- | --- | --- | --- | --- |
| 1 | 1 | 0 | 0 | 0 |
| 2 | 1 | 0 | 0 | 0 |
| 3 | 1 | 0 | 0 | 0 |
| 4 | 0 | 0 | 1 | 0 |
| 5 | 0 | 0 | 1 | 0 |

In the example, one, two and three belong to X and fail the test; four and five lie outside X and therefore cannot refute the rule about X. For empty X, “for every” is true without a counterexample and “there exists” is false without a witness. The mnemonic concerns expanding bounded quantifiers, not every use of these symbols.

## Independent practice

The selected exercises cover the two expansions, the pairing of quantifier and connective, the wrong-connective trap, negation and the empty set.

Interactive practice is available with an account when sign-in is configured. The “Practise” button opens exercises with feedback and attempts saved in your private progress.

## Takeaway

$\forall x \in X$ expands with $\Rightarrow$; $\exists x \in X$ expands with $\land$. Negation swaps the quantifiers and keeps the bound.

Original project text and examples. Coverage follows PDF pages 67–70 in the repository’s course map; no professor-authored text is reproduced.
