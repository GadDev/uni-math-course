---
lessonId: L06
locale: en
version: 1
status: extended
title: "Converse, contrapositive and everyday language"
summary: "Write the converse and contrapositive of an implication, know which one is equivalent to it, and avoid reading “if” as “only if” in everyday language."
minutes: 12
objectives: [L06-O01, L06-O02, L06-O03, L06-O04, L06-O05, L06-O06]
prerequisites: [L05]
sourcePages: [24, 25, 26, 27, 28, 29]
---
# Converse, contrapositive and everyday language

## Your objective

By the end of this lesson, you can write the converse and the contrapositive of $A \Rightarrow B$, say which of them is equivalent to it, and avoid reading “if” as “only if” in everyday language.

**Prerequisites:** L05, where $A \Rightarrow B$ and its truth table are introduced.

## Converse and contrapositive

For an implication $A \Rightarrow B$:

- its **converse** is $B \Rightarrow A$;
- its **contrapositive** is $\neg B \Rightarrow \neg A$.

The converse swaps the two sides. The contrapositive swaps them and negates both.

## The contrapositive is equivalent

Every implication is semantically equivalent to its contrapositive:
$$
(A \Rightarrow B) \equiv (\neg B \Rightarrow \neg A).
$$

| A | B | A ⇒ B | ¬B ⇒ ¬A | B ⇒ A |
| --- | --- | --- | --- | --- |
| 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

The columns for $A \Rightarrow B$ and its contrapositive agree on every row. The converse differs on rows $01$ and $10$, so an implication and its converse are **not** equivalent. This explanation is original project work.

## Guided example: divisible by 4

Let $n$ be a natural number. Let $A$ be “$n$ is divisible by 4” and $B$ be “$n$ is even”.

1. $A \Rightarrow B$ is true: every multiple of 4 is a multiple of 2.
2. The converse $B \Rightarrow A$ says “if $n$ is even, then $n$ is divisible by 4”. It is false: $n = 2$ is even and not divisible by 4.
3. The contrapositive $\neg B \Rightarrow \neg A$ says “if $n$ is odd, then $n$ is not divisible by 4”. It is true, as it must be.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Trap: “if” in everyday language

A manager says: “If you finish the report, you get a day off.” An employee gets no day off. By the contrapositive, the report was not finished, and this deduction is valid.

But the manager probably meant something stronger: a day off **only** for people who finished the report. That is $B \Rightarrow A$, where $A$ is “you finish the report” and $B$ is “you get a day off”. The sentence actually spoken, $A \Rightarrow B$, says nothing about people who did not finish.

To say what you mean, write the implication in the direction you intend, then check its converse and its contrapositive.

## Independent practice

The six pilot exercises cover the converse, the contrapositive, which statements are equivalent, a truth table for the converse, a valid deduction from a rule and the reading of an everyday sentence.

Interactive practice requires sign-in. It will be added after accounts and server grading are integrated.

## Takeaway

An implication is equivalent to its contrapositive, never to its converse in general. In everyday language, check whether “if” was meant as “only if”.

Original project text and examples. Coverage follows PDF pages 24–29 in the repository’s course map; the source’s example sentences and proof prompt are not reproduced.
