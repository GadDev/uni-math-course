---
lessonId: L10
locale: en
version: 3
status: extended
title: "Number sets, enumeration, membership and inclusion"
summary: "Order the number sets, list a set by enumeration, use the empty set, and tell membership ∈ from inclusion ⊆."
minutes: 18
objectives: [L10-O01, L10-O02, L10-O03, L10-O04, L10-O05, L10-O06]
prerequisites: [L09]
sourcePages: [41, 42, 43, 57]
---
# Number sets, enumeration, membership and inclusion

## Your objective

By the end of this lesson, you can order the number sets $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$ and $\mathbb{R}$, list a set by enumeration, use the empty set, and tell $\in$ from $\subseteq$.

**Prerequisites:** L09 (what a set is).

## Putting examples behind the letters

![Nested sets: naturals lie inside integers, integers inside rationals, rationals inside reals; zero, minus three, three halves and square root of two show the differences.](/diagrams/number-families.svg)

The natural numbers are $0,1,2,\ldots$; integers add negative numbers such as $-3$. A rational number is a fraction of two integers with a nonzero denominator, such as $\frac{3}{2}$. The reals also include irrational numbers such as $\sqrt{2}$, which cannot be written as such a fraction.

In the symbolic definition of inclusion, read $\forall$ as “for every” and $\Rightarrow$ as “if… then…”: for every object, if it belongs to $B$, it belongs to $A$. Read $\exists$ as “there exists”. You can use this English reading before working through these symbols in L11; L05 explains implication. If an object of $B$ is missing from $A$, inclusion fails.

## Number sets

The natural numbers $\mathbb{N}$, the integers $\mathbb{Z}$, the rationals $\mathbb{Q}$ and the reals $\mathbb{R}$ satisfy
$$
\mathbb{N} \subseteq \mathbb{Z} \subseteq \mathbb{Q} \subseteq \mathbb{R}.
$$
In this course, $\mathbb{N} = \{0, 1, 2, \ldots\}$ contains zero. Programming languages represent these sets differently, and common floating-point numbers approximate many real values. Some numbers, including small integers, are represented exactly; rational and symbolic representations also exist.

The **empty set** $\varnothing$ has no element.

## Sets by enumeration

A set can be defined by listing its elements, such as $\{1, 2, 4\}$. A set is determined by its elements, so $\{4, 1, 2\}$ is the same set. This remark is prerequisite support rather than source-taught.

## Membership and inclusion

Membership and inclusion are previewed here as reading support; the recall from page 57 returns with power sets in L14.

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

For $A=\{1,2,3\}$, $2\in A$ and $\{2\}\subseteq A$ are true, but $\{2\}\in A$ is false: A does not contain that singleton. This does not forbid a set from being an element. If $B=\{\{2\}\}$, then $\{2\}\in B$ is true.

Ask what is being compared: $\in$ tests an object among the elements; $\subseteq$ compares two sets. Under this course’s numerical convention, $2\subseteq A$ is not an appropriate inclusion test: $2$ is a number, not the set $\{2\}$.

## Independent practice

The selected exercises cover the number-set chain, enumeration, the empty set, telling $\in$ from $\subseteq$, the definition of inclusion and finding a non-subset.

Interactive practice is available with an account when sign-in is configured. The “Practise” button opens exercises with feedback and attempts saved in your private progress.

## Takeaway

$\mathbb{N} \subseteq \mathbb{Z} \subseteq \mathbb{Q} \subseteq \mathbb{R}$, with $0 \in \mathbb{N}$. Use $\in$ for elements and $\subseteq$ for parts, and remember that $\varnothing \subseteq A$ for every set $A$.

Original project text and examples. Coverage follows PDF pages 41–43 and 57 in the repository’s course map; no professor-authored text is reproduced.
