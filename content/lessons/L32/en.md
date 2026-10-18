---
lessonId: L32
locale: en
version: 2
status: extended
title: "From coordinates to pixels"
summary: "Build and invert a transformation to a screen with a downward vertical axis."
minutes: 25
objectives: [L32-O01, L32-O02, L32-O03, L32-O04, L32-O05, L32-O06]
prerequisites: [L25, L27, L29]
sourcePages: [53, 54, 55]
---
# From coordinates to pixels

## Objectives and prerequisites

- Distinguish axis conventions.
- Transform a point.
- Invert the transformation.
- Transform differences and slopes.
- Choose scale and origin.
- Analyse rounding and visibility.

Prerequisites: L25, L27, L29. Domains and restrictions stated below are part of every rule.

<span id="pdf-53" class="source-topic-marker"></span>

## The screen is a grid of pixels

A **pixel** is one cell of an image. In the PDF’s convention, columns $u$ increase rightwards and rows $v$ downwards; the first column and row are numbered zero.

**PDF example, page 53.** Pixel $(5,2)$ lies in the sixth column and third row. The order remains horizontal then vertical, but vertical coordinates increase downwards. In an $8\times6$ image, columns range from $0$ to $7$ and rows from $0$ to $5$: pixel $(8,6)$ is outside the image.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/pixels.svg" alt="Grid with eight columns and six rows, origin at top left, cell 5,2 marked with a cross." width="440" height="360" loading="lazy" />
<figcaption>Indices start at zero; v increases downwards.</figcaption>
</figure>

## Two coordinate systems

In the mathematical plane, $y$ increases upward. On the screen considered here, the origin is at the top left, $u$ increases rightward and $v$ downward. Continuous coordinates may be real; pixel indices are integers. An image of width $W$ and height $H$ has indices $0\le u<W$ and $0\le v<H$.

<p class="source-next"><a href="/en/lessons/L32/#pdf-54">Next in the PDF : From coordinates to screen: centring →</a></p>

<span id="pdf-54" class="source-topic-marker"></span>

## From mathematical coordinates to the screen: centring

**PDF, page 54.** In an $800\times600$ pixel window, choose the centre as origin: $(u_0,v_0)=(400,300)$. At one pixel per unit, $u=400+x$ and $v=300-y$. The minus is necessary: a higher point must have a smaller row number.

**Additional example.** $(x,y)=(20,10)$ becomes $(u,v)=(420,290)$. Mathematical origin $(0,0)$ becomes $(400,300)$, rather than the upper-left corner.

## Translation, scale and sign

With $s_x>0$ and $s_y>0$ pixels per unit, use $u=u_0+s_xx$ and $v=v_0-s_yy$. The mathematical origin is displayed at $(u_0,v_0)$. The minus sign reverses the vertical direction. To preserve shapes and angles, choose $s_x=s_y$; otherwise a circle appears elliptical.

<p class="source-next"><a href="/en/lessons/L32/#pdf-55">Next in the PDF : Changing units →</a></p>

<span id="pdf-55" class="source-topic-marker"></span>

## Changing units: 50 pixels per unit

**PDF example, page 55.** Keep the centre and choose $50$ pixels per unit: $u=400+50x$ and $v=300-50y$. For $(2,1)$: $u=400+100=500$ and $v=300-50=250$.

**Additional example.** For $(-3,-2)$, obtain $(250,400)$. To invert, undo the centre shift and divide by the scale: $x=(u-400)/50$ and $y=(300-v)/50$. Returning from $(500,250)$ recovers $(2,1)$. This inversion concerns continuous coordinates before rounding to pixels.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/screen.svg" alt="Screen window with origin at top left, centre at 400,300 and mathematical point 2,1 displayed at 500,250." width="440" height="360" loading="lazy" />
<figcaption>Moving up in the plane decreases screen coordinate v.</figcaption>
</figure>

## Guided example: forward and inverse

Take $u=300+40x$ and $v=200-40y$. Point $(-2,3)$ becomes $(220,80)$. To invert, use $x=(u-300)/40$ and $y=(200-v)/40$. Pixel $(380,240)$ therefore corresponds to $(2,-1)$ before any rounding uncertainty.

## Guided example: transforming a line

With the same scales, line $y=2x+1$ becomes $v=760-2u$. Indeed, substitute $x=(u-300)/40$ into $v=200-40(2x+1)$. The screen slope is negative: a stroke rising rightward has decreasing screen vertical coordinates. In general, slope becomes $-(s_y/s_x)m$.

## Round after calculating

To display a point, calculate continuous coordinates, then apply an explicit rounding rule. Rounding to nearest limits error to half a pixel per coordinate; halfway ties need a convention. Several real points may map to one pixel: rounding is not invertible. An out-of-image coordinate remains out of bounds even when its algebraic transformation is correct.

<p class="source-next"><a href="/en/lessons/L33/#pdf-56">Next in the PDF : Rasterising: which pixels? →</a></p>

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
