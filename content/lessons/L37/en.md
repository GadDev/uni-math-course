---
lessonId: L37
locale: en
version: 1
status: extended
title: "Functions, domains and graphs"
summary: "Understand functions, determine domains and read points from graphs."
minutes: 32
objectives: [L37-O01, L37-O02, L37-O03, L37-O04, L37-O05, L37-O06]
prerequisites: [L23, L27]
sourcePages: [2, 3, 4]
---
# Functions, domains and graphs

*Original course explanations based on* Bruno Teheux, Mathématiques Générales — Fonctions d’une variable réelle, BINFO-FCE 2025–2026, pages 2, 3, 4.

## Goals and prerequisites

Recognise a function as a rule assigning one output to each allowed input. Find a domain, compute an output and interpret a graph point.

$$f:A\longrightarrow\mathbb R,\qquad x\longmapsto f(x)$$

Revisit fractions and coordinates in L23 and L27 first.

## What is a function?

A function assigns a real number to every input in its domain. Different inputs may share an output; one input cannot have two outputs.

$$f(x)=x^3+2x+3$$

For this polynomial, any real input is allowed.

## The domain matters

To find the domain of a rational function, first identify when its denominator is zero. Those inputs stay excluded even if an algebraic simplification seems possible.

$$r(x)=\frac{x^2-2x+2}{x(x-2)},\qquad D_r=\mathbb R\setminus\{0,2\}$$

A function may only be defined on part of the real line. Saying “all reals” before checking denominators is a frequent mistake.

## Worked example: evaluating a function

Substitute the input for every occurrence of the variable, keep parentheses and evaluate in the correct order.

$$f(0)=0^3+2(0)+3=3$$

$$f(-1)=(-1)^3+2(-1)+3=0$$

$$f(2)=2^3+2(2)+3=15$$

Check the domain first, then the value. Do not confuse f(2), an output, with 2, an input.

## From formulas to graphs

The graph is the set of all input–output pairs. In Cartesian coordinates, the horizontal coordinate is the input and the vertical coordinate is its output.

$$G_f=\{(x,f(x))\mid x\in A\}\subseteq\mathbb R^2$$

$$f(0)=3\quad\Longleftrightarrow\quad (0,3)\in G_f$$

The plot on PDF page 4 illustrates this polynomial. A function graph cannot assign two vertical coordinates to the same horizontal coordinate.

## Two common traps

First trap: substituting an input that makes the denominator zero. Second trap: reversing the coordinate order when reading a point.

$$r(0)\text{ n’est pas défini},\qquad r(2)\text{ n’est pas défini}$$

When in doubt, list forbidden inputs before calculating.

## Quick check

Evaluate the polynomial at another input and explain why the rational function excludes two points.

$$f(1)=1+2+3=6$$

$$x(x-2)=0\quad\Longleftrightarrow\quad x\in\{0,2\}$$

You are ready when you can move confidently between calculations and graph points.

