---
lessonId: L12
locale: en
version: 3
status: extended
title: "Negating quantified statements"
summary: "Negate ∀ and ∃ correctly, state negations in everyday language, and use counterexamples and witnesses."
minutes: 10
objectives: [L12-O01, L12-O02, L12-O03, L12-O04, L12-O05, L12-O06]
prerequisites: [L11]
sourcePages: [49, 50, 51]
---
# Negating quantified statements

## Your objective

By the end of this lesson, you can negate $\forall x\ P(x)$ and $\exists x\ P(x)$, state negations in everyday language, and use counterexamples and witnesses.

**Prerequisites:** L11 (predicates and quantifiers).

## Negating “for all”

“In the library, every book is available” fails as soon as one book is not available. Its negation is “In the library, some book is not available”.

## Negating “there exists”

“At the club, some member is under 18” fails when nobody is under 18. Its negation is “At the club, every member is 18 or older”.

## The two laws

If $P(x)$ is a predicate on $X$:
$$
\neg \forall x\ P(x) \equiv \exists x\ \neg P(x),
$$
$$
\neg \exists x\ P(x) \equiv \forall x\ \neg P(x).
$$

The negation swaps the quantifier and negates the predicate.

## Guided example: natural numbers above 2

Take the domain $\mathbb{N}$, with $0 \in \mathbb{N}$, and $P(n)$ be $n > 2$.

1. $\forall n\ P(n)$ is false: $n = 0$ is a counterexample.
2. Its negation is $\exists n\ \neg P(n)$, which says $\exists n\ n \leq 2$.
3. This is true, and $n = 0$ is a witness.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Trap: negating only the predicate

$\neg \forall x\ P(x)$ is not $\forall x\ \neg P(x)$. On the domain $\{1, 2\}$ with $P(x)$ being $x > 1$, the first is true because $P(1)$ fails, while the second is false because $P(2)$ holds. “Not every bird flies” does not mean “no bird flies”.

## Negate the whole sentence, even on an empty domain

$\neg$ means NOT and here applies to the whole quantified statement. The symbol $\equiv$ says that both formulations have the same truth in every interpretation of the domain and predicate; this extends the formula comparison from L04 to quantified statements.

If $X$ is empty, “every element satisfies P” is true because no counterexample exists; “some element satisfies P” is false because no witness exists. Their negations are false and true respectively: both laws still work. In the first example, say explicitly “there exists at least one unavailable book”; this does not mean exactly one book.

## Independent practice

The selected exercises cover the two laws, everyday negations and a counterexample, and the numerical negation on $\mathbb{N}$.

Interactive practice is available with an account when sign-in is configured. The “Practise” button opens exercises with feedback and attempts saved in your private progress.

## Takeaway

To negate a quantified statement, swap $\forall$ and $\exists$ and negate the predicate. A counterexample refutes a “for all”; a witness proves a “there exists”.

Original project text and examples. Coverage follows PDF pages 49–51 in the repository’s course map; no professor-authored text is reproduced.
