---
lessonId: L29
locale: en
version: 2
status: extended
title: "Slope and intercept"
summary: "Interpret affine line parameters and recognise boundary cases."
minutes: 30
objectives: [L29-O01, L29-O02, L29-O03, L29-O04, L29-O05, L29-O06]
prerequisites: [L28]
sourcePages: [37, 38, 39]
---
# Slope and intercept

## Objectives and prerequisites

- Identify slope.
- Identify the vertical intercept.
- Evaluate an affine function.
- Connect slope and change.
- Compare lines.
- Recognise limitations of slope-intercept form.

Prerequisites: L28. Domains and restrictions stated below are part of every rule.

<span id="pdf-37" class="source-topic-marker"></span>

## Plotting a line: from the table to the axes

**PDF example, page 37.** To plot $y=2x+1$, choose horizontal coordinates and calculate vertical coordinates.

| $x$ | $-1$ | $0$ | $1$ | $2$ |
| --- | --- | --- | --- | --- |
| $y=2x+1$ | $-1$ | $1$ | $3$ | $5$ |

For example, when $x=-1$, $y=2(-1)+1=-1$. Plot pairs $(-1,-1)$, $(0,1)$, $(1,3)$ and $(2,5)$. They are aligned. Two distinct points determine the line; a third helps detect a calculation error. Extend the line in both directions: the table does not list all its points.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/line-table.svg" alt="Line y equals 2x plus 1 passing through the table’s four points." width="440" height="360" loading="lazy" />
<figcaption>An x value produces a y value, then a point.</figcaption>
</figure>

## Two parameters, two roles

Every nonvertical line has form $y=mx+p$. Slope $m$ measures the change in $y$ for one additional unit of $x$. The vertical intercept $p$ is the value of $y$ when $x=0$. An affine function permits a nonzero constant; a linear function in the strict French mathematical sense has $p=0$.

## Guided example: read, then calculate

For $y=-2x+5$, slope is $-2$ and vertical intercept is $5$. At $x=3$, we obtain $y=-1$. If the horizontal coordinate increases by $4$, the vertical coordinate changes by $-8$, regardless of the starting coordinate. A negative slope indicates decrease.

<p class="source-next"><a href="/en/lessons/L29/#pdf-38">Next in the PDF : Slope and intercept →</a></p>

<span id="pdf-38" class="source-topic-marker"></span>

## Slope and intercept: reading m and p

In $y=mx+p$, $p$ is the vertical intercept, so the line passes through $(0,p)$. Slope is $m=\Delta y/\Delta x$ when $\Delta x\ne0$. Read “vertical change divided by horizontal change”. The drawing uses one horizontal step followed by one vertical step to make this ratio visible.

**PDF example, page 38.** A plan costs $10$ euros plus $2$ euros per GB: $y=2x+10$. Fixed cost is $p=10$ euros and slope is $m=2$ euros per GB. At $x=3$, price is $16$ euros. Four extra GB cost $8$ euros more: $\Delta y=2\Delta x$.

**Additional example.** For $y=-x+3$, moving one unit right moves one unit down; slope is $-1$. Zero slope gives a horizontal line; a vertical line has no slope defined by this quotient.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/slope.svg" alt="Line y equals 2x plus 1 with horizontal step 1, vertical step 2 and point 0,1." width="440" height="360" loading="lazy" />
<figcaption>Slope compares the two steps; the intercept locates the crossing of the vertical axis.</figcaption>
</figure>

## Plotting and shifting a line

To plot $y=(1/2)x+1$, place $(0,1)$, then move right by $2$ units and up by $1$ unit to obtain $(2,2)$. Two distinct points suffice. Changing only $p$ shifts the line vertically. Changing $m$ while keeping $p$ fixed retains point $(0,p)$ and changes the inclination.

## Guided example: units and conversion

A cost is modelled by $C(q)=3q+8$, where $q$ counts items and $C$ is in euros. Slope represents $3$ euros per item and the constant a fixed cost of $8$ euros. For $q=4$, cost is $20$ euros. The mathematical model exists over the reals, but this context permits only nonnegative integer quantities.

<p class="source-next"><a href="/en/lessons/L29/#pdf-39">Next in the PDF : The effects of m and p →</a></p>

<span id="pdf-39" class="source-topic-marker"></span>

## The effects of m and p: change one thing at a time

**PDF comparisons, page 39.** In $y=mx+1$, keep $p=1$ and choose $m=2,1,0,-1/2$: four lines pass through $(0,1)$. They rise, stay horizontal or fall according to the sign of $m$.

In $y=(7/5)x+p$, keep slope $7/5$ and choose $p=2,0,-2$: three parallel lines result. The shift is vertical; slope does not change. **Additional check:** lines $y=3x-1$ and $y=3x+4$ stay $5$ vertical units apart at every horizontal coordinate.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/vary-slope.svg" alt="Four lines of slopes 2, 1, 0 and minus one half passing through 0,1." width="440" height="360" loading="lazy" />
<figcaption>Same p, different slopes m.</figcaption>
</figure>

<figure class="teaching-figure">
<img src="/diagrams/droites/en/vary-intercept.svg" alt="Three parallel lines of slope seven fifths and intercepts 2, 0 and minus 2." width="440" height="360" loading="lazy" />
<figcaption>Same m, different intercepts p.</figcaption>
</figure>

## Horizontal and vertical lines

Two lines with equal slopes and different constants are distinct and parallel. Zero slope gives a horizontal line $y=p$. A vertical line $x=c$ is not of form $y=mx+p$: a single horizontal coordinate corresponds to multiple vertical coordinates. Its slope is undefined, not zero. For $ax+by=c$ with $b\ne0$, isolating $y$ gives $m=-a/b$ and $p=c/b$.

<p class="source-next"><a href="/en/lessons/L30/#pdf-40">Next in the PDF : A line through two points →</a></p>

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
