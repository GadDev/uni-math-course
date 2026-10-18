---
lessonId: L11
locale: en
version: 2
status: extended
title: "Predicates and quantifiers"
summary: "Read a predicate P(x) on a set, evaluate ∀ and ∃ over a domain, and see why the domain changes the truth value."
minutes: 18
objectives: [L11-O01, L11-O02, L11-O03, L11-O04, L11-O05, L11-O06]
prerequisites: [L01, L10]
sourcePages: [44, 45, 46, 47, 48]
---
# Predicates and quantifiers

## Your objective

By the end of this lesson, you can read a predicate $P(x)$ on a set $X$, evaluate $\forall x\ P(x)$ and $\exists x\ P(x)$, and explain how the domain changes the truth value.

**Prerequisites:** L01 (assertions) and L10 (sets and membership).

## Start with a finite domain

Let $X = \{1,2,4\}$ and let $P(x)$ mean “x is even”.

| x | 1 | 2 | 4 |
| --- | --- | --- | --- |
| P(x) | false | true | true |

The “for every” is false because of one; the “there exists” is true, for example because of two. A **witness** passes the test; a **counterexample** makes the general rule fail. In the earlier example, $[10,+\infty[$ means the reals greater than or equal to ten: the bracket beside ten includes it.

## Predicates

A **predicate** $P(x)$ on a set $X$ is a statement that becomes an assertion as soon as the variable $x$ is interpreted by an element of $X$. Its truth value depends on that interpretation. The definition extends to predicates with several variables, such as $P(x, y)$.

For example, on $\mathbb{R}$, let $P(x)$ be $x > 2$. It is true when $x$ is interpreted by $3$ and false when $x$ is interpreted by $1$.

## Quantifiers

If $P(x)$ is a predicate on $X$:

- $\forall x\ P(x)$ is true exactly when $P(a)$ is true for every choice of $a$ in $X$;
- $\exists x\ P(x)$ is true exactly when there is a choice of $a$ in $X$ such that $P(a)$ is true.

The symbol $\forall$ reads “for all” and $\exists$ reads “there exists”.

## Guided example: one predicate, two domains

Let $P(x)$ be $x > 2$.

1. On $\mathbb{R}$: $\exists x\ P(x)$ is true, with witness $3$. $\forall x\ P(x)$ is false, with counterexample $1$.
2. On $[10, +\infty[$: $\forall x\ P(x)$ is true, because every number from $10$ upward exceeds $2$. $\exists x\ P(x)$ is also true.

The same predicate gives a different value for $\forall$ when the domain changes.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Trap: forgetting the domain

An assertion with a quantifier is only meaningful once the set $X$ is named. Always state the domain before deciding $\forall x\ P(x)$ or $\exists x\ P(x)$.

## A caution about the source

The source’s age example on page 48 mixes nested quantifiers with a comparison “older than”. Read literally, nobody is older than themselves, so the nested statement it evaluates is not true as written. This lesson does not use that example; see the review notes.

## Independent practice

The six pilot exercises cover predicates, evaluating one value, $\forall$ on a finite domain, $\exists$ with a witness, the effect of the domain and a place-name predicate.

Interactive practice is available with an account when sign-in is configured. The “Practise” button opens exercises with feedback and attempts saved in your private progress.

## Takeaway

A predicate becomes an assertion once its variable has a value. $\forall x\ P(x)$ needs every element of the domain; $\exists x\ P(x)$ needs one. Name the domain first.

Original project text and examples. Coverage follows PDF pages 44–48 in the repository’s course map; no professor-authored text is reproduced.
