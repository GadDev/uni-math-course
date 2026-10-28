---
lessonId: L41
locale: en
version: 1
status: extended
title: "The natural logarithm"
summary: "Use the inverse of the exponential, its rules and derivative."
minutes: 36
objectives: [L41-O01, L41-O02, L41-O03, L41-O04, L41-O05, L41-O06]
prerequisites: [L37, L39, L40]
sourcePages: [16, 17]
---
# The natural logarithm

*Original course explanations based on* Bruno Teheux, Mathématiques Générales — Fonctions d’une variable réelle, BINFO-FCE 2025–2026, pages 16, 17.

## Goals and prerequisites

The natural logarithm answers: which exponent of e produces a given strictly positive value?

$$\ln:(0,+\infty)\longrightarrow\mathbb R$$

You should know the exponential's graph and rules.

## Two inverse functions

The logarithm undoes exponentiation; the exponential undoes a logarithm when the logarithm's input is positive.

$$\ln(e^y)=y\qquad(y\in\mathbb R)$$

$$e^{\ln(x)}=x\qquad(x>0)$$

Domains are essential: the exponential is defined everywhere; the logarithm accepts positive inputs only.

## Values worth remembering

Start with simple exponential values, then reverse the relationship.

$$e^0=1\ \Longrightarrow\ \ln(1)=0$$

$$e^1=e\ \Longrightarrow\ \ln(e)=1$$

$$e^{-2}=\frac1{e^2}\ \Longrightarrow\ \ln(e^{-2})=-2$$

A logarithm can be negative; its argument must remain positive.

## Calculation rules

Turning a product into a sum lets us rewrite expressions without numerical evaluation.

$$\ln(xy)=\ln(x)+\ln(y)\qquad(x>0,y>0)$$

$$\ln(x^a)=a\ln(x)\qquad(x>0)$$

There is no corresponding term-by-term rule for a sum inside a logarithm.

## Differentiating the logarithm

The PDF gives a simple derivative rule. For a composition, the chain rule contributes the inner derivative.

$$D\ln(x)=\frac1x\qquad(x>0)$$

$$D\ln(2x+1)=\frac{2}{2x+1}\qquad(x>-\tfrac12)$$

Always state the inequality ensuring the argument is positive.

## Reading the graph

The graph on PDF page 17 crosses the horizontal axis at x equal to one, grows slowly and decreases without bound as x approaches zero from the right.

$$\lim_{x\to0^+}\ln(x)=-\infty$$

$$\ln(1)=0$$

This limit explains the curve's shape beyond the source slide's drawing.

## Example and domain traps

Solving a logarithmic equation often means applying the exponential to both sides. Verify that the solution is positive.

$$\ln(x)=2\quad\Longleftrightarrow\quad x=e^2$$

Never evaluate ln(0) or the logarithm of a negative number over the real numbers.

