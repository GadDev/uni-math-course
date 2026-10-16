---
lessonId: L36
locale: en
version: 1
status: extended
title: "Correlation and model limits"
summary: "Interpret correlation, avoid causal conclusions and locate machine learning in the workflow."
minutes: 22
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

## Define before interpreting

For $S_{xx}>0$ and $S_{yy}>0$, Pearson correlation is $r=S_{xy}/\sqrt{S_{xx}S_{yy}}$. It is dimensionless and satisfies $-1\le r\le1$. Its sign agrees with the regression slope. If either variable is constant, the formula is undefined: it is not automatically assigned zero.

## Guided example: sign and fit

For points $(0,3),(1,2),(2,1)$, means are $(1,2)$ and $S_{xx}=S_{yy}=2$, $S_{xy}=-2$. Thus $r=-1$ and line $y=-x+3$ fits observations exactly. Under the definition’s conditions, $|r|=1$ is equivalent to a perfect affine fit. Correlation near zero rules out strong linear association, not every relationship.

## Guided example: a nonlinear relationship

Points $(-1,1),(0,0),(1,1)$ follow $y=x^2$ exactly. Yet $S_{xy}=0$ and $r=0$ because opposite centred products cancel. Plotting reveals curvature that a single number does not show. Similarly, different datasets can share means, variances and the same regression line while having very different shapes.

## Association, causality and domain

Ice-cream sales and pool attendance may rise together because the weather is hot. This association does not prove that one causes the other. Prediction beyond observed inputs is extrapolation and needs additional justification. Even inside the range, reliability depends on data, assumptions and validation; input location alone never guarantees it. An outlier may strongly change the line and warrants investigation, not automatic deletion.

## From calculation to machine learning

In this supervised model, $x$ is an input or feature, $y$ a target and $(m,p)$ the learned parameters. Training selects parameters by minimising loss on training data. Inference uses the fixed parameters to produce a prediction. Low training error does not guarantee low error on new data: holding out validation data helps assess generalisation.

## What this introduction prepares

Several features will lead to models with several parameters. Perceptrons, nonlinear networks and gradient descent are later directions previewed by the source. Their calculations are not required here: this chapter supplies algebraic foundations, the notion of loss and the distinction between fitting and evaluating a model.

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
