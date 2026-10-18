---
lessonId: L13
locale: en
version: 2
status: extended
title: "Set comprehension"
summary: "Read and compute a set defined by comprehension, including intervals and the even numbers, and separate the domain from the filter."
minutes: 16
objectives: [L13-O01, L13-O02, L13-O03, L13-O04, L13-O05, L13-O06]
prerequisites: [L10, L11]
sourcePages: [52, 53, 54, 55, 56]
---
# Set comprehension

## Your objective

By the end of this lesson, you can read $\{a \in X \mid P(a)\}$, compute it for a finite $X$, recognise intervals and the even numbers written this way, and separate the domain $X$ from the filter $P$.

**Prerequisites:** L10 (sets and enumeration) and L11 (predicates).

## Watch the filter work

![Open interval from two to four: excluded endpoints, open circles; closed interval: included endpoints, filled dots.](/diagrams/interval-endpoints.svg)

For $X = \{1,2,3,4\}$ and the test “greater than two”, one and two are rejected; three and four are kept. The result set contains only three and four. The symbol $\mid$ separates candidate objects from the test and reads “such that”.

In an interval, $+\infty$ is not a real number that could be included: that end always has an open bracket. Compare $]2,4[$ (without two or four) and $[2,4]$ (with both endpoints).

## Definition

If $P(x)$ is a predicate on $X$, the set of elements $a$ of $X$ for which $P(a)$ is true is written
$$
\{a \in X \mid P(a)\}.
$$
It reads “the set of $a$ in $X$ such that $P(a)$”.

## Intervals

With French notation, an outward bracket excludes an endpoint and an inward bracket includes it:
$$
\{x \in \mathbb{R} \mid x > 2\} = ]2, +\infty[.
$$
The interval $[10, +\infty[$ contains $10$ and every larger real number.

## The even numbers

$$
\{n \in \mathbb{N} \mid \exists k \in \mathbb{N}\ n = 2k\} = \{0, 2, 4, \ldots\}.
$$
Here $\exists k \in \mathbb{N}$ reads “there exists $k$ in $\mathbb{N}$”. Zero is included, since $0 = 2 \cdot 0$.

## Guided example: the primes up to 8

Let $X = \{1, 2, 3, 4, 5, 6, 7, 8\}$ and let $P(n)$ be “$n$ is prime”.

1. Test each element of $X$ against $P$.
2. The elements that pass are $2$, $3$, $5$ and $7$.
3. So $\{n \in X \mid P(n)\} = \{2, 3, 5, 7\}$.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Trap: domain and filter

The result depends on both parts. $\{n \in \{1, 2, 3\} \mid n > 5\} = \varnothing$, because the filter removes every element. And $\{x \in \mathbb{N} \mid x > 2\}$ is not the same set as $\{x \in \mathbb{R} \mid x > 2\}$: the domain differs.

## Independent practice

The six pilot exercises cover a finite comprehension, two intervals, the even numbers, an empty result and a prime filter.

Interactive practice is available with an account when sign-in is configured. The “Practise” button opens exercises with feedback and attempts saved in your private progress.

## Takeaway

$\{a \in X \mid P(a)\}$ keeps the elements of the given set $X$ that satisfy $P$. Name the domain, apply the filter, and expect the result to be empty when nothing passes.

Original project text and examples. Coverage follows PDF pages 52–56 in the repository’s course map; no professor-authored text is reproduced.
