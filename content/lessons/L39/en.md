---
lessonId: L39
locale: en
version: 1
status: extended
title: "Computing derivatives"
summary: "Master constant, power, sum, product, quotient and chain rules."
minutes: 40
objectives: [L39-O01, L39-O02, L39-O03, L39-O04, L39-O05, L39-O06]
prerequisites: [L23, L37, L38]
sourcePages: [13]
---
# Computing derivatives

*Original course explanations based on* Bruno Teheux, Mathématiques Générales — Fonctions d’une variable réelle, BINFO-FCE 2025–2026, pages 13.

## Goals and prerequisites

Limits are fundamental, but computing every derivative from the definition takes time. We use rules while respecting the domain.

$$D(c)=0,\qquad D(x^n)=nx^{n-1}$$

Review powers and tangent slopes first.

## Sums and constant multiples

Differentiate each term separately. A constant coefficient remains in front of the derivative.

$$D(f+g)=Df+Dg,\qquad D(cf)=cDf$$

$$D(3x^2+2x+5)=6x+2$$

The derivative of 5 is zero, not 5. Differentiate the polynomial term by term.

## The product rule

The derivative of a product is generally not the product of the derivatives. There are two terms.

$$D(fg)=(Df)g+f(Dg)$$

$$D\bigl(x^2(x+1)\bigr)=2x(x+1)+x^2=3x^2+2x$$

Independent check: expand first, then differentiate the resulting polynomial.

## The quotient rule

The denominator must be nonzero. Note the subtraction order: derivative of the numerator times denominator, minus numerator times derivative of denominator.

$$D\left(\frac fg\right)=\frac{(Df)g-f(Dg)}{g^2},\qquad g\ne0$$

$$D\left(\frac{x}{x+1}\right)=\frac{(x+1)-x}{(x+1)^2}=\frac{1}{(x+1)^2}$$

Keep the original restriction: x can never equal negative one here.

## The chain rule

A composite function has one function inside another. Differentiate the outside, then multiply by the derivative of the inside.

$$D(f\circ g)(x)=Df(g(x))\,Dg(x)$$

$$D\bigl((2x+1)^3\bigr)=3(2x+1)^2\cdot2=6(2x+1)^2$$

The factor 2 comes from differentiating the inner expression.

## Choosing the right rule

First identify the expression's outermost operation: sum, product, quotient or composition. Apply that rule, then simplify without dropping restrictions.

$$D\left(\frac{x^2}{x^2+1}\right)=\frac{2x(x^2+1)-x^2(2x)}{(x^2+1)^2}=\frac{2x}{(x^2+1)^2}$$

You can test a simple x-value in the unsimplified and simplified answers.

## Common mistakes and a check

Watch for power exponents, the product rule and forgotten inner derivatives. Algebraic simplification can provide a second method.

$$D\bigl((x+1)(x^2-x+1)\bigr)=D(x^3+1)=3x^2$$

If the methods disagree, return to the first step where their expressions diverge.

