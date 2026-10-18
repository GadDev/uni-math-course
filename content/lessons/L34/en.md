---
lessonId: L34
locale: en
version: 2
status: extended
title: "Affine models and residuals"
summary: "Measure a model’s vertical error and build a squared loss."
minutes: 30
objectives: [L34-O01, L34-O02, L34-O03, L34-O04, L34-O05, L34-O06]
prerequisites: [L26, L29]
sourcePages: [63, 64, 65, 66, 67]
---
# Affine models and residuals

## Objectives and prerequisites

- Calculate a prediction.
- Calculate a signed residual.
- Explain error cancellation.
- Calculate squared loss.
- Calculate centred sums.
- Compare model criteria.

Prerequisites: L26, L29. Domains and restrictions stated below are part of every rule.

<span id="pdf-63" class="source-topic-marker"></span>

## The model: why compare several lines?

**PDF situation, pages 62–64.** The ten margarine/divorce observations form a scatterplot; no line passes through all of them. The [starting data table](../L36/#pdf-62) opens this part in the PDF path. Seek an approximate relationship $y\approx mx+p$, rather than an equality for every observation.

A line can pass near one point and far from others. To compare models fairly, apply the **same criterion** to every observation. The green line is fitted to all ten points; the dashed line is another candidate. The drawing poses the question, then residuals let us measure the answer.

**Additional example.** For $(0,1),(1,2),(2,2)$, compare $\hat y=x+1$ and $\hat y=2$. The first misses the last point by one unit; the second misses the first by one. Here they have equal sums of squared errors despite making different predictions.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/regression-models.svg" alt="Ten observations and two candidate lines, one fitted to the data and one flatter." width="440" height="360" loading="lazy" />
<figcaption>Compare a line with the whole cloud, rather than one point.</figcaption>
</figure>

## A model need not equal the data

At each input $x_i$, the model predicts $\hat y_i=mx_i+p$. Observation $y_i$ may differ. The residual is $e_i=y_i-\hat y_i$. A positive residual means the observed point is above the line, so the model underestimates that observation. We fit vertical errors, not perpendicular distances from the line.

<p class="source-next"><a href="/en/lessons/L34/#pdf-65">Next in the PDF : Measuring error →</a></p>

<span id="pdf-65" class="source-topic-marker"></span>

## Measuring error: observation, prediction and residual

The hat in $\hat y_i$, read “y hat subscript i”, marks the **prediction** for observation number $i$. Value $y_i$ without the hat is **observed**. The PDF defines residual $e_i=y_i-\hat y_i=y_i-(mx_i+p)$.

**Additional detailed example.** With $x_i=2$, $y_i=6$, $m=2$ and $p=1$, the model predicts $\hat y_i=2\cdot2+1=5$. Residual $e_i=6-5=1$: the observed point is one unit above the line. With observation $y_i=4$, the same model would give $e_i=-1$. The drawing’s segments are vertical because input $x_i$ stays fixed.

**Criteria discussed in the PDF, pages 65–66.** Adding signed residuals can conceal errors: $-2+2=0$. Adding absolute values is another possible criterion: $|-2|+|2|=4$. Least squares chooses $(-2)^2+2^2=8$; errors no longer cancel and large errors weigh more. This is a choice of criterion, rather than the only way to measure error.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/residuals.svg" alt="Three observations and line y equals x plus 1; vertical segments labelled e1, e2 and e3." width="440" height="360" loading="lazy" />
<figcaption>A residual compares observation and prediction at the same horizontal coordinate.</figcaption>
</figure>

## Guided example: calculating residuals

For data $(0,1),(1,2),(2,2)$ and model $\hat y=x+1$, predictions are $1,2,3$. Residuals are $0,0,-1$ and their squared sum is $1$. The final negative residual indicates overestimation. Reversing the sign convention would not change the squares, but would change sign interpretation.

## A loss that cannot cancel

Least-squares loss is $S(m,p)=\sum_{i=1}^n(y_i-mx_i-p)^2$, with $n\ge1$. It is nonnegative and equals zero exactly when every prediction is exact on the data. Mean squared error is $\mathrm{MSE}=S/n$. For the same dataset, minimising either gives the same parameters. Squaring amplifies large residuals.

## Guided example: a misleading sum

Residuals $-2,2$ sum to zero but have loss $8$. Residuals $1,1$ sum to $2$ but have loss $2$. Choosing only the smallest signed sum would wrongly favour the first model; very large negative residuals could even make that criterion arbitrarily negative.

<p class="source-next"><a href="/en/lessons/L34/#pdf-67">Next in the PDF : The least-squares method →</a></p>

<span id="pdf-67" class="source-topic-marker"></span>

## Least squares and the three centred sums

**PDF definition, page 67.** Choose parameters $m,p$ to make $S(m,p)=\sum_{i=1}^n e_i^2$ as small as possible. The name means “smallest sum of squares”, rather than choosing the smallest points.

The page-67 notation abbreviates repeated calculations:

| Notation | Calculation | Reading |
| --- | --- | --- |
| $S_{xx}$ | $\sum_{i=1}^n(x_i-\bar x)^2$ | Sum of squared horizontal deviations. |
| $S_{xy}$ | $\sum_{i=1}^n(x_i-\bar x)(y_i-\bar y)$ | Sum of products of deviations. |
| $S_{yy}$ | $\sum_{i=1}^n(y_i-\bar y)^2$ | Sum of squared vertical deviations. |

**Additional example.** For $(0,1)$ and $(2,3)$, means are $\bar x=1$, $\bar y=2$. Horizontal deviations are $-1,1$, as are vertical deviations. Hence $S_{xx}=1+1=2$, $S_{xy}=1+1=2$ and $S_{yy}=1+1=2$. The next lesson keeps these columns visible in a four-observation table.

## Three useful sums

Define $S_{xx}=\sum_i(x_i-\bar x)^2$, $S_{xy}=\sum_i(x_i-\bar x)(y_i-\bar y)$ and $S_{yy}=\sum_i(y_i-\bar y)^2$. For $(0,1),(2,3)$, means are $(1,2)$ and all three sums equal $2$. Squared sums are never negative, but the cross sum can be negative. These quantities prepare the calculation of the best-fitting line.

<p class="source-next"><a href="/en/lessons/L35/#pdf-68">Next in the PDF : The formula →</a></p>

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
