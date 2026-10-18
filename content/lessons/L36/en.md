---
lessonId: L36
locale: en
version: 2
status: extended
title: "Correlation and model limits"
summary: "Interpret correlation, avoid causal conclusions and locate machine learning in the workflow."
minutes: 45
objectives: [L36-O01, L36-O02, L36-O03, L36-O04, L36-O05, L36-O06]
prerequisites: [L34, L35]
sourcePages: [62, 80, 81, 82, 83, 84, 85, 86, 87]
---
# Correlation and model limits

## Objectives and prerequisites

- Calculate a defined correlation.
- Interpret sign and strength.
- Distinguish association and causality.
- Identify extrapolation and outliers.
- Distinguish training and inference.
- Assess limitations of numerical summaries.

Prerequisites: L34, L35. Domains and restrictions stated below are part of every rule.

<span id="pdf-62" class="source-topic-marker"></span>

## A puzzling discovery: the PDF dataset

**PDF, page 62 — historical data retained, original explanation.** Each row describes one year. $x_i$ is annual US margarine consumption in pounds per person; $y_i$ is divorces per thousand residents in Maine. Units and populations differ: similar trends do not prove a cause.

| Year | $x_i$ | $y_i$ |
| --- | --- | --- |
| 2000 | 8.2 | 5.0 |
| 2001 | 7.0 | 4.7 |
| 2002 | 6.5 | 4.6 |
| 2003 | 5.3 | 4.4 |
| 2004 | 5.2 | 4.3 |
| 2005 | 4.0 | 4.1 |
| 2006 | 4.6 | 4.2 |
| 2007 | 4.5 | 4.2 |
| 2008 | 4.2 | 4.2 |
| 2009 | 3.7 | 4.1 |

The PDF attributes this illustration to Tyler Vigen using USDA and CDC data. We use it as a course example, without claiming a causal relationship or updating these historical statistics. The cloud appears close to a line: this motivates a model without yet justifying it.

Continue with [The model](../L34/#pdf-63), then residuals, least squares and its calculation. Return afterwards to [machine-learning vocabulary](#pdf-80).

<figure class="teaching-figure">
<img src="/diagrams/droites/en/margarine.svg" alt="Scatterplot of the ten historical margarine and divorce pairs, with units on the axes." width="440" height="360" loading="lazy" />
<figcaption>Two series moving together do not establish causality.</figcaption>
</figure>

<p class="source-next"><a href="/en/lessons/L34/#pdf-63">Next in the PDF : The model →</a></p>

<span id="pdf-80" class="source-topic-marker"></span>

## From calculation to machine learning

In this supervised model, $x$ is an input or feature, $y$ a target and $(m,p)$ the learned parameters. Training selects parameters by minimising loss on training data. Inference uses the fixed parameters to produce a prediction. Low training error does not guarantee low error on new data: holding out validation data helps assess generalisation.


<p class="source-next"><a href="/en/lessons/L36/#pdf-81">Next in the PDF : The correlation coefficient →</a></p>

<span id="pdf-81" class="source-topic-marker"></span>

## Define before interpreting

For $S_{xx}>0$ and $S_{yy}>0$, Pearson correlation is $r=S_{xy}/\sqrt{S_{xx}S_{yy}}$. It is dimensionless and satisfies $-1\le r\le1$. Its sign agrees with the regression slope. If either variable is constant, the formula is undefined: it is not automatically assigned zero.

## Guided example: sign and fit

For points $(0,3),(1,2),(2,1)$, means are $(1,2)$ and $S_{xx}=S_{yy}=2$, $S_{xy}=-2$. Thus $r=-1$ and line $y=-x+3$ fits observations exactly. Under the definition’s conditions, $|r|=1$ is equivalent to a perfect affine fit. Correlation near zero rules out strong linear association, not every relationship.

## Guided example: a nonlinear relationship

Points $(-1,1),(0,0),(1,1)$ follow $y=x^2$ exactly. Yet $S_{xy}=0$ and $r=0$ because opposite centred products cancel. Plotting reveals curvature that a single number does not show. Similarly, different datasets can share means, variances and the same regression line while having very different shapes.

<p class="source-next"><a href="/en/lessons/L36/#pdf-82">Next in the PDF : Limit 1: correlation and causation →</a></p>

<span id="pdf-82" class="source-topic-marker"></span>

## Limit 1: correlation is not causation

**PDF, page 82.** Margarine consumption and divorces both decrease over the period; their correlation is close to $0{,}99$. This does not show that changing consumption of a food changes divorces. Year is a common variable to examine, and a statistical association does not supply a causal mechanism.

The PDF also mentions an association between chocolate and Nobel prizes across countries. Such a comparison raises the same question: what other factors could explain both measurements? It is not an experiment changing only one variable.

**Retained additional example.** Ice-cream sales and swimming-pool attendance can both rise with warm weather. A **hidden variable** is a factor omitted from the model that could contribute to both trends. Looking for such a factor is more useful than turning a coefficient into practical advice.

<p class="source-next"><a href="/en/lessons/L36/#pdf-83">Next in the PDF : Limit 2: Anscombe’s quartet →</a></p>

<span id="pdf-83" class="source-topic-marker"></span>

## Limit 2: Anscombe’s quartet

**PDF, page 83.** Four datasets can have almost the same means, fitted line and correlation while telling very different stories. The following drawings replot the classical quartet data rather than copying the PDF’s figures.

Each line is approximately $\hat y=0{,}5x+3$ and correlation is near $0{,}82$. These equalities are approximate with the published decimal data. The first cloud resembles a noisy affine relationship; the second is curved; the third has an atypical point; the fourth is almost vertical, with an isolated point strongly influencing the fit.

**Additional guided question.** Why is the second plot’s line inadequate despite its correlation coefficient? A systematic curve remains visible: a linear summary does not tell the whole story. Look at the points before calculating, and look again afterwards.

Data reference: [official documentation for R’s anscombe dataset](https://stat.ethz.ch/R-manual/R-devel/library/datasets/html/anscombe.html).

<figure class="teaching-figure">
<img src="/diagrams/droites/en/anscombe-1.svg" alt="Approximately affine cloud." width="440" height="360" loading="lazy" />
<figcaption>Anscombe 1 — Approximately affine cloud.</figcaption>
</figure>

<figure class="teaching-figure">
<img src="/diagrams/droites/en/anscombe-2.svg" alt="Cloud with clear curvature." width="440" height="360" loading="lazy" />
<figcaption>Anscombe 2 — Cloud with clear curvature.</figcaption>
</figure>

<figure class="teaching-figure">
<img src="/diagrams/droites/en/anscombe-3.svg" alt="Cloud with one atypical point." width="440" height="360" loading="lazy" />
<figcaption>Anscombe 3 — Cloud with one atypical point.</figcaption>
</figure>

<figure class="teaching-figure">
<img src="/diagrams/droites/en/anscombe-4.svg" alt="Almost vertical cloud and one isolated point." width="440" height="360" loading="lazy" />
<figcaption>Anscombe 4 — Almost vertical cloud and one isolated point.</figcaption>
</figure>

<p class="source-next"><a href="/en/lessons/L36/#pdf-84">Next in the PDF : Limit 3: outliers →</a></p>

<span id="pdf-84" class="source-topic-marker"></span>

## Limit 3: an outlier can tilt the line

**PDF principle, page 84; additional original data below.** Squaring gives a large error considerable weight. Six points $(0,0),(1,1),(2,2),(3,3),(4,4),(5,5)$ lie perfectly on $y=x$. Adding $(6,-2)$ changes the fit to $\hat y=x/7+10/7$: slope falls from $1$ to about $0{,}143$.

The added point is marked with a cross and the two models use different line styles. An outlier can be a typing error, a real phenomenon or a sign of an incomplete model. Check its provenance before removing it; do not erase it merely to make a line look nicer.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/outlier.svg" alt="Six points on y equals x and an added point at 6,minus 2; two lines show the fit before and after." width="440" height="360" loading="lazy" />
<figcaption>The same criterion can give a very different line after adding one point.</figcaption>
</figure>

<p class="source-next"><a href="/en/lessons/L36/#pdf-85">Next in the PDF : Limit 4: extrapolation →</a></p>

<span id="pdf-85" class="source-topic-marker"></span>

## Limit 4: extrapolating beyond the observations

**PDF example, pages 85–86.** Observed consumption ranges from $3{,}7$ to $8{,}2$ pounds per person per year. Predicting at $x=2$ extrapolates outside this range. Even inside it, prediction requires assumptions and validation: reliability is not guaranteed by the position of $x$ alone.

The PDF also models consumption over time: $\text{margarine}\approx-0{,}445t+7{,}32$, with $t=0$ in 2000. Solving $-0{,}445t+7{,}32=0$ gives $t\approx16{,}45$. For 2017, $t=17$ and the model predicts about $-0{,}245$ pounds: negative consumption makes no sense here. The mathematical line continues; the real situation imposes limits.

**Additional example.** An affine price observed for one to ten items need not hold for a thousand: a discount or capacity limit may change the rule. Always record the interval covered by observations.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/extrapolation.svg" alt="Time model for margarine extended beyond the observed years; it falls below zero near t equals 16.45." width="440" height="360" loading="lazy" />
<figcaption>The hatched region is outside the observed period 2000–2009.</figcaption>
</figure>

## Association, causality and domain

Ice-cream sales and pool attendance may rise together because the weather is hot. This association does not prove that one causes the other. Prediction beyond observed inputs is extrapolation and needs additional justification. Even inside the range, reliability depends on data, assumptions and validation; input location alone never guarantees it. An outlier may strongly change the line and warrants investigation, not automatic deletion.


<p class="source-next"><a href="/en/lessons/L36/#pdf-87">Next in the PDF : What comes next? →</a></p>

<span id="pdf-87" class="source-topic-marker"></span>

## What this introduction prepares

Several features will lead to models with several parameters. Perceptrons, nonlinear networks and gradient descent are later directions previewed by the source. Their calculations are not required here: this chapter supplies algebraic foundations, the notion of loss and the distinction between fitting and evaluating a model.

**PDF examples, page 87.** An apartment price can depend on floor area $x_1$ and storey $x_2$: $y\approx m_1x_1+m_2x_2+p$. There are more parameters, but the loss idea remains. For classification, the sign of $ax+by-c$ can select between two labels such as “spam” and “not spam”: this connects with half-planes. For example, fictional rule $x+y-3>0$ places $(2,2)$ on one side and $(0,1)$ on the other. A real application requires data and evaluation.

When no direct formula gives the parameters, gradient descent seeks to reduce loss through small adjustments. This is a preview: derivatives and neural networks are not hidden prerequisites for this chapter.

<p class="source-next"><a href="/en/chapters/C02/">Return to the chapter plan →</a></p>

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
