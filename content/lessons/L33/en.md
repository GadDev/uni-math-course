---
lessonId: L33
locale: en
version: 2
status: extended
title: "Rasterisation and Bresenham’s idea"
summary: "Sample a segment and trace an integer algorithm in an explicit octant."
minutes: 35
objectives: [L33-O01, L33-O02, L33-O03, L33-O04, L33-O05, L33-O06]
prerequisites: [L31, L32]
sourcePages: [56, 57, 58, 59]
---
# Rasterisation and Bresenham’s idea

## Objectives and prerequisites

- Sample by column.
- Choose the traversal axis.
- Handle endpoints and direction.
- Interpret the midpoint test.
- Update an integer decision.
- Respect the algorithm’s limits.

Prerequisites: L31, L32. Domains and restrictions stated below are part of every rule.

<span id="pdf-56" class="source-topic-marker"></span>

## Rasterising: which pixels should be lit?

A mathematical line contains infinitely many points; a grid offers only cells. **Rasterising** means selecting pixels to represent the segment. For a left-to-right segment with moderate slope, the PDF visits columns and rounds the height.

**PDF example, pages 56–57, slope $m=0{,}4$.** Between $(0,0)$ and $(5,2)$, exact heights at columns $0,1,2,3,4,5$ are $0;0{,}4;0{,}8;1{,}2;1{,}6;2$. Nearest rounding selects $0,0,1,1,2,2$. The continuous line and pixel centres need not coincide: this is an intentional approximation.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/raster-gentle.svg" alt="Segment with slope 0.4 and selected pixels at heights 0,0,1,1,2,2." width="440" height="360" loading="lazy" />
<figcaption>One pixel is selected per column for this moderate slope.</figcaption>
</figure>

## A continuous line, discrete pixels

Rasterisation selects pixels to represent a continuous segment. If $|m|\le1$, traversing integer columns and rounding height to the nearest pixel is natural. For rounding examples in this lesson, halfway ties round toward the greater integer. This explicit choice may differ from a programming language’s default.

## Guided example: a steep slope

From $(0,0)$ to $(2,6)$, slope is $3$. One pixel per column produces only heights $0,3,6$, leaving jumps. Traversing rows instead uses $x=y/3$ for each integer vertical coordinate from $0$ to $6$. For a vertical segment, fixing the horizontal coordinate and traversing rows avoids division by zero horizontal difference.

<p class="source-next"><a href="/en/lessons/L33/#pdf-58">Next in the PDF : Fixing gaps →</a></p>

<span id="pdf-58" class="source-topic-marker"></span>

## Fixing gaps: traverse the appropriate axis

**PDF example, pages 57–58, slope $m=8/3$.** Between $(0,0)$ and $(3,8)$, one pixel per column leaves large vertical jumps. Visiting every row gives $x=(3/8)y$. For $y=0,1,2,3,4,5,6,7,8$, rounded horizontal coordinates are $0,0,1,1,2,2,2,3,3$ under this lesson’s rounding convention.

The practical rule is to traverse the axis with the greater displacement: columns if $|\Delta x|\ge|\Delta y|$, rows otherwise. Direction and vertical segments still need handling. This drawing uses an upward vertical axis to compare methods; on screen, apply the previous lesson’s downward convention.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/raster-holes.svg" alt="Segment from 0,0 to 3,8 with only four pixels, leaving gaps." width="440" height="360" loading="lazy" />
<figcaption>Column traversal: too few pixels.</figcaption>
</figure>

<figure class="teaching-figure">
<img src="/diagrams/droites/en/raster-fixed.svg" alt="The same segment with one pixel per row to avoid large jumps." width="440" height="360" loading="lazy" />
<figcaption>Row traversal: a better representation of the segment.</figcaption>
</figure>

<p class="source-next"><a href="/en/lessons/L33/#pdf-59">Next in the PDF : Bresenham’s idea →</a></p>

<span id="pdf-59" class="source-topic-marker"></span>

## Bresenham’s idea: choosing between E and NE

**PDF, page 59 — expanded explanation.** An **octant** is one of eight direction regions around a point. We study only segments that move right and rise no more steeply than the diagonal: $\Delta x>0$ and $0\le\Delta y\le\Delta x$. The vertical axis points upwards.

From the current pixel, two cells compete: E, to the right; NE, right and up. The midpoint between their centres selects the one nearest the line. If the line is above or on this midpoint, choose NE; otherwise E. A tie chooses NE in this course.

The integer test below avoids recalculating and rounding a height at every step. **Additional detailed example**, $\Delta x=5$ and $\Delta y=2$:

| Current pixel | Decision D before the step | Choice | Next pixel |
| --- | --- | --- | --- |
| $(0,0)$ | $-1$ | E | $(1,0)$ |
| $(1,0)$ | $3$ | NE | $(2,1)$ |
| $(2,1)$ | $-3$ | E | $(3,1)$ |
| $(3,1)$ | $1$ | NE | $(4,2)$ |
| $(4,2)$ | $-5$ | E | $(5,2)$ |

Read this table and the drawing first; the following formula explains how additions alone produce column D.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/bresenham.svg" alt="Current pixel, candidates E and NE, and midpoint M between their centres; the line passes above the midpoint." width="440" height="360" loading="lazy" />
<figcaption>Comparing the line with the midpoint selects between two pixels.</figcaption>
</figure>

## A deliberately limited octant

To understand Bresenham, return to an upward vertical axis. The segment runs from $(0,0)$ to $(\Delta x,\Delta y)$, with integers $\Delta x>0$ and $0\le\Delta y\le\Delta x$. From $(x,y)$, candidates are $E=(x+1,y)$ and $NE=(x+1,y+1)$. The midpoint is $(x+1,y+1/2)$. Set $D=2\Delta y(x+1)-2\Delta x y-\Delta x$. If $D\ge0$, choose NE; otherwise choose E. Here a tie chooses NE.

## Guided example: integer additions

Initially, $D=2\Delta y-\Delta x$. After E, add $2\Delta y$; after NE, add $2\Delta y-2\Delta x$. For $\Delta x=5$ and $\Delta y=2$, successive decisions before each step are $-1,3,-3,1,-5$. Pixels are $(0,0),(1,0),(2,1),(3,1),(4,2),(5,2)$. After initialisation, only integer additions and comparisons are needed.

## Direction and special cases

Including both endpoints gives $\Delta x+1$ pixels in this octant. An increasing loop does not automatically handle a right-to-left segment: reorder endpoints or adapt the step. Steep slopes, negative slopes and a downward screen axis require transformations or a general version. A segment reduced to a point is displayed directly. The restricted algorithm presented here does not claim to cover every octant.

<p class="source-next"><a href="/en/lessons/L31/#pdf-60">Next in the PDF : Filling a triangle →</a></p>

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
