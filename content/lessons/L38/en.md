---
lessonId: L38
locale: en
version: 1
status: extended
title: "From secants to derivatives"
summary: "Connect average speed, rates of change, limits and tangent slopes."
minutes: 45
objectives: [L38-O01, L38-O02, L38-O03, L38-O04, L38-O05, L38-O06]
prerequisites: [L27, L37]
sourcePages: [5, 6, 7, 8, 9, 10, 11, 12]
---
# From secants to derivatives

*Original course explanations based on* Bruno Teheux, Mathématiques Générales — Fonctions d’une variable réelle, BINFO-FCE 2025–2026, pages 5, 6, 7, 8, 9, 10, 11, 12.

## Goals and prerequisites

Interpret rates of change, calculate secant slopes and understand the derivative as a limit.

$$\frac{f(x_0+h)-f(x_0)}{h},\qquad h\ne0$$

You will use line slopes and functions from the earlier chapters.

## Why begin with speed?

On a journey, we can measure distance travelled over an interval; the next question is speed at one precise instant.

$$v_{\mathrm{moy}}=\frac{x(t_0+h)-x(t_0)}{h}$$

Decreasing h brings average speed closer to instantaneous speed, provided the limit exists.

## Definition of the derivative

A derivative is the finite limit of difference quotients. The quotient at h equal to zero is undefined; only its limit can exist.

$$Df(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}$$

The PDF defines differentiability on an open interval; the quotients use nonzero h values sufficiently close to zero.

## Running example: a parabola

Keep P fixed and move Q along the curve. The line PQ is a secant as long as the horizontal coordinates differ.

$$f(x)=\frac{x^2}{2},\qquad P=(1,\tfrac12)$$

$$Q=(1+h,f(1+h)),\qquad \frac{f(1+h)-f(1)}{h}=1+\frac h2$$

Expand the square before cancelling terms, and keep the condition that h is nonzero.

## From numbers to the tangent

The PDF shows five successive positions of Q. As h decreases, the computed slopes approach 1.

$$\begin{array}{c|ccccc}h&2&1&0.5&0.25&0.1\\\hline\text{pente}&2&1.5&1.25&1.125&1.05\end{array}$$

$$Df(1)=\lim_{h\to0}(1+\tfrac h2)=1$$

The tangent at P therefore has slope 1. Q approaches P, but the quotient itself is not evaluated at h equal to zero.

## Equation of the tangent

A line with slope m passing through P satisfies the point–slope form studied with straight lines.

$$y-f(x_0)=Df(x_0)(x-x_0)$$

$$y-\tfrac12=x-1\quad\Longleftrightarrow\quad y=x-\tfrac12$$

Check by substituting P's x-coordinate into the tangent equation: its y-coordinate must result.

## Approach from either side

A derivative requires the same limit for positive and negative h, not only for positive values.

$$h=-0.2\quad\Longrightarrow\quad\text{pente}=0.9$$

$$\lim_{h\to0^-}(1+\tfrac h2)=\lim_{h\to0^+}(1+\tfrac h2)=1$$

In the interactive “From secant to tangent” prototype, move Q to either side of P to verify this idea.

