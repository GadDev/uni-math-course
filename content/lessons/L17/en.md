---
lessonId: L17
locale: en
version: 2
status: extended
title: "Products, relations and the order of quantifiers"
summary: "Describe a small table as a set of ordered pairs, translate sentences into nested quantifiers, evaluate them, and see that the order of quantifiers matters."
minutes: 18
objectives: [L17-O01, L17-O02, L17-O03, L17-O04, L17-O05, L17-O06]
prerequisites: [L11, L16]
sourcePages: [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81]
---
# Products, relations and the order of quantifiers

## Your objective

By the end of this lesson, you can describe a table as a set of ordered pairs, translate sentences into statements with two quantifiers, evaluate them on a small table, and explain why their order matters.

**Prerequisites:** L11 (quantifiers) and L16 (bounded quantifiers).

## See the relation in a grid

The symbol $:=$ means “is defined by”; the product collects all possible pairs, not just enrolments. Read $\mid$ as “such that”, as in L13.

| Student | art | bio |
| --- | --- | --- |
| lia | enrolled | not enrolled |
| max | not enrolled | enrolled |
| noa | not enrolled | enrolled |

The six cells are the six pairs of the product. The three “enrolled” cells form the relation. For “every student, at least one course”, seek an enrolled cell in each row; for “one course for everyone”, seek a column entirely enrolled. These searches ask different things.

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

## Returning to the PDF’s data

Pages 71 to 81 use students ana, ben, cleo, courses math, prog, and enrolments (ana, math), (ana, prog), (ben, prog).

| Student | math | prog |
| --- | --- | --- |
| ana | enrolled | enrolled |
| ben | not enrolled | enrolled |
| cleo | not enrolled | not enrolled |

Does every student have a course? No: cleo is a counterexample. Is one course taken by everyone? No: cleo takes none. Does one student take every course? Yes: ana is a witness. The lia/max/noa model above is a second original example: it shows another combination of truth values without changing the quantifiers’ meaning.

## Independent practice

The six pilot exercises cover counting pairs, reading the predicate, two translations, an evaluation and the effect of the order of quantifiers.

Interactive practice is available with an account when sign-in is configured. The “Practise” button opens exercises with feedback and attempts saved in your private progress.

## Takeaway

In our two-column model, a table is a set of pairs and its relation is described by a predicate on a product. In nested quantifiers, the order changes the meaning: translate carefully, then evaluate against the data.

Original project text and examples. Coverage follows PDF pages 71–81 in the repository’s course map; the PDF dataset is identified; the second model and explanations are original.
