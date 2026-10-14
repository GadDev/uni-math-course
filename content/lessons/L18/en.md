---
lessonId: L18
locale: en
version: 1
status: extended
title: "SQL as comprehension: EXISTS and NOT EXISTS"
summary: "Read a SELECT query as a set defined by comprehension, match AND, OR, NOT with ∧, ∨, ¬, and match EXISTS and NOT EXISTS with ∃ and ¬∃."
minutes: 14
objectives: [L18-O01, L18-O02, L18-O03, L18-O04, L18-O05, L18-O06]
prerequisites: [L16, L17]
sourcePages: [82, 83, 84, 85, 86, 87, 88, 89]
---
# SQL as comprehension: EXISTS and NOT EXISTS

## Your objective

By the end of this lesson, you can read a `SELECT` query as a set defined by comprehension, match `AND`, `OR`, `NOT` with $\land$, $\lor$, $\neg$, and match `EXISTS` and `NOT EXISTS` with $\exists$ and $\neg\exists$.

**Prerequisites:** L16 (bounded quantifiers) and L17 (tables as sets of pairs).

## The toy database

Use the table `Student(id)` with the ids lia, max and noa, and the table `Enrolled(student, course)` with the rows (lia, art), (max, bio) and (noa, bio). As in L17, each table is a set of rows without duplicates; SQL’s duplicates and missing values are outside this lesson.

## A query is a comprehension

```sql
SELECT e.student FROM Enrolled e WHERE e.course = 'bio';
```

- `e` is a variable that ranges over the rows of `Enrolled`.
- The condition after `WHERE` is a predicate on `e`; `AND`, `OR` and `NOT` play the roles of $\land$, $\lor$ and $\neg$.
- The result is a table.

With $E = \{\text{lia}, \text{max}, \text{noa}\}$ and $I(x, c)$ meaning “$x$ is enrolled in $c$”, this query reads
$$
\{x \in E \mid I(x, \text{bio})\} = \{\text{max}, \text{noa}\}.
$$

## EXISTS is a quantifier

A condition can contain a subquery. `EXISTS (...)` is true exactly when the subquery returns at least one row. `EXISTS` corresponds to $\exists$ and `NOT EXISTS` to $\neg\exists$.

## Guided example: students not enrolled in art

```sql
SELECT s.id FROM Student s
WHERE NOT EXISTS (SELECT * FROM Enrolled e
                  WHERE e.student = s.id AND e.course = 'art');
```

1. For each student `s`, the subquery looks for an enrolment of `s` in art.
2. `NOT EXISTS` keeps the students for whom there is none.
3. Only lia is enrolled in art, so the result is $\{x \in E \mid \neg I(x, \text{art})\} = \{\text{max}, \text{noa}\}$.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## SQL has no ∀

SQL has no universal quantifier. This is not a problem, because
$$
\forall x\ P(x) \equiv \neg\exists x\ \neg P(x).
$$
To express “every …”, write `NOT EXISTS` of a counterexample.

## Trap: reading the query, not the data

A query’s result depends on the tables. The same query run on different rows gives a different set, so always evaluate against the data you were given.

## Independent practice

The six pilot exercises cover reading a query, the predicate, the connectives, `EXISTS`, a `NOT EXISTS` query and the replacement of $\forall$.

Interactive practice requires sign-in. It will be added after accounts and server grading are integrated.

## Takeaway

A `SELECT … WHERE` query is a set defined by comprehension. `EXISTS` is $\exists$, `NOT EXISTS` is $\neg\exists$, and $\forall$ is written with $\neg\exists\neg$.

Original project text and examples. Coverage follows PDF pages 82–89 in the repository’s course map; the example data and queries are original.
