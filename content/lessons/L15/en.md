---
lessonId: L15
locale: en
version: 2
status: extended
title: "Set operations, relative complements and algebra"
summary: "Compute intersections, unions and complements relative to a named set, and connect the laws of set algebra to the Boolean laws."
minutes: 24
objectives: [L15-O01, L15-O02, L15-O03, L15-O04, L15-O05, L15-O06]
prerequisites: [L04, L10]
sourcePages: [59, 60, 61, 62, 63, 64, 65]
---
# Set operations, relative complements and algebra

## Your objective

By the end of this lesson, you can compute $A \cap B$, $A \cup B$ and a complement relative to a named set, apply the laws of set algebra, and connect them to the Boolean laws.

**Prerequisites:** L04 (Boolean laws) and L10 (sets and inclusion).

## See the operations and recover the Boolean laws

In the diagrams, the rectangle is the ambient set U and the circles are A and B. Hatched regions indicate the result; the descriptions also state it without depending on a colour.

![Intersection: only the shared region of circles A and B inside U.](/diagrams/sets-intersection.svg)

![Union: every region inside A or B, including their shared region.](/diagrams/sets-union.svg)

![Complement of A in U: every region of rectangle U outside A.](/diagrams/sets-complement.svg)

| Condition on an element x of U | Connective | Operation |
| --- | --- | --- |
| in A and in B | AND | intersection |
| in A or in B, possibly both | inclusive OR | union |
| not in A | NOT | complement in U |

Take $U = \{1,2,3,4\}$, $A = \{1,2\}$ and $B = \{2,3\}$. Elements outside their union form $\{4\}$. The complements of A and B are $\{3,4\}$ and $\{1,4\}$ respectively; their intersection is again $\{4\}$.

To see why this works for every element, fix $x \in U$. Saying it is outside the union means it is in neither A nor B: this is De Morgan applied to the two membership assertions. The finite calculation illustrates the law; this argument for an arbitrary element explains the general law. The same laws let you expand an intersection with a union or factor a union of intersections, as in L04.

## Three operations

Let $A$, $B$ and $C$ be sets with $A \subseteq C$.

- $A \cap B$ is the set of elements that are in $A$ **and** in $B$.
- $A \cup B$ is the set of elements that are in $A$ **or** in $B$.
- $\overline{A}^{\,C}$ is the set of elements of $C$ that are not in $A$.

The complement always needs its ambient set $C$: it means “not in $A$, among the elements of $C$”.

## Guided example: computing

Let $A = \{1, 2, 4\}$, $B = \{2, 4, 6, 8\}$ and $C = \{1, 2, 3, 4, 5, 6, 7, 8\}$.

1. $A \cap B = \{2, 4\}$.
2. $A \cup B = \{1, 2, 4, 6, 8\}$.
3. $\overline{A \cup B}^{\,C} = \{3, 5, 7\}$: the elements of $C$ that are not in $A \cup B$.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Algebra of sets

The operations satisfy identities that come from the Boolean laws. For sets $A$, $B$, $C$:

- commutativity: $A \cap B = B \cap A$ and $A \cup B = B \cup A$;
- associativity: $A \cap (B \cap C) = (A \cap B) \cap C$ and $(A \cup B) \cup C = A \cup (B \cup C)$;
- distributivity: $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$ and $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$;
- De Morgan, when $A, B \subseteq C$: $\overline{A \cup B}^{\,C} = \overline{A}^{\,C} \cap \overline{B}^{\,C}$ and $\overline{A \cap B}^{\,C} = \overline{A}^{\,C} \cup \overline{B}^{\,C}$.

## The link with logic

Membership turns each set operation into a connective: $x \in A \cap B$ means “$x \in A$ and $x \in B$”, $x \in A \cup B$ means “$x \in A$ or $x \in B$”, and $x \in \overline{A}^{\,C}$ means “$x \in C$ and not $x \in A$”. This is why the Boolean laws reappear.

## Trap: the missing ambient set

A complement means nothing until you name the set it is taken in. With $A = \{1, 2\}$, the complement is $\{3\}$ in $\{1, 2, 3\}$ but $\{3, 4\}$ in $\{1, 2, 3, 4\}$. De Morgan’s laws also require $A$ and $B$ to be inside $C$.

## Independent practice

The six pilot exercises cover the intersection, the union, a relative complement, De Morgan’s law for sets, the role of the ambient set and the link with connectives.

Interactive practice is available with an account when sign-in is configured. The “Practise” button opens exercises with feedback and attempts saved in your private progress.

## Takeaway

$\cap$ matches “and”, $\cup$ matches “or”, and a complement matches “not” relative to a named set $C$. The Boolean laws carry over to sets.

Original project text and examples. Coverage follows PDF pages 59–65 in the repository’s course map; no professor-authored text is reproduced.
