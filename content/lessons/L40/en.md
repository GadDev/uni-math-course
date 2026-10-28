---
lessonId: L40
locale: en
version: 1
status: extended
title: "The exponential function"
summary: "Understand e to the x, its graph and its growth properties."
minutes: 30
objectives: [L40-O01, L40-O02, L40-O03, L40-O04, L40-O05, L40-O06]
prerequisites: [L38, L39]
sourcePages: [14, 15]
---
# The exponential function

*Original course explanations based on* Bruno Teheux, Mathématiques Générales — Fonctions d’une variable réelle, BINFO-FCE 2025–2026, pages 14, 15.

## Goals and prerequisites

The exponential function is a central growth model. It has a remarkable property: its derivative is itself.

$$D(e^x)=e^x$$

Derivatives and the chain rule are needed here.

## Definition and initial condition

The PDF characterises this function as the unique solution of the stated differential equation with its initial condition. We use this result without proving existence and uniqueness here.

$$Df=f,\qquad f(0)=1$$

$$f(x)=e^x$$

The condition at zero fixes the multiplicative factor and identifies this particular solution.

## Why does the graph rise?

On the graph on PDF page 15, the function remains positive and increases as x increases. Its slope is also its height.

$$e^0=1,\qquad e^x>0$$

$$D(e^x)=e^x>0$$

The curve approaches zero to the left without ever reaching zero.

## The fundamental identity

Addition in the exponent becomes multiplication of values. This simplifies many calculations without a calculator.

$$e^{x+y}=e^x e^y$$

$$e^2e^3=e^5,\qquad e^xe^{-x}=1$$

Do not replace a sum of exponentials with the exponential of a sum: these are different operations.

## Differentiating a composite exponential

For an exponential whose exponent depends on x, use the chain rule.

$$D(e^{g(x)})=g'(x)e^{g(x)}$$

$$D(e^{2x+1})=2e^{2x+1}$$

The factor 2 comes from the changing exponent, not the base e.

## A tangent-line example

At x equal to zero, the curve has height one and slope one.

$$f(0)=1,\qquad Df(0)=1$$

$$y=1+x$$

The tangent is a local approximation; it does not mean the whole exponential curve is a line.

## Summary and common traps

Check that your derivative retains the exponential and the derivative of the exponent. Read equality of function and derivative as growth proportional to the current value.

$$\frac{D(e^x)}{e^x}=1$$

This identity uses the exponential's positivity; the quotient is defined for all real x.

