---
lessonId: L31
locale: en
version: 3
status: extended
title: "Half-planes and triangles"
summary: "Use the sign of an affine expression to describe and test a region."
minutes: 27
objectives: [L31-O01, L31-O02, L31-O03, L31-O04, L31-O05, L31-O06]
prerequisites: [L24, L28, L30]
sourcePages: [50]
---
# Half-planes and triangles

## Objectives and prerequisites

- Test a half-plane inequality.
- Distinguish included and excluded boundaries.
- Choose a side using a test point.
- Combine several constraints.
- Test membership in a triangle.
- Analyse sign and degeneracy.

Prerequisites: L24, L28, L30. Domains and restrictions stated below are part of every rule.

<span id="pdf-50" class="source-topic-marker"></span>

## The two half-planes: testing which side contains a point

A line splits the plane into two regions. **PDF example, page 50:** boundary $y=2x+1$. For $(0,3)$, compare $3$ with $2\cdot0+1=1$: $3>1$, so the point is above. For $(2,0)$, $0<2\cdot2+1=5$: the point is below.

Difference $f(x,y)=y-2x-1$ is respectively $2$ and $-5$. Its sign distinguishes the sides. A strict inequality excludes the boundary, drawn dashed; a non-strict inequality includes it, drawn solid. For a vertical line, speak of left and right instead.

In the PDF path, continue with [pixels](../L32/#pdf-52). The triangle below is a project supplement, absent from the revised PDF.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/halfplanes.svg" alt="Dashed line y equals 2x plus 1 separates a hatched upper region from an unhatched lower region." width="440" height="360" loading="lazy" />
<figcaption>Signs and hatching identify the sides without relying on colour alone.</figcaption>
</figure>

## A line separates the plane

For $f(x,y)=ax+by-c$ with $(a,b)\ne(0,0)$, the boundary is $f=0$. The two open half-planes are $f>0$ and $f<0$; closed versions include the boundary. The sign is constant on either side of the line. Saying “above” is not always appropriate: a vertical line separates left and right.

## Guided example: a test point

For $x+2y\le6$, the origin gives $0\le6$: retain the side containing the origin and the boundary. Point $(4,2)$ gives $8>6$ and is excluded. A boundary point cannot choose the side because its value is zero for both non-strict inequalities.

<p class="source-next"><a href="/en/lessons/L32/#pdf-52">Next in the PDF: The screen is a pixel grid →</a></p>

<span id="supplement-triangle" class="source-topic-marker"></span>

## Filling a triangle: combining three tests

**Project supplement, outside the revised PDF.** A nondegenerate triangle is the intersection of three half-planes: for each side, keep the one containing the opposite vertex. This turns a drawing into three algebraic tests.

Take $A=(0,0)$, $B=(4,0)$ and $C=(0,3)$. The horizontal and vertical sides give $y\ge0$ and $x\ge0$. The third side satisfies $3x+4y=12$, passing through $B$ and $C$. The origin gives $0\le12$: keep $3x+4y\le12$.

Point $(1,1)$ satisfies all three conditions, whereas $(3,2)$ fails the third because $3\cdot3+4\cdot2=17>12$. Here the boundary is included. To fill an image, test each pixel’s centre; these are the same half-plane ideas applied to a grid.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/triangle.svg" alt="Triangle with vertices 0,0, 4,0 and 0,3, an interior point at 1,1 and exterior point at 3,2." width="440" height="360" loading="lazy" />
<figcaption>A point must satisfy all three constraints at once.</figcaption>
</figure>

## Intersection of constraints

The region $x\ge0$, $y\ge0$, $x+y\le4$ is a closed triangle. A point belongs only if it passes all three tests. Checking just one constraint is insufficient. Vertices are $(0,0)$, $(4,0)$ and $(0,4)$; edges are included.

## Guided example: a general triangle

For three noncollinear vertices, each side defines a line. For each line, keep the closed half-plane containing the third vertex. Their intersection is exactly the filled triangle, including its boundary. With $A=(0,0)$, $B=(4,0)$ and $C=(0,3)$, constraints are $x\ge0$, $y\ge0$ and $3x+4y\le12$. Point $(1,1)$ satisfies all three.

## A same-side test

If $R$ is a reference point off the line, $P$ lies on the same side or boundary when $f(P)f(R)\ge0$. For the same strict side, use $>0$. Multiplying a boundary equation by a negative number preserves the line but reverses signs. Three collinear vertices do not define a triangle with nonempty interior; the test must detect this case before filling.

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
