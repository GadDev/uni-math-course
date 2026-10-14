---
lessonId: L05
locale: en
version: 1
status: pilot
title: "Implication: a promise with one failure case"
summary: "Read A ⇒ B, distinguish necessary and sufficient conditions, and find a counterexample."
minutes: 12
objectives: [L05-O01, L05-O02, L05-O03, L05-O04, L05-O05, L05-O06]
prerequisites: [L01, L02]
sourcePages: [20, 21, 22, 23]
---
# Implication: a promise with one failure case

## Your objective

By the end of this lesson, you can read $A \Rightarrow B$, complete its truth table, distinguish “necessary” from “sufficient”, and recognise a counterexample.

**Prerequisites:** an assertion has a truth value; AND, inclusive OR and NOT. L01 and L02 refer to the planned programme, not lessons already available.

## A precise promise

Imagine this rule: “If a card is red, it has a stamp.”

- $A$: “the card is red”.
- $B$: “the card has a stamp”.

The rule fails for a **red card without a stamp**. It says nothing about blue cards: a blue card can have a stamp or not.

Mathematical implication expresses a relationship between truth values. By itself, it does not describe a cause or a sequence of events.

## Definition and reading

Read $A \Rightarrow B$ as “A implies B” or “if A, then B”. $A$ is the antecedent; $B$ is the consequent.

You can evaluate implication using:
$$
A \Rightarrow B \equiv \neg A \lor B.
$$

Here $\equiv$ means that both expressions have the same value under **every** assignment. The symbol $\Rightarrow$ forms the implication.

| A | B | ¬A | A ⇒ B |
| --- | --- | --- | --- |
| 0 | 0 | 1 | 1 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 |
| 1 | 1 | 0 | 1 |

In this table, 0 means false and 1 means true.

## Guided example: the blue card without a stamp

1. The card is not red: $A = 0$.
2. It has no stamp: $B = 0$.
3. Therefore $\neg A = 1$.
4. Evaluate $\neg A \lor B = 1 \lor 0 = 1$.

This card does not contradict the rule. **It also does not prove that every red card has a stamp.** An observation and a general proof are different things.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## Necessary and sufficient

Saying $A \Rightarrow B$ is equivalent to saying:

- A is **sufficient** for B: A guarantees B.
- B is **necessary** for A: without B, A cannot be true.

For a natural number, “being greater than 10” is sufficient for “being greater than 5”. Being greater than 5 is necessary for being greater than 10, but it is not sufficient: 8 is greater than 5 and not greater than 10.

**Prerequisite refresher:** this course uses $\mathbb{N} = \{0,1,2,\ldots\}$. This supports the example; it does not replace a future lesson on number sets.

## Negating an implication

Negating the rule describes its failure:
$$
\neg(A \Rightarrow B) \equiv A \land \neg B.
$$

For the cards: “the card is red AND it has no stamp”.

You can verify this another way:
$$
\neg(\neg A \lor B) \equiv A \land \neg B.
$$

Negating each operand to write $\neg A \Rightarrow \neg B$ does not negate the whole implication. For example, when $A=B=1$, this new implication is true while $\neg(A \Rightarrow B)$ is false.

## Watch the trap

A false condition cannot provide a counterexample to $A \Rightarrow B$. You need **A true and B false**. Similarly, A implies B does not guarantee that B implies A.

## Independent practice

The six pilot exercises cover the false case, the truth table, necessary/sufficient conditions, negation, a natural-language rule and a numerical counterexample.

Interactive practice requires sign-in. It will be added after accounts and server grading are integrated.

## Takeaway

Implication is a promise with one failure case: **the condition holds, but the promised result does not**. Look for that case to refute an implication.

Original project text and examples. Coverage follows PDF pages 20–23 in the repository’s course map; no professor-authored exercise is reproduced.
