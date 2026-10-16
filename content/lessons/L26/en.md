---
lessonId: L26
locale: en
version: 1
status: extended
title: "Sums, means and centring"
summary: "Read sigma notation, calculate a mean and understand centred deviations."
minutes: 15
objectives: [L26-O01, L26-O02, L26-O03, L26-O04, L26-O05, L26-O06]
prerequisites: [L21, L23]
sourcePages: [25, 26]
---
# Sums, means and centring

## Objectives and prerequisites

- Expand an indexed sum.
- Count terms.
- Use linearity.
- Calculate a mean.
- Centre data.
- Analyse the limitations of a sum.

Prerequisites: L21, L23. Domains and restrictions stated below are part of every rule.

## Sigma is a repetition instruction

For a finite sequence of reals, $\sum_{i=1}^n a_i=a_1+\cdots+a_n$. The index is a local variable: renaming it leaves the sum unchanged when every occurrence changes together. From $i=r$ to $i=s$ with $r\le s$, there are $s-r+1$ terms. Means here always use an integer count $n\ge1$ of observations.

## Guided example: expand before simplifying

The sum $\sum_{i=2}^4(2i-1)$ is $3+5+7=15$. There are three terms, not four. A check uses linearity: $2\sum_{i=2}^4i-\sum_{i=2}^41=2(2+3+4)-3=15$. The constant term repeats once for every index value.

## Means and units

The mean is $\bar x=(1/n)\sum_{i=1}^n x_i$. It has the same unit as the observations. For values $2,5,8$, it is $5$. Each observation contributes once; averaging group means without weights is valid only when group sizes agree. An empty sample has no mean defined by this formula.

## Guided example: deviations from the mean

For data $1,4,7$, the mean is $4$ and deviations are $-3,0,3$. Their sum is zero. More generally, $\sum_i(x_i-\bar x)=\sum_i x_i-n\bar x=0$. This does not mean every deviation is zero. Spread-out data can have deviations that cancel exactly.

## Sum of squares and square of the sum

For $1$ and $-1$, the sum is zero but the sum of squares is $2$. The square of a sum contains cross terms; it is not obtained by squaring every term separately. This distinction will be essential when measuring prediction errors without allowing their signs to cancel.

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
