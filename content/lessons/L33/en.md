---
lessonId: L33
locale: en
version: 3
status: extended
title: "Rasterisation and Bresenham’s idea"
summary: "Sample a segment and trace an integer algorithm in an explicit octant."
minutes: 45
objectives: [L33-O01, L33-O02, L33-O03, L33-O04, L33-O05, L33-O06]
prerequisites: [L31, L32]
sourcePages: [56, 57, 59, 60, 61, 62, 63]
---
# Rasterisation and Bresenham’s idea

The exercises also use uppercase $D=d$ for this same integer decision.

## Objectives and prerequisites

- Sample by column.
- Choose the traversal axis.
- Handle endpoints and direction.
- Interpret the midpoint test.
- Update an integer decision.
- Respect the algorithm’s limits.

Prerequisites: L31, L32. Domains and restrictions stated below are part of every rule.

<span id="pdf-56" class="source-topic-marker"></span>

## Rasterising: selecting pixels

A line contains infinitely many points; an image offers only cells. **Rasterising** means selecting pixels to represent a segment. For a moderate slope and a left-to-right traversal, calculate one height per column and round to the nearest pixel.

**PDF, pages 56–57.** For the segment from $(0,0)$ to $(5,2)$, slope is $m=2/5=0{,}4$. At columns $0,1,2,3,4,5$, ideal heights are $0;0{,}4;0{,}8;1{,}2;1{,}6;2$. Rounded heights are $0,0,1,1,2,2$. There is no halfway tie in this example.

**Additional convention for rounding examples:** halfway ties choose the greater integer. This differs from some `round` functions and from the Bresenham tie rule below.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/raster-gentle.svg" alt="Segment of slope 0.4, six pixels at heights 0,0,1,1,2,2." width="440" height="360" loading="lazy" />
<figcaption>One cell per column.</figcaption>
</figure>
<p class="source-next"><a href="/en/lessons/L33/#pdf-59">Next in the PDF: Fixing gaps →</a></p>

<span id="pdf-59" class="source-topic-marker"></span>

## Fixing gaps: traverse the appropriate axis

**PDF, pages 57 and 59.** From $(0,0)$ to $(3,8)$, slope is $m=8/3$. One pixel per column gives only four pixels, leaving large vertical jumps. Visiting rows gives $x=(3/8)y$. For $y=0,1,2,3,4,5,6,7,8$, rounded horizontal coordinates are $0,0,1,1,2,2,2,3,3$ under the preceding convention.

In the PDF’s screen notation, $v=v_1+m(u-u_1)$ becomes $u=u_1+(v-v_1)/m$ when $m\ne0$. Traverse rows if $|m|>1$. For a vertical segment, fix the column and traverse rows without calculating an infinite slope. Page 58 is a video-game illustration, not another algebraic step.

**Quick check.** Which cells represent $(4,1)$ to $(4,5)$? Keep column $4$ and rows $1,2,3,4,5$, including both endpoints.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/raster-holes.svg" alt="Four pixels leave large jumps." width="440" height="360" loading="lazy" />
<figcaption>Four pixels leave large jumps.</figcaption>
</figure>
<figure class="teaching-figure">
<img src="/diagrams/droites/en/raster-fixed.svg" alt="One pixel per row better represents the steep slope." width="440" height="360" loading="lazy" />
<figcaption>One pixel per row better represents the steep slope.</figcaption>
</figure>
<p class="source-next"><a href="/en/lessons/L33/#pdf-60">Next in the PDF: Bresenham’s idea →</a></p>

<span id="pdf-60" class="source-topic-marker"></span>

## Bresenham’s idea: E, NE and the midpoint

**PDF, page 60.** We now use Cartesian axes with the vertical axis pointing **upwards**. The segment runs from $(0,0)$ to $(u_2,v_2)$, with integer coordinates, $u_2>0$ and $0\le v_2\le u_2$. This is one **octant**, one of eight direction regions; this algorithm does not directly cover every direction.

From $(u,v)$, candidates are $E=(u+1,v)$ and $NE=(u+1,v+1)$. Their midpoint is $M=(u+1,v+1/2)$. If the midpoint is above or on the line, choose E; if the line passes above the midpoint, choose NE. Both pixels are equally close in a tie: **the convention on page 62 chooses E**.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/bresenham.svg" alt="Current pixel, candidates E and NE, midpoint M and line above the midpoint." width="440" height="360" loading="lazy" />
<figcaption>Compare with the midpoint before choosing.</figcaption>
</figure>
<p class="source-next"><a href="/en/lessons/L33/#pdf-61">Next in the PDF: No more rounding! →</a></p>

<span id="pdf-61" class="source-topic-marker"></span>

## No more rounding: an integer test

**PDF, page 61.** The line has equation $v=(v_2/u_2)u$. To check whether M is above or on it, test $v+1/2\ge(v_2/u_2)(u+1)$. Multiplying by $2u_2>0$ preserves the inequality direction. Rearranging gives $2v_2(u+1)-u_2(2v+1)\le0$.

Name this expression $d=2v_2(u+1)-u_2(2v+1)$. Then E corresponds to $d\le0$ and NE to $d>0$. **Common trap:** making the second inequality inclusive changes halfway pixels. That is allowed in another variant, but does not reproduce this PDF.

<p class="source-next"><a href="/en/lessons/L33/#pdf-62">Next in the PDF: Bresenham: incremental updates →</a></p>

<span id="pdf-62" class="source-topic-marker"></span>

## Bresenham: update rather than recalculate

**PDF, page 62.** Initially, $u=v=0$ gives $d=2v_2-u_2$. After E, only the column increases: add $2v_2$ to d. After NE, both column and row increase: add $2v_2-2u_2$.

**Additional example,** $u_2=5$ and $v_2=2$:

| Current pixel | d before the step | Choice | Next pixel |
| --- | --- | --- | --- |
| $(0,0)$ | $-1$ | E | $(1,0)$ |
| $(1,0)$ | $3$ | NE | $(2,1)$ |
| $(2,1)$ | $-3$ | E | $(3,1)$ |
| $(3,1)$ | $1$ | NE | $(4,2)$ |
| $(4,2)$ | $-5$ | E | $(5,2)$ |

**Quick check:** for $u_2=2$, $v_2=1$, the initial decision is $0$. Choosing E gives $(1,0)$, then NE gives $(2,1)$. The chapter’s former variant chose $(1,1)$; distance is the same, but the discrete choice differs.

<p class="source-next"><a href="/en/lessons/L33/#pdf-63">Next in the PDF: No more multiplications →</a></p>

<span id="pdf-63" class="source-topic-marker"></span>

## No more multiplications inside the loop

**PDF, page 63 — executable transcription of the pseudocode.** This additional function returns pixels instead of lighting them. It requires integers in the stated octant.

```python
def raster(u2, v2):
    if not isinstance(u2, int) or not isinstance(v2, int):
        raise ValueError("integer endpoints required")
    if not (u2 > 0 and 0 <= v2 <= u2):
        raise ValueError("requires u2 > 0 and 0 <= v2 <= u2")
    twice_u = 2 * u2
    twice_v = 2 * v2
    d = twice_v - u2
    v = 0
    pixels = []
    for u in range(u2 + 1):
        pixels.append((u, v))
        if d > 0:
            v = v + 1
            d = d - twice_u
        d = d + twice_v
    return pixels
```

Both doubled values are calculated before the loop; each step uses integer additions and a comparison. Both endpoints are included. Display a point segment directly. Negative or steep slopes, reverse traversal and downward screen axes need a coordinate transformation or a general algorithm: do not apply this function blindly.

<p class="source-next"><a href="/en/lessons/L36/#pdf-65">Next in the PDF: A puzzling discovery →</a></p>

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
