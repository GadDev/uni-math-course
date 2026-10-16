---
lessonId: L33
locale: en
version: 1
status: extended
title: "Rasterisation and Bresenham’s idea"
summary: "Sample a segment and trace an integer algorithm in an explicit octant."
minutes: 22
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

## A continuous line, discrete pixels

Rasterisation selects pixels to represent a continuous segment. If $|m|\le1$, traversing integer columns and rounding height to the nearest pixel is natural. For rounding examples in this lesson, halfway ties round toward the greater integer. This explicit choice may differ from a programming language’s default.

## Guided example: a steep slope

From $(0,0)$ to $(2,6)$, slope is $3$. One pixel per column produces only heights $0,3,6$, leaving jumps. Traversing rows instead uses $x=y/3$ for each integer vertical coordinate from $0$ to $6$. For a vertical segment, fixing the horizontal coordinate and traversing rows avoids division by zero horizontal difference.

## A deliberately limited octant

To understand Bresenham, return to an upward vertical axis. The segment runs from $(0,0)$ to $(\Delta x,\Delta y)$, with integers $\Delta x>0$ and $0\le\Delta y\le\Delta x$. From $(x,y)$, candidates are $E=(x+1,y)$ and $NE=(x+1,y+1)$. The midpoint is $(x+1,y+1/2)$. Set $D=2\Delta y(x+1)-2\Delta x y-\Delta x$. If $D\ge0$, choose NE; otherwise choose E. Here a tie chooses NE.

## Guided example: integer additions

Initially, $D=2\Delta y-\Delta x$. After E, add $2\Delta y$; after NE, add $2\Delta y-2\Delta x$. For $\Delta x=5$ and $\Delta y=2$, successive decisions before each step are $-1,3,-3,1,-5$. Pixels are $(0,0),(1,0),(2,1),(3,1),(4,2),(5,2)$. After initialisation, only integer additions and comparisons are needed.

## Direction and special cases

Including both endpoints gives $\Delta x+1$ pixels in this octant. An increasing loop does not automatically handle a right-to-left segment: reorder endpoints or adapt the step. Steep slopes, negative slopes and a downward screen axis require transformations or a general version. A segment reduced to a point is displayed directly. The restricted algorithm presented here does not claim to cover every octant.

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
