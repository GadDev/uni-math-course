---
lessonId: L17
locale: en
version: 1
status: extended
title: "Products, relations and the order of quantifiers"
summary: "Describe a small table as a set of ordered pairs, translate sentences into nested quantifiers, evaluate them, and see that the order of quantifiers matters."
minutes: 14
objectives: [L17-O01, L17-O02, L17-O03, L17-O04, L17-O05, L17-O06]
prerequisites: [L11, L16]
sourcePages: [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81]
---
# Products, relations and the order of quantifiers

## Your objective

By the end of this lesson, you can describe a table as a set of ordered pairs, translate sentences into statements with two quantifiers, evaluate them on a small table, and explain why their order matters.

**Prerequisites:** L11 (quantifiers) and L16 (bounded quantifiers).

## A toy table

Take students $E = \{\text{lia}, \text{max}, \text{noa}\}$ and courses $C = \{\text{art}, \text{bio}\}$. The enrolments are the pairs $(\text{lia}, \text{art})$, $(\text{max}, \text{bio})$ and $(\text{noa}, \text{bio})$.

In this teaching model, a table is a set of rows without duplicates. Real SQL tables can contain duplicates and missing values; this lesson does not cover them.

## Ordered pairs and products

An **ordered pair** $(x, c)$ has two components, and their order counts. The **Cartesian product** is
$$
E \times C := \{(x, c) \mid x \in E \land c \in C\}.
$$
Here $E \times C$ has $3 \times 2 = 6$ pairs. Let $I(x, c)$ be the predicate “$x$ is enrolled in $c$”, true exactly when $(x, c)$ is an enrolment.

## Translating sentences

- “Every student is enrolled in at least one course”: $\forall x \in E\ \exists c \in C\ I(x, c)$.
- “There is a course taken by all students”: $\exists c \in C\ \forall x \in E\ I(x, c)$.

## Guided example: evaluating both

1. $\forall x \in E\ \exists c \in C\ I(x, c)$: lia takes art, max takes bio and noa takes bio. Every student has a course, so the statement is true.
2. $\exists c \in C\ \forall x \in E\ I(x, c)$: art is taken only by lia, and bio only by max and noa. No course is taken by all three students, so the statement is false.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Trap: the order matters

The two statements above use the same predicate and the same quantifiers in a different order, and they have different values here. In general, $\forall x\ \exists c$ is not the same as $\exists c\ \forall x$: the first lets the course depend on the student, the second does not.

## Independent practice

The six pilot exercises cover counting pairs, reading the predicate, two translations, an evaluation and the effect of the order of quantifiers.

Interactive practice requires sign-in. It will be added after accounts and server grading are integrated.

## Takeaway

A table is a set of pairs, and a relation is a predicate on a product. In nested quantifiers, the order changes the meaning: translate carefully, then evaluate against the data.

Original project text and examples. Coverage follows PDF pages 71–81 in the repository’s course map; the example data and sentences are original.
