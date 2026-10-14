---
lessonId: L14
locale: en
version: 1
status: extended
title: "Power sets"
summary: "List the parts of a small set, use the notation 𝒫(A) and 2^A, and avoid confusing an element with a part."
minutes: 8
objectives: [L14-O01, L14-O02, L14-O03, L14-O04, L14-O05, L14-O06]
prerequisites: [L10]
sourcePages: [58]
---
# Power sets

## Your objective

By the end of this lesson, you can define $\mathcal{P}(A)$, list its elements for a small set, and tell an element of $A$ from an element of $\mathcal{P}(A)$.

**Prerequisites:** L10 (membership and inclusion).

## Definition

If $A$ is a set, $2^A$ or $\mathcal{P}(A)$ denotes the set whose elements are the parts of $A$. Its elements are sets: each one is a subset of $A$.

For example:
$$
\mathcal{P}(\{1, 2\}) = \{\varnothing, \{1\}, \{2\}, \{1, 2\}\}.
$$

## Two parts that are always there

For every set $A$, both $\varnothing$ and $A$ itself belong to $\mathcal{P}(A)$, because $\varnothing \subseteq A$ and $A \subseteq A$.

## How many parts?

A set with $n$ elements has $2^n$ parts: each element is either in a part or not. This remark explains the notation $2^A$ and is supporting enrichment, not a stated source result.

## Guided example: three elements

Let $A = \{a, b, c\}$. Its parts are $\varnothing$, $\{a\}$, $\{b\}$, $\{c\}$, $\{a, b\}$, $\{a, c\}$, $\{b, c\}$ and $\{a, b, c\}$. That is $2^3 = 8$ parts.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Trap: element or part?

The elements of $\mathcal{P}(\{1, 2\})$ are sets. So $\{1\} \in \mathcal{P}(\{1, 2\})$ is true, while $1 \in \mathcal{P}(\{1, 2\})$ is false: $1$ is an element of $\{1, 2\}$, not a part of it. Also $\mathcal{P}(\varnothing) = \{\varnothing\}$ has one element, so it is not empty.

## Independent practice

The six pilot exercises cover counting parts, recognising a part, the empty set as a part, the count $2^n$, the power set of the empty set and the element-versus-part distinction.

Interactive practice requires sign-in. It will be added after accounts and server grading are integrated.

## Takeaway

$\mathcal{P}(A)$ is the set of all parts of $A$. It always contains $\varnothing$ and $A$, and a set with $n$ elements has $2^n$ parts.

Original project text and examples. Coverage follows PDF page 58 in the repository’s course map; the counting remark is supporting enrichment.
