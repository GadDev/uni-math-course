---
lessonId: L24
locale: en
version: 2
status: extended
title: "Equations and inequalities"
summary: "Transform a condition without losing solutions or adding forbidden values."
minutes: 25
objectives: [L24-O01, L24-O02, L24-O03, L24-O04, L24-O05, L24-O06]
prerequisites: [L21, L22, L23]
sourcePages: [19, 20, 21, 22]
---
# Equations and inequalities

## Objectives and prerequisites

- Isolate an unknown.
- Solve with fractions.
- Reverse an inequality correctly.
- Write a solution set.
- Preserve zero cases and domains.
- Analyse a nonequivalent transformation.

Prerequisites: L21, L22, L23. Domains and restrictions stated below are part of every rule.

<span id="pdf-19" class="source-topic-marker"></span>

## Solving an equation: preserve the same solutions

An unknown is a value to find. The two **sides** are the expressions on either side of the equals sign. Solving means finding all solutions, rather than guessing one number. Here $\Leftrightarrow$ means “these equations have the same solutions on the stated domain”.

**PDF example, pages 19–20.** $3x+5=11\Leftrightarrow3x=6\Leftrightarrow x=2$. First subtract $5$ from both sides, then divide both by $3$. Check: $3\cdot2+5=11$.

The PDF’s trap is $x^2=x$. Checking the sign of $x$ is not the main issue when dividing by it: we must check it is **nonzero**. The correct transformation is $x^2-x=0\Leftrightarrow x(x-1)=0$; solutions are $0$ and $1$. A product is zero when at least one of its factors is zero.

## An equation describes a set

Solving a real equation means finding every value making it true. Adding the same real number to both sides or multiplying by a nonzero constant preserves solutions. Dividing by an expression involving the unknown needs an additional restriction. Equivalence must concern the same domain in both steps; a shorter formula is not automatically an equivalent condition.

## Guided example: isolate then check

For $x\in\mathbb{R}$, $4(x-1)+2=14$ gives $4x-2=14$, then $4x=16$ and $x=4$. Substituting into the statement gives $4(4-1)+2=14$. Substitution checks the candidate; reversible operations show that no other solution exists. These are distinct roles.

<p class="source-next"><a href="/en/lessons/L24/#pdf-21">Next in the PDF : Inequalities →</a></p>

<span id="pdf-21" class="source-topic-marker"></span>

## Inequalities: why the direction reverses

**PDF example, pages 21–22.** $-2x+4>0\Leftrightarrow-2x>-4\Leftrightarrow x<2$. The last step divides by $-2$, reversing the direction. On a number line, multiplication by a negative reverses order: $2<3$ but $-2>-3$.

Write the solution as $]-\infty;2[$. The open bracket at $2$ excludes $2$: the left side would be zero, whereas we require strictly greater than zero. Point $0$ works; point $3$ does not. An interval never includes infinity as an endpoint: infinity is not a real number.

**Additional example.** $3x-6\ge0\Leftrightarrow x\ge2$. This time the boundary is included, so the solution is $[2;+\infty[$.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/inequality.svg" alt="A ray pointing left with an open circle at 2 represents x less than 2." width="440" height="360" loading="lazy" />
<figcaption>The open circle excludes endpoint 2.</figcaption>
</figure>

## Inequalities and intervals

Adding a real number preserves order. Multiplying by a positive real also preserves it; multiplying by a negative real reverses it. Thus $-4x+3\le11$ is equivalent to $-4x\le8$, then $x\ge-2$. The set is $[-2;+\infty[$: the endpoint is included. We use this French interval notation in English too. A factor of unknown sign does not let us choose a direction without separating cases.

## Guided example: do not lose zero

The equation $x^2=3x$ over the reals becomes $x(x-3)=0$. Its solutions are $0$ and $3$. Dividing directly by $x$ would lose zero. A zero product has at least one zero factor. Conversely, squaring may add candidates: after a nonreversible step, check each candidate in the original equation.

## Domain before simplification

In $(x^2-4)/(x-2)=4$, the domain excludes $2$. Simplification gives $x+2=4$, whose only candidate is excluded: the solution set is empty. This is not an arithmetic mistake; it follows from the original restriction. Pay equal attention to strict or inclusive endpoints when the unknown must subsequently be an integer.

<p class="source-next"><a href="/en/lessons/L25/#pdf-23">Next in the PDF : Systems of two equations →</a></p>

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
