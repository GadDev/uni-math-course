---
lessonId: L19
locale: en
version: 3
status: extended
title: "Python all and any: sortedness, duplicates and maximum"
summary: "Translate statements about a list into ∀ and ∃ and into Python’s all and any, and handle the edge cases of short lists."
minutes: 20
objectives: [L19-O01, L19-O02, L19-O03, L19-O04, L19-O05, L19-O06]
prerequisites: [L16]
sourcePages: [90, 91, 92, 93, 94]
---
# Python all and any: sortedness, duplicates and maximum

## Your objective

By the end of this lesson, you can translate “the list is sorted”, “the list has a duplicate” and “the list contains its maximum” into $\forall$ and $\exists$, write them with Python’s `all` and `any`, and state the edge cases.

**Prerequisites:** L16 (bounded quantifiers).

## Read the indices before the formula

For `t = [1, 3, 2]`, here is where the values sit:

| index i | 0 | 1 | 2 |
| --- | --- | --- | --- |
| t[i] | 1 | 3 | 2 |

The first index is zero. `range(n-1)` produces the starts of adjacent pairs without including its stop bound. `for i in ...` traverses these starts; `all` requires every test to be true and `any` requires at least one. J contains all positions and K only those with a successor. For lists of zero or one element, K is empty: also interpret the exercise notation $\{0,\ldots,n-2\}$ as this domain of valid starts, never as negative indices to traverse.

Revisit the three objectives separately: sortedness compares neighbours, duplicate detection compares two distinct positions and maximum search compares a candidate against all values. A maximum can occur more than once.

## A list and its indices

Let `t` be a finite Python list of length $n = \mathrm{len}(t)$, containing comparable real numbers without NaN. Comparisons follow a total order; complex and incomparable values are excluded. Valid indices form $J = \{i \in \mathbb{Z} \mid 0 \leq i < n\}$; adjacent-pair start indices form $K = \{i \in J \mid i+1 < n\}$. Both sets are empty when $n = 0$. The element at index `i` is `t[i]`.

## Sorted and not sorted

“`t` is sorted” (non-decreasing) is translated by
$$
\forall i \in K\ t[i] \leq t[i+1],
$$
which Python writes as
```python
all(t[i] <= t[i+1] for i in range(n-1))
```
“`t` is not sorted” is its negation:
$$
\exists i \in K\ t[i] > t[i+1],
$$
written
```python
any(t[i] > t[i+1] for i in range(n-1))
```
There are $\max(n-1, 0)$ adjacent pairs. For $n \geq 1$, their start indices run from $0$ to $n-2$; for the empty list, no index qualifies. `range(n-1)` enumerates exactly these starts, including `range(-1)`, which is empty.

## Guided example: a list of three numbers

Take `t = [1, 3, 2]`, so $n = 3$ and the indices of comparison are $0$ and $1$.

1. `t[0] <= t[1]` is `1 <= 3`, true.
2. `t[1] <= t[2]` is `3 <= 2`, false.
3. So `all(...)` is `False` and `any(t[i] > t[i+1] ...)` is `True`: the list is not sorted, with witness $i = 1$.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Duplicates and maximum

These are original translations; the course source only poses them as exercises.

- “`t` contains a duplicate”: $\exists i \in J\ \exists j \in J\ (i < j \land t[i] = t[j])$.
- “`t` contains its maximum”: $\exists i \in J\ \forall j \in J\ t[j] \leq t[i]$.

The condition $i < j$ matters: without it, every element is equal to itself.

With these index domains, the Python translations are:

```python
any(t[i] == t[j] for i in range(n) for j in range(i+1, n))
any(all(t[j] <= t[i] for j in range(n)) for i in range(n))
```

The first searches two distinct positions with equal values; the second searches a position whose value is at least every other value.

## Edge cases

For an empty list, the range is empty. Then `all(...)` over an empty range is `True` and `any(...)` over an empty range is `False`. A list of length $0$ or $1$ is therefore sorted. The statement “contains its maximum” needs a finite, nonempty list of numbers: an empty list has no maximum, and the translation correctly gives false.

## Independent practice

The six pilot exercises cover the `all` translation, the negation, the number of comparisons, duplicates, the maximum and the empty list.

Interactive practice requires sign-in. Availability depends on this lesson’s selected version and release status.

## Takeaway

$\forall$ over indices is `all`, $\exists$ over indices is `any`. Check the index range, and remember what `all` and `any` return on an empty range.

Original project text and examples. Coverage follows PDF pages 90–94 in the repository’s course map; the translations of duplicates and maximum are original solutions to the source’s open exercise.
