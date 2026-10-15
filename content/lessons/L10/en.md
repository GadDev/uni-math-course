---
lessonId: L10
locale: en
version: 1
status: extended
title: "Number sets, enumeration, membership and inclusion"
summary: "Order the number sets, list a set by enumeration, use the empty set, and tell membership ∈ from inclusion ⊆."
minutes: 12
objectives: [L10-O01, L10-O02, L10-O03, L10-O04, L10-O05, L10-O06]
prerequisites: [L09]
sourcePages: [41, 42, 43, 57]
---
# Number sets, enumeration, membership and inclusion

## Your objective

By the end of this lesson, you can order the number sets $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$ and $\mathbb{R}$, list a set by enumeration, use the empty set, and tell $\in$ from $\subseteq$.

**Prerequisites:** L09 (what a set is).

## Number sets

The natural numbers $\mathbb{N}$, the integers $\mathbb{Z}$, the rationals $\mathbb{Q}$ and the reals $\mathbb{R}$ satisfy
$$
\mathbb{N} \subseteq \mathbb{Z} \subseteq \mathbb{Q} \subseteq \mathbb{R}.
$$
In this course, $\mathbb{N} = \{0, 1, 2, \ldots\}$ contains zero. Programming languages represent these sets differently, and computers represent real numbers only approximately.

**Prerequisite visual guide:** Explore the [number families](/en/numbers/) to distinguish natural, rational, irrational, real and complex numbers.

The **empty set** $\varnothing$ has no element.

## Sets by enumeration

A set can be defined by listing its elements, such as $\{1, 2, 4\}$. A set is determined by its elements, so $\{4, 1, 2\}$ is the same set. This remark is prerequisite support rather than source-taught.

## Membership and inclusion

For sets $A$ and $B$:

- $a \in A$ means that $a$ is an element of $A$;
- $B \subseteq A$ means that every element of $B$ is an element of $A$, that is,
$$
\forall b\ (b \in B \Rightarrow b \in A).
$$

We then say that $B$ is a **part** or **subset** of $A$. Membership relates an object to a set; inclusion relates two sets.

## Guided example: telling the symbols apart

Let $A = \{1, 2, 3\}$.

1. $2 \in A$ is true: $2$ is an element of $A$.
2. $\{2\} \subseteq A$ is true: the only element of $\{2\}$ is in $A$.
3. $\{2\} \in A$ is false: the elements of $A$ are numbers, and $\{2\}$ is a set.
4. $\varnothing \subseteq A$ is true: $\varnothing$ has no element that could fail to be in $A$.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Trap: element or part?

Writing $\{2\} \in A$ or $2 \subseteq A$ mixes the two relations. Ask which one you mean: “is an element of” uses $\in$, “is a part of” uses $\subseteq$.

## Independent practice

The six pilot exercises cover the number-set chain, enumeration, the empty set, telling $\in$ from $\subseteq$, the definition of inclusion and finding a non-subset.

Interactive practice requires sign-in. It will be added after accounts and server grading are integrated.

## Takeaway

$\mathbb{N} \subseteq \mathbb{Z} \subseteq \mathbb{Q} \subseteq \mathbb{R}$, with $0 \in \mathbb{N}$. Use $\in$ for elements and $\subseteq$ for parts, and remember that $\varnothing \subseteq A$ for every set $A$.

Original project text and examples. Coverage follows PDF pages 41–43 and 57 in the repository’s course map; no professor-authored text is reproduced.
