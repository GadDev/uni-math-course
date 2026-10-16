---
lessonId: L35
locale: en
version: 1
status: extended
title: "Calculating and justifying least squares"
summary: "Complete the square to obtain the best-fitting line, then implement the calculation."
minutes: 25
objectives: [L35-O01, L35-O02, L35-O03, L35-O04, L35-O05, L35-O06]
prerequisites: [L22, L26, L34]
sourcePages: [68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79]
---
# Calculating and justifying least squares

## Objectives and prerequisites

- Complete a square.
- Find the best intercept at fixed slope.
- Find the optimal slope.
- Perform a complete fit.
- Predict and check an implementation.
- Handle degenerate cases.

Prerequisites: L22, L26, L34. Domains and restrictions stated below are part of every rule.

## Completing the square

Identity $m^2-6m+11=(m-3)^2+2$ shows a minimum of $2$, attained only at $m=3$. More generally, $Am^2-2Bm+C=A(m-B/A)^2+C-B^2/A$ for $A>0$. This method finds the minimum without derivatives because the square is nonnegative.

## Step 1: fix the slope

Write $X_i=x_i-\bar x$, $Y_i=y_i-\bar y$ and $q=\bar y-m\bar x-p$. Then $e_i=Y_i-mX_i+q$. Since centred deviations sum to zero, expansion gives $S(m,p)=\sum_i(Y_i-mX_i)^2+nq^2$. For fixed slope and $n\ge1$, the minimum in $p$ is unique: $p=\bar y-m\bar x$. Thus the optimal line passes through the mean point.

## Step 2: optimise the slope

With that intercept, loss becomes $S_{yy}-2mS_{xy}+m^2S_{xx}$. If $S_{xx}>0$, completing the square gives $S_{xx}(m-S_{xy}/S_{xx})^2+S_{yy}-S_{xy}^2/S_{xx}$. The unique minimum is therefore attained at $m=S_{xy}/S_{xx}$ and $p=\bar y-m\bar x$. Minimum loss is $S_{yy}-S_{xy}^2/S_{xx}$.

## Guided example: three original observations

For $(0,1),(1,2),(2,2)$, we have $\bar x=1$, $\bar y=5/3$, $S_{xx}=2$, $S_{xy}=1$ and $S_{yy}=2/3$. Thus $m=1/2$ and $p=7/6$. Residuals are $-1/6,1/3,-1/6$: their sum is zero and squared sum is $1/6$. At $x=3$, the model predicts $8/3$. This calculation is a model prediction, not certainty about a future observation.

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

## What if inputs are constant?

If every $x_i$ equals $c$, only value $mc+p$ is observed. Every pair satisfying $mc+p=\bar y$ minimises loss; slope is not identifiable. Do not divide by $S_{xx}=0$. Constant outputs with varying inputs are a different case: the best slope is zero and the intercept is the common output.

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
