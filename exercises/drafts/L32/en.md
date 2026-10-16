---
lessonId: L32
locale: en
version: 1
status: extended
title: "From coordinates to pixels"
summary: "Build and invert a transformation to a screen with a downward vertical axis."
minutes: 17
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

## Two coordinate systems

In the mathematical plane, $y$ increases upward. On the screen considered here, the origin is at the top left, $u$ increases rightward and $v$ downward. Continuous coordinates may be real; pixel indices are integers. An image of width $W$ and height $H$ has indices $0\le u<W$ and $0\le v<H$.

## Translation, scale and sign

With $s_x>0$ and $s_y>0$ pixels per unit, use $u=u_0+s_xx$ and $v=v_0-s_yy$. The mathematical origin is displayed at $(u_0,v_0)$. The minus sign reverses the vertical direction. To preserve shapes and angles, choose $s_x=s_y$; otherwise a circle appears elliptical.

## Guided example: forward and inverse

Take $u=300+40x$ and $v=200-40y$. Point $(-2,3)$ becomes $(220,80)$. To invert, use $x=(u-300)/40$ and $y=(200-v)/40$. Pixel $(380,240)$ therefore corresponds to $(2,-1)$ before any rounding uncertainty.

## Guided example: transforming a line

With the same scales, line $y=2x+1$ becomes $v=760-2u$. Indeed, substitute $x=(u-300)/40$ into $v=200-40(2x+1)$. The screen slope is negative: a stroke rising rightward has decreasing screen vertical coordinates. In general, slope becomes $-(s_y/s_x)m$.

## Round after calculating

To display a point, calculate continuous coordinates, then apply an explicit rounding rule. Rounding to nearest limits error to half a pixel per coordinate; halfway ties need a convention. Several real points may map to one pixel: rounding is not invertible. An out-of-image coordinate remains out of bounds even when its algebraic transformation is correct.

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
