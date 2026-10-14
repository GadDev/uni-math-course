---
lessonId: L20
locale: en
version: 1
status: extended
title: "Access control and the trap of “only”"
summary: "Translate access-control rules with ∀, ∃ and ⇒, avoid the reversal hidden in “only”, and negate nested statements."
minutes: 14
objectives: [L20-O01, L20-O02, L20-O03, L20-O04, L20-O05, L20-O06]
prerequisites: [L05, L16]
sourcePages: [95, 96]
---
# Access control and the trap of “only”

## Your objective

By the end of this lesson, you can translate “only managers can approve a request” into a formula, say why being a manager is necessary but not sufficient, and negate nested quantified statements.

**Prerequisites:** L05 (implication) and L16 (bounded quantifiers).

## A small model

Let $U$ be the set of users and $R$ the set of requests. Let $M(u)$ mean “$u$ is a manager” and $V(u, r)$ mean “$u$ can approve $r$”.

For the examples, take users ana, ben and cleo; only ana is a manager; the requests are r1 and r2; and the approvals are (ana, r1), (ana, r2) and (ben, r1).

## The trap of “only”

“Only managers can approve a request” says that anyone who can approve is a manager:
$$
\forall u \in U\ \forall r \in R\ (V(u, r) \Rightarrow M(u)).
$$
Being a manager is a **necessary** condition for approving, not a sufficient one. The sentence does not say that every manager can approve. Reading “only” the wrong way round gives $\forall u\ (M(u) \Rightarrow \ldots)$, which is a different statement.

## Guided example: evaluating on the model

1. The statement says: whoever approves is a manager.
2. In the model, ben approves r1 and is not a manager.
3. So $\forall u \in U\ \forall r \in R\ (V(u, r) \Rightarrow M(u))$ is false, with counterexample $(\text{ben}, \text{r1})$.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Two more translations and their negations

These examples are original solutions to the kind of exercise the source poses.

- “Every manager can approve all requests”: $\forall u \in U\ (M(u) \Rightarrow \forall r \in R\ V(u, r))$. Its negation is $\exists u \in U\ (M(u) \land \exists r \in R\ \neg V(u, r))$.
- “There is a request nobody can approve”: $\exists r \in R\ \forall u \in U\ \neg V(u, r)$. Its negation is $\forall r \in R\ \exists u \in U\ V(u, r)$.

## Independent practice

The six pilot exercises cover the translation of “only”, necessary versus sufficient, an evaluation, and two translations with a negation.

Interactive practice requires sign-in. It will be added after accounts and server grading are integrated.

## Takeaway

“Only $A$ can $B$” means $B \Rightarrow A$: $A$ is necessary for $B$. Translate with $\forall$ and $\Rightarrow$, and negate by swapping quantifiers and negating the predicate.

Original project text and examples. Coverage follows PDF pages 95–96 in the repository’s course map; the model, sentences and solutions are original and do not reproduce the source exercise.
