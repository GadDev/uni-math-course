---
lessonId: L09
locale: en
version: 3
status: extended
title: "Sets and Russell’s paradox"
summary: "See why “any collection” is too naive a notion of set, follow Russell’s argument, and name the kinds of sets the course allows."
minutes: 14
objectives: [L09-O01, L09-O02, L09-O03, L09-O04, L09-O05, L09-O06]
prerequisites: [L01]
sourcePages: [37, 38, 39, 40]
---
# Sets and Russell’s paradox

## Your objective

By the end of this lesson, you can say what an informal set is, explain why “any collection” is too naive, follow Russell’s argument, and name the kinds of sets the course allows.

**Prerequisites:** L01 (assertions and truth values).

## A concrete example before generalising

In $S = \{2,4\}$, $2 \in S$ says that two is one of the listed objects. $\{2\} \subseteq S$ says that all objects of this small set belong to $S$. The two symbols ask different questions. Negation $\neg$ means NOT, as in L02.

## Sets as collections

Informally, a **set** is a collection of objects. It is a fundamental data structure: for example, the set of letters of the word “math”.

## Why “any collection” fails

Suppose every collection counts as a set. Let $E$ be the collection of all sets $x$ that are not elements of themselves, that is, sets such that $x \notin x$. The symbol $\notin$ reads “is not an element of”.

Is $E$ an element of $E$?

## Russell’s argument

- If $E \in E$, then $E$ satisfies the defining condition, which says $E \notin E$. This is a contradiction.
- If $E \notin E$, then $E$ satisfies the defining condition, so $E \in E$. This is a contradiction.

Either way we reach a contradiction. This is **Russell’s paradox**.

## Guided example: the argument with truth values

Let $v$ be the truth value of the assertion “$E \in E$”. By the defining condition, “$E \in E$” holds exactly when $E \notin E$ does, so $v = \neg v$.

No value $v \in \{0, 1\}$ satisfies this equation, because $\neg 0 = 1$ and $\neg 1 = 0$. The situation is the liar sentence of L01, written in the language of sets.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Which collections are sets

To avoid paradoxes, the course accepts only certain collections as sets:

- sets of numbers;
- sets defined by enumeration;
- sets defined by comprehension;
- sets built from the previous ones.

Comprehension draws its elements from a set that is already given, as in $\{a \in X \mid P(a)\}$ (L13). The collection $E$ draws from no given set, so it is not accepted. This is the course’s working restriction; the full axioms of set theory are beyond this course.

In the comprehension notation in this section, $X$ is an already known set and $P(a)$ is a test that keeps or rejects each element. L10 to L13 develop these tools. Russell’s argument is a deeper exploration: first remember why an arbitrary description cannot always create a set.

## Independent practice

The selected exercises cover the informal notion of set, why it is naive, Russell’s collection, the contradiction, the accepted kinds of sets and why comprehension over a given set is safer.

Interactive practice is available with an account when sign-in is configured. The “Practise” button opens exercises with feedback and attempts saved in your private progress.

## Takeaway

“Any collection is a set” leads to Russell’s contradiction. The course keeps only sets of numbers, enumerations, comprehensions over a given set and sets built from them.

Original project text and examples. Coverage follows PDF pages 37–40 in the repository’s course map; no professor-authored text is reproduced.
