---
lessonId: L27
locale: en
version: 2
status: extended
title: "Coordinates and distances"
summary: "Locate points and measure distance in an orthonormal coordinate system."
minutes: 25
objectives: [L27-O01, L27-O02, L27-O03, L27-O04, L27-O05, L27-O06]
prerequisites: [L23]
sourcePages: [28, 29, 30]
---
# Coordinates and distances

## Objectives and prerequisites

- Read coordinates.
- Calculate a displacement.
- Calculate a distance.
- Use a midpoint.
- Describe a locus.
- Check coordinate units.

Prerequisites: L23. Domains and restrictions stated below are part of every rule.

<span id="pdf-28" class="source-topic-marker"></span>

## The Cartesian frame: plotting and reading a point

A **coordinate frame** gives every point an address. Origin $O=(0,0)$ is where the axes cross. A tick marks one unit. First read horizontal coordinate $x$, then vertical coordinate $y$: their order matters.

**PDF points, page 28.** To plot $A=(3,2)$, start at the origin, move three units right, then two up. For $B=(2,3)$, the movements differ: the points are distinct. $C=(-2,1)$ is left and above; $D=(-1,-2)$ is left and below. The plane $\mathbb R^2$ is the set of all pairs of real numbers.

**Additional example.** Point $(0,-3)$ lies on the vertical axis because its horizontal displacement is zero. Point $(4,0)$ lies on the horizontal axis. To read a point from a drawing, project onto both axes before writing the pair.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/coordinates.svg" alt="Graduated axes with A at 3,2, B at 2,3, C at minus 2,1 and D at minus 1,minus 2." width="440" height="360" loading="lazy" />
<figcaption>Read the horizontal coordinate first, then the vertical coordinate.</figcaption>
</figure>

## Two ordered numbers

A point $A=(x_A,y_A)$ has a horizontal coordinate and a vertical coordinate. In the usual mathematical system, right is positive and up is positive. The point $(-2,3)$ is therefore two units left and three above the origin. Exchanging coordinates generally changes the point.

<p class="source-next"><a href="/en/lessons/L27/#pdf-29">Next in the PDF : Distance between two points →</a></p>

<span id="pdf-29" class="source-topic-marker"></span>

## Distance between points: seeing the right triangle

**PDF example, pages 29–30.** In an orthonormal frame, take $A=(1,1)$ and $B=(4,5)$. Here **orthonormal** means perpendicular axes with the same length unit. The horizontal displacement is $4-1=3$ and the vertical displacement is $5-1=4$.

Segment $AB$ is the hypotenuse of a right triangle. Pythagoras gives $d^2=3^2+4^2=25$, then $d=\sqrt{25}=5$. Choose the nonnegative root because this is a length.

The general formula is $d(A,B)=\sqrt{(x_B-x_A)^2+(y_B-y_A)^2}$. Symbol $\Delta$, read “delta”, denotes a change: $\Delta x=x_B-x_A$. **Additional example:** between $(2,-1)$ and $(2,4)$, $\Delta x=0$ and $\Delta y=5$; distance is $5$, as the vertical segment shows.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/distance.svg" alt="Right triangle between A at 1,1 and B at 4,5, with legs 3 and 4 and hypotenuse 5." width="440" height="360" loading="lazy" />
<figcaption>The distance formula applies Pythagoras to the two displacements.</figcaption>
</figure>

## Displacement and length

From $A$ to $B$, differences are $\Delta x=x_B-x_A$ and $\Delta y=y_B-y_A$. They may be negative. In an orthonormal system, axes are perpendicular and a unit represents the same length on both axes. Then $d(A,B)=\sqrt{(\Delta x)^2+(\Delta y)^2}$. A distance is nonnegative; it is zero exactly when the two points coincide.

## Guided example: a right triangle

For $A=(-1,2)$ and $B=(2,6)$, the displacement is $(3,4)$. Pythagoras gives $d(A,B)=\sqrt{9+16}=5$. In the reverse direction the displacement becomes $(-3,-4)$, but the distance remains $5$. Signs disappear upon squaring, not before calculating the differences.

## Guided example: midpoint and locus

The midpoint of $A=(0,2)$ and $B=(6,4)$ is $M=(3,3)$: average coordinates separately. Points at distance $2$ from the origin satisfy $x^2+y^2=4$; they form a circle. Those at distance at most $2$ form the disk $x^2+y^2\le4$. The boundary alone and the interior region are different objects.

## Watch the scales

Perpendicular axes alone are insufficient to apply the previous formula directly. If one horizontal unit represents $2$ metres and one vertical unit $1$ metre, a coordinate difference $(3,4)$ represents a physical displacement $(6,4)$ metres, of length $\sqrt{52}$ metres. Stretching a drawing on screen does not change mathematical coordinates, but its visual lengths may mislead.

<p class="source-next"><a href="/en/lessons/L28/#pdf-31">Next in the PDF : Cartesian equation →</a></p>

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
