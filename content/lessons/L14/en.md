---
lessonId: L14
locale: en
version: 2
status: extended
title: "Power sets"
summary: "List the parts of a small set, use the notation 𝒫(A) and 2^A, and avoid confusing an element with a part."
minutes: 12
objectives: [L14-O01, L14-O02, L14-O03, L14-O04, L14-O05, L14-O06]
prerequisites: [L10]
sourcePages: [58]
---
# Power sets

## Your objective

By the end of this lesson, you can define $\mathcal{P}(A)$, list its elements for a small set, and tell an element of $A$ from an element of $\mathcal{P}(A)$.

**Prerequisites:** L10 (membership and inclusion).

## Build the subsets without missing one

For $A = \{a,b\}$, decide separately whether to keep each element.

| Keep a? | Keep b? | Resulting subset |
| --- | --- | --- |
| no | no | empty set |
| yes | no | a only |
| no | yes | b only |
| yes | yes | a and b |

Two choices per element give four results. With zero elements, there is nothing to choose: there is still one subset, the empty set. A set and its power set can share an element: with $A = \{\varnothing\}$, the empty set belongs to both. The distinction is their role, not a prohibition on shared elements.

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

## Recall at the location of page 57

The source recalls the two relations here: $a \in A$ means that an object belongs to A; $B \subseteq A$ means that every element of B belongs to A. L10 previewed them to support reading. The new step now gathers **all subsets** into one set: $B \in \mathcal{P}(A)$ exactly when $B \subseteq A$.

## Independent practice

The six pilot exercises cover counting parts, recognising a part, the empty set as a part, the count $2^n$, the power set of the empty set and the element-versus-part distinction.

Interactive practice is available with an account when sign-in is configured. The “Practise” button opens exercises with feedback and attempts saved in your private progress.

## Takeaway

$\mathcal{P}(A)$ is the set of all parts of $A$. It always contains $\varnothing$ and $A$, and a set with $n$ elements has $2^n$ parts.

Original project text and examples. Coverage follows PDF page 58 in the repository’s course map; the counting remark is supporting enrichment.
