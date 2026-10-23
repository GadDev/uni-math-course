---
lessonId: L22
locale: en
version: 3
status: extended
title: "Expanding and factorising"
summary: "Change the form of an expression without changing its value."
minutes: 30
objectives: [L22-O01, L22-O02, L22-O03, L22-O04, L22-O05, L22-O06]
prerequisites: [L21]
sourcePages: [7, 8, 9, 10, 11, 12, 15, 16, 17, 18]
---
# Expanding and factorising

## Objectives and prerequisites

- Distribute a factor.
- Factor out a common factor.
- Expand a product.
- Use standard identities.
- Choose a useful form.
- Refute a false identity.

Prerequisites: L21. Domains and restrictions stated below are part of every rule.

<span id="pdf-7" class="source-topic-marker"></span>

## Expanding and factorising: the PDF examples

A **term** is a piece separated by addition or subtraction. A **factor** is a piece multiplied by another. In $3x+6$, the terms are $3x$ and $6$; in $3(x+2)$, the factors are $3$ and $x+2$. Expanding exposes terms; factorising exposes factors.

**PDF, pages 7–12 — calculations revisited and explained.**

- Expand: $3(x-2)-2(x+1)=3x-6-2x-2=x-8$. Factor $-2$ multiplies **both** $x$ and $1$.
- Factorise: $6x^2-9x=3x(2x-3)$. Both terms contain factor $3x$; expand again to check.
- Remove a group: $5-(2x-3)=5-2x+3=8-2x$.

Double distributivity is $(a+b)(c+d)=ac+ad+bc+bd$. Every term in the first group meets every term in the second. **Additional example:** $(x+2)(x+3)=x^2+3x+2x+6=x^2+5x+6$. Coefficient $5$ comes from $3+2$.

To follow the PDF strictly, read [fractions, powers and roots](../L23/#pdf-13) next, then return to the [standard algebraic identities](#pdf-15).

## One value, several forms

For $a,b,c\in\mathbb{R}$, $a(b+c)=ab+ac$. Expanding reads this equality to the right; factorising reads it to the left. The factor multiplies every term including its sign. An identity holds for every stated value, not just a favourable example. Keep this distinction when using a calculator to check a result.

## Guided example: expand and collect

For $x\in\mathbb{R}$, $5(x-2)-3(x+4)=5x-10-3x-12=2x-22$. Collect terms of the same kind. At $x=2$, both expressions give $-18$: this is a local check. The general justification remains distributivity, valid for every real number. A minus sign before a group changes all its terms, not only the first.

<p class="source-next"><a href="/en/lessons/L23/#pdf-13">Next in the PDF : Fractions →</a></p>

<span id="pdf-15" class="source-topic-marker"></span>

## Standard algebraic identities: understanding all three formulas

An **identity** is an equality true for every value in its domain. For all real $a,b$:

| Recognise this form | Expansion | Watch for |
| --- | --- | --- |
| $(a+b)^2$ | $a^2+2ab+b^2$ | Two cross products $ab$. |
| $(a-b)^2$ | $a^2-2ab+b^2$ | The final square remains nonnegative. |
| $(a+b)(a-b)$ | $a^2-b^2$ | The cross products cancel. |

Expand the first: $(a+b)^2=(a+b)(a+b)=a^2+ab+ba+b^2$. Since $ab=ba$, the two pieces give $2ab$. The drawing uses positive lengths; the algebraic identity holds for all real numbers. For the second, replace $b$ with $-b$. For the third, expansion gives $a^2-ab+ab-b^2$.

**PDF examples, pages 15–18.** $101^2=(100+1)^2=10000+200+1=10201$. For $(2x-3)^2$, identify $a=2x$ and $b=3$: $(2x)^2-2(2x)(3)+3^2=4x^2-12x+9$.

**Two additional examples.** $49^2=(50-1)^2=2500-100+1=2401$. And $103\cdot97=(100+3)(100-3)=10000-9=9991$. Name the two pieces before choosing a formula.

**Quick check.** Does $(x+4)^2$ contain $8x$? Yes: $2\cdot x\cdot4=8x$. Writing only $x^2+16$ erases the drawing’s two rectangles.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/identity-area.svg" alt="A square of side a plus b partitioned into two squares and two ab rectangles." width="440" height="360" loading="lazy" />
<figcaption>The four areas add up: a², ab, ab and b².</figcaption>
</figure>

## Reconstruct the identities

Before choosing an identity from the table, write the square as a product. This recovers the two cross terms instead of relying on an isolated memorised formula.

## Guided example: factorise in two stages

For $x\in\mathbb{R}$, $3x^3-12x=3x(x^2-4)=3x(x-2)(x+2)$. Extract the common factor first, then recognise the difference of squares. Expanding back checks the result. Factorised form reveals zeros without dividing by a factor that might itself be zero.

## Choose a form for a question

Expanded form helps with addition. Factorised form helps study zeros. A square can reveal a sign: $x^2+10x+25=(x+5)^2\ge0$. To refute $(a+b)^2=a^2+b^2$, choose for example $a=2$ and $b=3$; the missing cross term explains the difference. One counterexample refutes a universal identity.

<p class="source-next"><a href="/en/lessons/L24/#pdf-19">Next in the PDF : Solving an equation →</a></p>

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
