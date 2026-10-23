---
lessonId: L35
locale: en
version: 4
status: extended
title: "Calculating the regression line"
summary: "Apply the formula, organise sums and interpret a prediction; optional proof."
minutes: 45
objectives: [L35-O01, L35-O02, L35-O03, L35-O04, L35-O05, L35-O06]
prerequisites: [L22, L26, L34]
sourcePages: [71, 72, 73, 74, 75, 76, 77, 84, 85, 86, 87, 88, 89, 90, 91]
---
# Calculating the regression line

## Objectives and prerequisites

- Calculate means and explore a square as an extension.
- Find the best intercept at fixed slope.
- Find the optimal slope.
- Perform a complete fit.
- Predict and check an implementation.
- Handle degenerate cases.

Prerequisites: L22, L26, L34. Domains and restrictions stated below are part of every rule.

<span id="pdf-71" class="source-topic-marker"></span>

## The formula: what we want to calculate

**PDF, page 71.** If horizontal coordinates are not all equal, $S_{xx}>0$ and the best line predicting $y$ from $x$ has $m=S_{xy}/S_{xx}$, then $p=\bar y-m\bar x$. Calculate means first, then deviations, then sums: the symbols do not replace these steps.

The line passes through mean point $(\bar x,\bar y)$: replacing $x$ with $\bar x$ gives $m\bar x+(\bar y-m\bar x)=\bar y$. **The revised PDF, page 71, states the theorem without proof.** The main path proceeds directly to the four-year calculation. Proof and code remain below as optional supplements.

<p class="source-next"><a href="/en/lessons/L35/#pdf-72">Next in the PDF: By hand, using four years →</a></p>

<span id="pdf-72" class="source-topic-marker"></span>

## By hand, using four years: the PDF calculation table

**PDF example, pages 72–75.** Keep 2000, 2003, 2005 and 2009. Data are $(8{,}2;5{,}0)$, $(5{,}3;4{,}4)$, $(4{,}0;4{,}1)$ and $(3{,}7;4{,}1)$. Means are $\bar x=(8{,}2+5{,}3+4{,}0+3{,}7)/4=5{,}3$ and $\bar y=(5{,}0+4{,}4+4{,}1+4{,}1)/4=4{,}4$.

| Year | $x_i$ | $y_i$ | $x_i-\bar x$ | $y_i-\bar y$ |
| --- | --- | --- | --- | --- |
| 2000 | 8.2 | 5.0 | 2.9 | 0.6 |
| 2003 | 5.3 | 4.4 | 0 | 0 |
| 2005 | 4.0 | 4.1 | −1.3 | −0.3 |
| 2009 | 3.7 | 4.1 | −1.6 | −0.3 |

| Year | $(x_i-\bar x)(y_i-\bar y)$ | $(x_i-\bar x)^2$ |
| --- | --- | --- |
| 2000 | 1.74 | 8.41 |
| 2003 | 0 | 0 |
| 2005 | 0.39 | 1.69 |
| 2009 | 0.48 | 2.56 |
| Sum | $S_{xy}=2{,}61$ | $S_{xx}=12{,}66$ |

Read one row: $2{,}9\cdot0{,}6=1{,}74$ and $2{,}9^2=8{,}41$. Then add each column, keeping products separate from squares. Obtain $m=2{,}61/12{,}66\approx0{,}206$ and $p=4{,}4-m\cdot5{,}3\approx3{,}31$. Keep the unrounded value of $m$ during calculation and round the display at the end.

<p class="source-next"><a href="/en/lessons/L35/#pdf-76">Next in the PDF : Result and prediction →</a></p>

<span id="pdf-76" class="source-topic-marker"></span>

## Result and prediction: reading the fitted line

**PDF, pages 76–77.** The line fitted using four years is approximately $\hat y=0{,}206x+3{,}31$. The plot distinguishes the four fitting observations from the remaining six. Before coefficient rounding, it passes through mean point $(5{,}3;4{,}4)$.

At $x=2$ pounds of margarine per person per year, displayed coefficients give $\hat y=0{,}206\cdot2+3{,}31\approx3{,}72$ divorces per thousand residents. This is a **numerical model prediction**, outside observed range $[3{,}7;8{,}2]$. It establishes neither causality nor reliable forecasting. We study these limits next.

**Additional example.** At $x=5{,}3$, unrounded coefficients recover exactly $4{,}4$. Checking the mean point is a useful way to catch an intercept error.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/regression-four.svg" alt="Line fitted to four selected years, the six other observations as crosses and mean point as a diamond." width="440" height="360" loading="lazy" />
<figcaption>Four points for calculation; six others for visual comparison. <a class="figure-full-size" href="/diagrams/droites/en/regression-four.svg" target="_blank" rel="noopener">Open the full-size figure (new tab)</a></figcaption>
</figure>

## Guided example: three original observations

For $(0,1),(1,2),(2,2)$, we have $\bar x=1$, $\bar y=5/3$, $S_{xx}=2$, $S_{xy}=1$ and $S_{yy}=2/3$. Thus $m=1/2$ and $p=7/6$. Residuals are $-1/6,1/3,-1/6$: their sum is zero and squared sum is $1/6$. At $x=3$, the model predicts $8/3$. This calculation is a model prediction, not certainty about a future observation.

<p class="source-next"><a href="/en/lessons/L36/#pdf-78">Next in the PDF: You have just done machine learning →</a></p>

<span id="pdf-84" class="source-topic-marker"></span>

## PDF exercise: study hours and exam score

**PDF, pages 84–91.** Five students report study hours $x$ and exam score $y$ out of 20. Finding a line summarising these observations does not prove that an additional hour always produces the same gain.

| $x_i$ | $y_i$ |
| --- | --- |
| 1 | 8 |
| 2 | 9 |
| 3 | 12 |
| 4 | 14 |
| 5 | 17 |

**Try first.** Calculate the means, the two sums and the line. Then predict the score for 3.5 hours and for 10 hours. Is the second answer possible?

<p class="source-next"><a href="/en/lessons/L36/#pdf-92">Next in the PDF: What comes next? →</a></p>

<details>
<summary>Show the explained solution</summary>

Means are $\bar x=(1+2+3+4+5)/5=3$ and $\bar y=(8+9+12+14+17)/5=12$. Each deviation column sums to zero: a useful check.

| $x_i$ | $y_i$ | $x_i-\bar x$ | $y_i-\bar y$ | Product of deviations | Squared x deviation |
| --- | --- | --- | --- | --- | --- |
| 1 | 8 | −2 | −4 | 8 | 4 |
| 2 | 9 | −1 | −3 | 3 | 1 |
| 3 | 12 | 0 | 0 | 0 | 0 |
| 4 | 14 | 1 | 2 | 2 | 1 |
| 5 | 17 | 2 | 5 | 10 | 4 |

Adding products gives $S_{xy}=8+3+0+2+10=23$. Adding squares gives $S_{xx}=4+1+0+1+4=10$. Thus $m=23/10=2{,}3$ and $p=12-2{,}3\cdot3=5{,}1$. The line is $\hat y=2{,}3x+5{,}1$.

At $x=3{,}5$, obtain $\hat y=2{,}3\cdot3{,}5+5{,}1=13{,}15$, about 13 out of 20. This is interpolation within observed range $[1;5]$, without a guarantee for an individual student.

At $x=10$, obtain $\hat y=2{,}3\cdot10+5{,}1=28{,}1$. A score above 20 is impossible here: extrapolation reveals a model limit, not an error in substitution.

</details>

<figure class="teaching-figure">
<img src="/diagrams/droites/en/study-score.svg" alt="Five observed scores, fitted line over 1 to 5 hours, dashed extension to 10 hours above the maximum score of 20." width="440" height="360" loading="lazy" />
<figcaption>The line exceeds the score ceiling when extended too far. <a class="figure-full-size" href="/diagrams/droites/en/study-score.svg" target="_blank" rel="noopener">Open the full-size figure (new tab)</a></figcaption>
</figure>
<details>
<summary>Go further: proof and Python (optional)</summary>

<span id="supplement-square" class="source-topic-marker"></span>

## Completing the square: building the rewriting

**Optional project supplement, outside the revised PDF.** To transform $x^2+6x+1$, seek a square $(x+a)^2=x^2+2ax+a^2$. Coefficient $6$ requires $2a=6$, so $a=3$.

1. Add and subtract the same number: $x^2+6x+1=x^2+6x+9-9+1$.
2. Recognise the square: $(x+3)^2-8$.
3. Use its sign: $(x+3)^2\ge0$, so the value is at least $-8$.
4. Attain it: $x=-3$ makes the square zero, so the minimum is $-8$.

The general recipe is $x^2+bx=(x+b/2)^2-b^2/4$. **Additional example:** $x^2-4x+7=(x-2)^2+3$ has minimum $3$, attained at $x=2$. The drawing shows the lowest point; the calculation proves no other value is smaller. For positive leading coefficient $A$, factor it out first and apply the same idea.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/complete-square.svg" alt="Parabola y equals x squared plus 6x plus 1, with minimum at minus 3,minus 8." width="440" height="360" loading="lazy" />
<figcaption>The square is zero at the vertex and nonnegative elsewhere. <a class="figure-full-size" href="/diagrams/droites/en/complete-square.svg" target="_blank" rel="noopener">Open the full-size figure (new tab)</a></figcaption>
</figure>

## Additional example: another minimum

Identity $m^2-6m+11=(m-3)^2+2$ shows a minimum of $2$, attained only at $m=3$. More generally, $Am^2-2Bm+C=A(m-B/A)^2+C-B^2/A$ for $A>0$. This method finds the minimum without derivatives because the square is nonnegative.

<span id="supplement-proof-p" class="source-topic-marker"></span>

## Proof, first part: the best p

**Optional project supplement, outside the revised PDF.** Fixing $m$ means provisionally choosing a slope and varying only intercept $p$. Put $r_i=y_i-mx_i$, so $e_i=r_i-p$. Expand with the standard identity:

$$S(m,p)=\sum_i(r_i-p)^2=\sum_i r_i^2-2p\sum_i r_i+np^2.$$

Term $p^2$ is constant in the sum, giving $np^2$. Set $\bar r=(1/n)\sum_i r_i$ and rewrite as $n(p-\bar r)^2+\sum_i r_i^2-n\bar r^2$. The last two terms do not depend on $p$. Since $n>0$, the minimum is attained only at $p=\bar r$.

Finally, linearity gives $\bar r=\bar y-m\bar x$. This is precisely the announced intercept. The intercept is fixed for each slope; we must now choose the slope.

<span id="supplement-proof-m" class="source-topic-marker"></span>

## Proof, second part: the best m

**Optional project supplement, outside the revised PDF.** Once $p=\bar y-m\bar x$ is chosen, residuals become $(y_i-\bar y)-m(x_i-\bar x)$. Expand each square with $(a-b)^2=a^2-2ab+b^2$, then add: three columns result, $S_{yy}$, $-2mS_{xy}$ and $m^2S_{xx}$.

Loss is therefore a quadratic in $m$ with positive leading coefficient $S_{xx}>0$. Completing the square gives $S_{xx}(m-S_{xy}/S_{xx})^2+S_{yy}-S_{xy}^2/S_{xx}$. Only the first square varies with $m$: making it zero gives $m=S_{xy}/S_{xx}$. Sum of squared deviations $S_{xx}$ is zero only when all horizontal coordinates are equal; handle that case separately.

<span id="supplement-python" class="source-topic-marker"></span>

## Optional supplement: repeating the calculations in Python

This supplement uses all ten observations, rather than just the four in the hand calculation, so the result differs slightly. Function `fit` below implements centred sums with input checks. First define it, then call it on the ten observations.

## Guided example: implementing the calculation

The following code uses centred sums and rejects empty data or constant inputs. For very close floating-point values, a production version must also handle numerical precision. Check passage through the mean point and compare residuals with a small exact example.

```python
def fit(points):
    if not points:
        raise ValueError("empty data")
    n = len(points)
    xb = sum(x for x, y in points) / n
    yb = sum(y for x, y in points) / n
    sxx = sum((x - xb) ** 2 for x, y in points)
    sxy = sum((x - xb) * (y - yb) for x, y in points)
    if sxx == 0:
        raise ValueError("constant inputs")
    m = sxy / sxx
    return m, yb - m * xb
```

```python
x = [8.2, 7.0, 6.5, 5.3, 5.2, 4.0, 4.6, 4.5, 4.2, 3.7]
y = [5.0, 4.7, 4.6, 4.4, 4.3, 4.1, 4.2, 4.2, 4.2, 4.1]
m, p = fit(list(zip(x, y)))
print(round(m, 4), round(p, 4))  # 0.2014 3.3086
```

`zip` pairs values at the same position into data points. `sum` adds values; `** 2` squares a value. Empty data and constant horizontal coordinates are rejected because the formula cannot then identify a unique slope. Another possible implementation is `numpy.polyfit(x, y, 1)`; the detailed version keeps each step visible without another library.

## What if inputs are constant?

If every $x_i$ equals $c$, only value $mc+p$ is observed. Every pair satisfying $mc+p=\bar y$ minimises loss; slope is not identifiable. Do not divide by $S_{xx}=0$. Constant outputs with varying inputs are a different case: the best slope is zero and the intercept is the common output.

</details>

## Practice and recap

The bank also includes questions about the optional proof above. It contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
