---
lessonId: L08
locale: en
version: 4
status: extended
title: "Functional completeness: every table from OR and NOT"
summary: "Turn any truth table into a formula that uses only ∨ and ¬, by describing each true row and applying De Morgan to remove ∧."
minutes: 20
objectives: [L08-O01, L08-O02, L08-O03, L08-O04, L08-O05, L08-O06]
prerequisites: [L03, L04]
sourcePages: [32, 33, 34, 35]
---
# Functional completeness: every table from OR and NOT

In this lesson, the number of variables satisfies $n \geq 1$. We use only variables, OR and NOT; formulas without variables are outside the theorem.

## Your objective

By the end of this lesson, you can read a truth table as a function, describe each true row by a conjunction, combine those with $\lor$, and remove $\land$ using De Morgan, so that the formula uses only $\lor$ and $\neg$.

**Prerequisites:** L03 (truth tables) and L04 (Boolean laws, De Morgan).

## Decoding the theorem

Think of a machine: it receives a row of zeros and ones, then returns a zero or a one. $f$ names this rule. $\{0,1\}$ is the set of the two values; $\{0,1\}^n$ means all choices of $n$ inputs. The arrow $\to$ indicates “inputs to result”. The theorem says that any such rule can be built with OR and NOT.

Start with two inputs and four rows. One true row supplies one condition; several true rows supply several possibilities joined by OR. If every row is false, $\neg(x \lor \neg x)$ indeed gives zero for both values of $x$.

## The problem

A function $f$ gives a value $0$ or $1$ for each assignment of $x$, $y$, $z$. The question is whether some assertion has exactly $f$ as its truth table. The answer is yes, and the construction below always works.

For two inputs, exclusive OR gives us a first table to construct. Each true row has a description that equals $1$ on that row alone.

| x | y | f(x,y) | Description of the true row |
| --- | --- | --- | --- |
| 0 | 0 | 0 | none |
| 0 | 1 | 1 | $\neg x\land y$ |
| 1 | 0 | 1 | $x\land\neg y$ |
| 1 | 1 | 0 | none |

Try row $11$ in each description: both give $0$. Labels and values, without colour coding, connect the table to the following construction.

## Step 1: one conjunction per true row

A **literal** is a letter or its negation. For a row where $f = 1$, write the conjunction of literals that is true on that row and on no other. For the row $x = 0$, $y = 1$, $z = 1$, it is $\neg x \land y \land z$.

## Step 2: join the true rows with OR

If $f$ is $1$ on several rows, take the disjunction of their conjunctions. The result is $1$ on exactly the rows where $f$ is $1$.

## Step 3: remove AND with De Morgan

For any $C$ and $D$,
$$
C \land D \equiv \neg(\neg C \lor \neg D).
$$
Applying this repeatedly leaves a formula that uses only $\lor$ and $\neg$.

## Guided example: exclusive or

Let $f(x, y)$ be $1$ exactly on the rows $01$ and $10$.

1. Row $01$ gives $\neg x \land y$. Row $10$ gives $x \land \neg y$.
2. Join them: $(\neg x \land y) \lor (x \land \neg y)$.
3. Remove $\land$: $\neg x \land y \equiv \neg(x \lor \neg y)$ and $x \land \neg y \equiv \neg(\neg x \lor y)$.

So $f$ is the table of $\neg(x \lor \neg y) \lor \neg(\neg x \lor y)$, which uses only $\lor$ and $\neg$.

This guided work, whose solution is visible, is not an independent response for mastery evidence.

## The theorem

Every function $f : \{0,1\}^n \to \{0,1\}$ is the truth table of an assertion in $n$ propositional variables that uses only $\lor$ and $\neg$.

If $f$ is $1$ on no row, there is no true row to describe; take $\neg(x \lor \neg x)$, which is always false.

## Watch out: both connectives are needed

Using $\lor$ alone on a letter $x$ gives only $x$ again, because $x \lor x \equiv x$. So $\lor$ alone cannot build $\neg x$. The negation is essential.

NOT alone never combines two independent inputs: a formula built from one variable by negations remains that variable or its negation. It therefore cannot express $A \land B$. OR alone gives a disjunction of variables, which cannot express $\neg A$.

## Returning to the table on pages 32 to 35

In the PDF’s table, the output is one exactly for $010$ and $110$, in x, y, z order. Each row gives one branch: $(\neg x \land y \land \neg z) \lor (x \land y \land \neg z)$. In both cases, y is one and z is zero; x is unrestricted. A shorter formula is therefore $y \land \neg z$, then $\neg(\neg y \lor z)$ using only OR and NOT. This simplification and explanation are original.

## Independent practice

The selected exercises cover reading the true rows, a conjunction for one row, joining rows, removing $\land$, the statement of the theorem and building a three-variable table.

Interactive practice requires sign-in. Availability depends on this lesson’s selected version and release status.

## Takeaway

Describe each true row, join the descriptions with $\lor$, and replace $\land$ using De Morgan. Every truth table is reachable with $\lor$ and $\neg$ alone.

Original project text and examples. Coverage follows PDF pages 32–35 in the repository’s course map; the true rows of the source example are explained with an original simplification.
