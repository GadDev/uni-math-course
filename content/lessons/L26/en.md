---
lessonId: L26
locale: en
version: 3
status: extended
title: "Sigma notation, sums and means"
summary: "Read sigma notation, calculate a mean and understand centred deviations."
minutes: 28
objectives: [L26-O01, L26-O02, L26-O03, L26-O04, L26-O05, L26-O06]
prerequisites: [L21, L23]
sourcePages: [25, 26]
---
# Sigma notation, sums and means

## Objectives and prerequisites

- Expand an indexed sum.
- Count terms.
- Use linearity.
- Calculate a mean.
- Centre data.
- Analyse the limitations of a sum.

Prerequisites: L21, L23. Domains and restrictions stated below are part of every rule.

<span id="pdf-25" class="source-topic-marker"></span>

## Sigma notation (Σ): reading the symbol

The uppercase Greek letter sigma, $\sum$, means **add the indicated terms**. It is neither a new multiplication nor an unknown to solve for. In $\sum_{i=1}^n a_i$:

| Piece | How to read it |
| --- | --- |
| $i$ | The index: it counts positions. |
| $i=1$ | Start at position 1. |
| $n$ | Finish at position n, included. |
| $a_i$ | The number to add at position i. |

Read “sum of a subscript i, for i from one to n”. If $a_1=2$, $a_2=5$ and $a_3=8$, then $\sum_{i=1}^3a_i=2+5+8=15$. The small $i$ in $a_i$ is a **subscript**, not an exponent: $a_2$ means the second number, not the square of $a$.

**The PDF’s three properties, pages 25–26.** For lists of length $n\ge1$ and a real constant $c$:

1. Termwise addition: $\sum_{i=1}^n(a_i+b_i)=\sum_{i=1}^n a_i+\sum_{i=1}^n b_i$.
2. Constant factor: $\sum_{i=1}^n ca_i=c\sum_{i=1}^n a_i$.
3. Repeated constant: $\sum_{i=1}^n c=nc$.

**Additional examples.** For lists $(2,5)$ and $(1,3)$, the first rule gives $(2+1)+(5+3)=(2+5)+(1+3)=11$. The second gives $3\cdot2+3\cdot5=3(2+5)=21$. The third gives $4+4+4=3\cdot4=12$. These rules follow from addition and distributivity; they require no mysterious new recipe.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/sigma.svg" alt="Index values 1, 2 and 3 select a1, a2 and a3, then add 2, 5 and 8." width="440" height="360" loading="lazy" />
<figcaption>The index runs through a list; each value is added once.</figcaption>
</figure>

## Sigma is a repetition instruction

For a finite sequence of reals, $\sum_{i=1}^n a_i=a_1+\cdots+a_n$. The index is a local variable: renaming it leaves the sum unchanged when every occurrence changes together. From $i=r$ to $i=s$ with $r\le s$, there are $s-r+1$ terms. Means here always use an integer count $n\ge1$ of observations.

## Guided example: expand before simplifying

The sum $\sum_{i=2}^4(2i-1)$ is $3+5+7=15$. There are three terms, not four. A check uses linearity: $2\sum_{i=2}^4i-\sum_{i=2}^41=2(2+3+4)-3=15$. The constant term repeats once for every index value.

<p class="source-next"><a href="/en/lessons/L26/#pdf-26">Next in the PDF : Mean and centred deviations →</a></p>

<span id="pdf-26" class="source-topic-marker"></span>

## Mean and deviations: why the sum is zero

The bar in $\bar x$, read “x bar”, denotes the mean. Add the $n$ observations, then share the total across $n$: $\bar x=\frac{x_1+\cdots+x_n}{n}$. For $2,5,8$, calculate $(2+5+8)/3=5$. Deviations $-3,0,3$ balance around this value.

The PDF’s proof expands as follows: $\sum_{i=1}^n(x_i-\bar x)=\sum_{i=1}^n x_i-\sum_{i=1}^n\bar x=n\bar x-n\bar x=0$. In the second sum, $\bar x$ is constant: it appears exactly $n$ times. Later, $\sum_i$ abbreviates summing over all observations, from $1$ to $n$.

**Additional grouped example.** Two people have mean $10$; eight others have mean $20$. The overall mean is $(2\cdot10+8\cdot20)/(2+8)=18$, not $15$. Weighting means counting each group’s size. If both means were $10$, the result would be $10$ despite different sizes: equal sizes guarantee the shortcut without being necessary in every particular case.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/mean.svg" alt="Observations 2, 5 and 8 lie on a number line; deviations minus 3 and plus 3 balance around 5." width="440" height="360" loading="lazy" />
<figcaption>Mean 5 balances the signed deviations.</figcaption>
</figure>

## Means and units

The mean has the same unit as the observations. An empty sample has no mean defined by this formula.

## Guided example: deviations from the mean

For data $1,4,7$, the mean is $4$ and deviations are $-3,0,3$. Their sum is zero. This does not mean every deviation is zero. Spread-out data can have deviations that cancel exactly.

## Sum of squares and square of the sum

For $1$ and $-1$, the sum is zero but the sum of squares is $2$. The square of a sum contains cross terms; it is not obtained by squaring every term separately. This distinction will be essential when measuring prediction errors without allowing their signs to cancel.

<p class="source-next"><a href="/en/lessons/L27/#pdf-28">Next in the PDF : The Cartesian frame →</a></p>

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
