---
lessonId: L23
locale: en
version: 3
status: extended
title: "Fractions, powers and roots"
summary: "Preserve quotient domains and read powers and roots correctly."
minutes: 28
objectives: [L23-O01, L23-O02, L23-O03, L23-O04, L23-O05, L23-O06]
prerequisites: [L21, L22]
sourcePages: [13, 14]
---
# Fractions, powers and roots

## Objectives and prerequisites

- Add fractions.
- Multiply and divide.
- Use powers.
- Calculate a real root.
- Preserve the domain.
- Analyse a simplification.

Prerequisites: L21, L22. Domains and restrictions stated below are part of every rule.

<span id="pdf-13" class="source-topic-marker"></span>

## Fractions: use a common unit before adding

In $a/b$, the **numerator** $a$ counts parts and the **denominator** $b$ describes their size, with $b\ne0$. For the positive parts in the drawing, a half and a third are different sizes.

**PDF example, page 13.** $1/2+1/3=3/6+2/6=5/6$. Divide each whole into six equally sized parts, then count five of them. The result $2/5$ would add incompatible part sizes.

**Additional example.** $3/4-1/6=9/12-2/12=7/12$. Multiplication uses a different rule: $(a/b)(c/d)=ac/(bd)$ for $b,d\ne0$. For example $(2/3)(3/5)=6/15=2/5$. To divide, multiply by the reciprocal: $(a/b)/(c/d)=ad/(bc)$ also requires $c\ne0$.

<figure class="teaching-figure">
<img src="/diagrams/droites/en/fractions.svg" alt="One half represents three sixths and one third two sixths." width="440" height="360" loading="lazy" />
<figcaption>Equal-sized parts make addition possible.</figcaption>
</figure>

## Forms with conditions

The quotient $a/b$ of real numbers requires $b\ne0$. For $b,d\ne0$, $a/b+c/d=(ad+bc)/(bd)$. Construct a common unit: adding denominators confuses the sizes of the parts. To multiply fractions, however, multiply numerators and denominators separately. Cancelling removes common nonzero factors, never terms of a sum.

## Guided example: divide two fractions

Calculate $(3/4)/(9/8)$. The divisor is nonzero. Its reciprocal is $8/9$, so $(3/4)(8/9)=2/3$. A different check multiplies the result by the divisor, giving $(2/3)(9/8)=3/4$. This recovers the dividend. Checking a quotient this way is often safer than repeating the calculation.

<p class="source-next"><a href="/en/lessons/L23/#pdf-14">Next in the PDF : Powers and square roots →</a></p>

<span id="pdf-14" class="source-topic-marker"></span>

## Powers and square roots: read each rule

A positive integer exponent counts repeated factors: $a^3=a\cdot a\cdot a$. For nonzero bases and integer exponents $m,n$, the PDF’s rules are:

| Rule | Calculated example |
| --- | --- |
| $a^ma^n=a^{m+n}$ | $2^3\cdot2^2=2^5=32$ |
| $(a^m)^n=a^{mn}$ | $(2^3)^2=2^6=64$ |
| $(ab)^n=a^nb^n$ | $(2\cdot3)^2=2^2\cdot3^2=36$ |
| $a^0=1$ | $7^0=1$ |
| $a^{-n}=1/a^n$ | $2^{-3}=1/8$ |

For a strictly positive integer exponent, the product rule also allows a zero base. **Additional practice application:** $(a^2b)^3=(a^2)^3b^3=a^6b^3$ for all real $a,b$. Squaring $a+b$ instead requires the standard identities: a power does not distribute over a sum.

For $t\ge0$, $\sqrt t$ denotes the **nonnegative** root. Thus $\sqrt{25}=5$; solving $z^2=25$ gives both solutions $z=-5$ and $z=5$. For every real $a$, $\sqrt{a^2}=|a|$: the distance from $a$ to zero. Absolute value $|a|$ equals $a$ when $a\ge0$ and $-a$ otherwise.

The PDF continues with [Standard algebraic identities](../L22/#pdf-15), then [Solving an equation](../L24/#pdf-19).

## Exponent laws

The table’s conditions matter: the nonzero domain avoids undefined reciprocals; we do not use $0^0$. A negative exponent denotes a reciprocal, not a necessarily negative result. Do not confuse adding exponents with multiplying them.

## Guided example: roots and signs

For $a\ge0$, $\sqrt a$ is the unique nonnegative real number whose square is $a$. Thus $\sqrt{72}=6\sqrt2$ because $72=36\cdot2$. For every real $x$, $\sqrt{x^2}=|x|$: at $x=-6$, the root is $6$. We use $\sqrt{ab}=\sqrt a\sqrt b$ here for $a,b\ge0$. It does not transfer to addition.

## A simplified formula keeps its restrictions

The expression $(x^2-9)/(x-3)$ requires $x\ne3$. Factorisation gives $x+3$ only on that domain. The simplified formula has a value at $3$, but the original expression does not. A domain line prevents accidentally adding forbidden values when solving an equation afterwards.

<p class="source-next"><a href="/en/lessons/L22/#pdf-15">Next in the PDF : Standard algebraic identities →</a></p>

## Practice and recap

The bank contains 15 original questions: 5 easy, 5 medium and 5 hard. Start without a hint; after feedback, explain why each other proposal fails. Hard questions require transfer or analysis, not merely longer arithmetic. A hint or retry still helps learning, but does not provide fresh independent mastery evidence. Attempts are retained in your progress after sign-in.

Original project text, examples and solutions; concepts follow Bruno Teheux’s Droites course. Source pages are PDF pages, counting the title as page 1.
