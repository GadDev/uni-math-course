---
lessonId: L42
locale: en
version: 1
status: extended
title: "Changing bases and comparing algorithms"
summary: "Connect exponentials, base-2 logarithms and algorithmic growth."
minutes: 38
objectives: [L42-O01, L42-O02, L42-O03, L42-O04, L42-O05, L42-O06]
prerequisites: [L39, L40, L41]
sourcePages: [18, 19]
---
# Changing bases and comparing algorithms

*Original course explanations based on* Bruno Teheux, Mathématiques Générales — Fonctions d’une variable réelle, BINFO-FCE 2025–2026, pages 18, 19.

## Goals and prerequisites

In computing, logarithms help describe how input size changes running time. First we need to change bases.

$$a^x=e^{x\ln(a)}\qquad(a>0)$$

Exponential and logarithm rules are the immediate prerequisites.

## Every positive base

The PDF's definition works for positive bases. Base one also defines a function, but it is constant and has no inverse logarithm.

$$1^x=1,\qquad D(a^x)=\ln(a)\,a^x$$

For bases above one the function grows; for bases strictly between zero and one it decreases.

## Logarithms to base a

The inverse requires a positive base different from one. Division by ln(a) explains why base one is excluded here.

$$\log_a(x)=\frac{\ln(x)}{\ln(a)}\qquad(x>0,\ a>0,\ a\ne1)$$

$$\log_2(8)=3\qquad\text{car}\qquad 2^3=8$$

Base two is common in computing because halving repeatedly shrinks a problem quickly.

## Understanding repeated halving

Imagine a search that halves the remaining set at each step. The logarithm counts the number of halvings.

$$2^k=n\quad\Longleftrightarrow\quad k=\log_2(n)$$

$$\log_2(64)=6$$

This illustrates a complexity idea; it does not claim every search algorithm always takes exactly this many steps.

## Differentiating and changing bases

Use the chain rule for a base-a exponential and the logarithm rule for its inverse.

$$D(2^x)=\ln(2)\,2^x$$

$$D\log_2(x)=\frac{1}{x\ln(2)}\qquad(x>0)$$

The factors ln(2) and its reciprocal differ: identify which function you are differentiating.

## Comparing complexity families

The chart on page 19 shows several families over one finite input range. It invites growth comparisons but does not turn a finite plot into a universal proof.

$$1,\quad\log_2(n),\quad\sqrt n,\quad n,\quad n\log_2(n),\quad 2^n,\quad n!$$

For large inputs, an exponential eventually outgrows polynomial functions; this is additional theory, not a proof derived from the plot alone.

## Final synthesis challenge

Compute costs for the same input, then justify their order. Exact values are more reliable than eyeballing a compressed plot.

$$n=8:\quad\log_2(n)=3,\quad n=8,\quad n\log_2(n)=24,\quad 2^n=256$$

Always check the logarithm's domain and units when a cost represents time or memory.

