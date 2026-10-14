---
lessonId: L19
locale: en
version: 1
status: extended
title: "Python all and any: sortedness, duplicates and maximum"
summary: "Translate statements about a list into ∀ and ∃ and into Python’s all and any, and handle the edge cases of short lists."
minutes: 14
objectives: [L19-O01, L19-O02, L19-O03, L19-O04, L19-O05, L19-O06]
prerequisites: [L16]
sourcePages: [90, 91, 92, 93, 94]
---
# Python all and any: sortedness, duplicates and maximum

## Your objective

By the end of this lesson, you can translate “the list is sorted”, “the list has a duplicate” and “the list contains its maximum” into $\forall$ and $\exists$, write them with Python’s `all` and `any`, and state the edge cases.

**Prerequisites:** L16 (bounded quantifiers).

## A list and its indices

Let `t` be a Python list of length $n$, with indices $0, \ldots, n - 1$. The element at index `i` is `t[i]`.

## Sorted and not sorted

“`t` is sorted” (non-decreasing) is translated by
$$
\forall i \in \{0, \ldots, n - 2\}\ t[i] \leq t[i+1],
$$
which Python writes as
```python
all(t[i] <= t[i+1] for i in range(n-1))
```
“`t` is not sorted” is its negation:
$$
\exists i \in \{0, \ldots, n - 2\}\ t[i] > t[i+1],
$$
written
```python
any(t[i] > t[i+1] for i in range(n-1))
```
The indices stop at $n - 2$ because each comparison uses `t[i+1]`: there are $n - 1$ comparisons, which is `range(n-1)`.

## Guided example: a list of three numbers

Take `t = [1, 3, 2]`, so $n = 3$ and the indices of comparison are $0$ and $1$.

1. `t[0] <= t[1]` is `1 <= 3`, true.
2. `t[1] <= t[2]` is `3 <= 2`, false.
3. So `all(...)` is `False` and `any(t[i] > t[i+1] ...)` is `True`: the list is not sorted, with witness $i = 1$.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Duplicates and maximum

These are original translations; the course source only poses them as exercises.

- “`t` contains a duplicate”: $\exists i \in \{0, \ldots, n-1\}\ \exists j \in \{0, \ldots, n-1\}\ (i < j \land t[i] = t[j])$.
- “`t` contains its maximum”: $\exists i \in \{0, \ldots, n-1\}\ \forall j \in \{0, \ldots, n-1\}\ t[j] \leq t[i]$.

The condition $i < j$ matters: without it, every element is equal to itself.

## Edge cases

For an empty list, the range is empty. Then `all(...)` over an empty range is `True` and `any(...)` over an empty range is `False`. A list of length $0$ or $1$ is therefore sorted. The statement “contains its maximum” needs a finite, nonempty list of numbers: an empty list has no maximum, and the translation correctly gives false.

## Independent practice

The six pilot exercises cover the `all` translation, the negation, the number of comparisons, duplicates, the maximum and the empty list.

Interactive practice requires sign-in. It will be added after accounts and server grading are integrated.

## Takeaway

$\forall$ over indices is `all`, $\exists$ over indices is `any`. Check the index range, and remember what `all` and `any` return on an empty range.

Original project text and examples. Coverage follows PDF pages 90–94 in the repository’s course map; the translations of duplicates and maximum are original solutions to the source’s open exercise.
