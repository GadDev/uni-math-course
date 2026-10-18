---
lessonId: L28
locale: en
version: 2
status: extended
title: "Cartesian equations and curves"
summary: "Connect an equation to its point set and preserve its solutions."
minutes: 28
objectives: [L28-O01, L28-O02, L28-O03, L28-O04, L28-O05, L28-O06]
prerequisites: [L24, L27]
sourcePages: [31, 32, 33, 34, 35]
---
# Cartesian equations and curves

## Objectives and prerequisites

- Test membership.
- Recognise a line.
- Recognise a circle.
- Recognise a parabola.
- Compare two equations.
- Detect a nonequivalent transformation.

Prerequisites: L24, L27. Domains and restrictions stated below are part of every rule.

<span id="pdf-31" class="source-topic-marker"></span>

## Cartesian equation: a test for every point

A Cartesian equation relates coordinates $x$ and $y$. Its curve consists of **all** points that pass the equality test. We can do this before knowing how to plot the entire curve.

**PDF example, pages 31–32.** For $y=2x+1$, testing $(1,3)$ gives $3=2\cdot1+1$: true, so the point lies on the curve. Testing $(2,4)$ gives $4=2\cdot2+1$: false, so it does not. Nearby point $(2,5)$ does lie on it.

**Additional example.** For $x^2+y^2=4$, point $(0,2)$ passes because $0^2+2^2=4$. Point $(0,1)$ fails. A plot illustrates the test, whereas substitution gives an exact check.

## An equation is a filter

A Cartesian equation describes all real points whose coordinates make it true. For $y=2x+1$, point $(1,3)$ lies on the curve because $3=2\cdot1+1$; $(1,4)$ does not. An equation can describe a line, a curve, several pieces, a single point or even no real point.

<p class="source-next"><a href="/en/lessons/L28/#pdf-33">Next in the PDF : A gallery of curves →</a></p>

<span id="pdf-33" class="source-topic-marker"></span>

## A gallery of curves: connect each formula to its drawing

The PDF’s four equations, pages 33–34, describe different shapes. Here a **parabola** is the curve of a squared relation; it can be rotated.

- $y=2x+1$: a straight line. Increasing $x$ by $1$ increases $y$ by $2$.
- $x^2+y^2=4$: a circle centred at $O$ with radius $2$, because distance to the origin is $\sqrt{x^2+y^2}=2$.
- $y=x^2$: an upward-opening parabola. Points $(-1,1)$ and $(1,1)$ show its symmetry.
- $x=y^2$: a right-opening parabola. Points $(1,-1)$ and $(1,1)$ show that one horizontal coordinate can have two vertical coordinates.

Thus a curve cannot always be described as $y=f(x)$. **Additional example:** $x=2$ is a vertical straight line even though its equation contains no $y$.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/gallery-line.svg" alt="Rising straight line with vertical intercept 1." width="440" height="360" loading="lazy" />
<figcaption>y = 2x + 1</figcaption>
</figure>

<figure class="teaching-figure">
<img src="/diagrams/droites/en/gallery-circle.svg" alt="Circle centred at zero with radius 2." width="440" height="360" loading="lazy" />
<figcaption>x² + y² = 4</figcaption>
</figure>

<figure class="teaching-figure">
<img src="/diagrams/droites/en/gallery-parabola.svg" alt="Upward-opening parabola." width="440" height="360" loading="lazy" />
<figcaption>y = x²</figcaption>
</figure>

<figure class="teaching-figure">
<img src="/diagrams/droites/en/gallery-sideways.svg" alt="Right-opening parabola." width="440" height="360" loading="lazy" />
<figcaption>x = y²</figcaption>
</figure>

## A gallery of shapes

A line has equation $ax+by=c$ with $(a,b)\ne(0,0)$. If $b=0$, it is vertical; isolating $y$ is not always possible. In an orthonormal system, $x^2+y^2=r^2$ with $r>0$ is a circle of radius $r$. Equations $y=x^2$ and $x=y^2$ describe differently oriented parabolas.

## Guided example: reading a circle

Equation $(x-2)^2+(y+1)^2=9$ describes points at distance $3$ from $(2,-1)$. Testing $(5,-1)$ gives $9+0=9$. The radius is the positive square root of the right side, not the right side itself. If the right side were negative, no pair of real coordinates would work.

<p class="source-next"><a href="/en/lessons/L28/#pdf-35">Next in the PDF : One curve, several equations →</a></p>

<span id="pdf-35" class="source-topic-marker"></span>

## One curve, several equations

**PDF example, page 35.** $y=2x+1\Leftrightarrow2x-y+1=0\Leftrightarrow4x-2y=-2$. Rearranging, then multiplying by $2$, preserves solutions: these forms describe exactly the same line.

Two tasks complement each other: **drawing** goes from an equation to points; **modelling** seeks an equation from points or a situation. The next lessons show both for a straight line. The following examples also explain why transformations such as multiplication by an unknown need extra care.

## Guided example: equivalence

Equations $2x+2y=6$ and $x+y=3$ have exactly the same points: division by the nonzero constant $2$ is reversible. However, multiplying $y=x$ by $x$ gives $xy=x^2$, which also holds at every point on line $x=0$. For example, $(0,2)$ satisfies the new equation but not the original.

## Squares and restrictions

Passing from $y=x$ to $y^2=x^2$ generally adds line $y=-x$. A one-way implication is insufficient to conclude that two equations describe the same curve. Before dividing by a variable expression, retain the case where it is zero. Before taking a root, specify the sign: $y=\sqrt{x}$ requires $x\ge0$ and $y\ge0$.

<p class="source-next"><a href="/en/lessons/L29/#pdf-37">Next in the PDF : Plotting a straight line →</a></p>

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
