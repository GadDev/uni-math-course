---
lessonId: L34
locale: en
version: 1
status: extended
title: "Affine models and residuals"
summary: "Measure a model’s vertical error and build a squared loss."
minutes: 18
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

## A model need not equal the data

At each input $x_i$, the model predicts $\hat y_i=mx_i+p$. Observation $y_i$ may differ. The residual is $e_i=y_i-\hat y_i$. A positive residual means the observed point is above the line, so the model underestimates that observation. We fit vertical errors, not perpendicular distances from the line.

## Guided example: calculating residuals

For data $(0,1),(1,2),(2,2)$ and model $\hat y=x+1$, predictions are $1,2,3$. Residuals are $0,0,-1$ and their squared sum is $1$. The final negative residual indicates overestimation. Reversing the sign convention would not change the squares, but would change sign interpretation.

## A loss that cannot cancel

Least-squares loss is $S(m,p)=\sum_{i=1}^n(y_i-mx_i-p)^2$, with $n\ge1$. It is nonnegative and equals zero exactly when every prediction is exact on the data. Mean squared error is $\mathrm{MSE}=S/n$. For the same dataset, minimising either gives the same parameters. Squaring amplifies large residuals.

## Guided example: a misleading sum

Residuals $-2,2$ sum to zero but have loss $8$. Residuals $1,1$ sum to $2$ but have loss $2$. Choosing only the smallest signed sum would wrongly favour the first model; very large negative residuals could even make that criterion arbitrarily negative.

## Three useful sums

Define $S_{xx}=\sum_i(x_i-\bar x)^2$, $S_{xy}=\sum_i(x_i-\bar x)(y_i-\bar y)$ and $S_{yy}=\sum_i(y_i-\bar y)^2$. For $(0,1),(2,3)$, means are $(1,2)$ and all three sums equal $2$. Squared sums are never negative, but the cross sum can be negative. These quantities prepare the calculation of the best-fitting line.

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
