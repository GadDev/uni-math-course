---
lessonId: L05
locale: en
version: 5
status: pilot
title: "Implication: a promise with one failure case"
summary: "Read A ⇒ B, distinguish necessary and sufficient conditions, and find a counterexample."
minutes: 18
objectives: [L05-O01, L05-O02, L05-O03, L05-O04, L05-O05, L05-O06]
prerequisites: [L01, L02, L03, L04]
sourcePages: [20, 21, 22, 23]
---
# Implication: a promise with one failure case

## Your objective

By the end of this lesson, you can read $A \Rightarrow B$, complete its truth table, distinguish “necessary” from “sufficient”, and recognise a **counterexample**: a case sufficient to show that a general rule is false.

**Prerequisites:** an assertion is a statement that is true or false (<a href="/en/lessons/L01/">L01</a>); AND, inclusive OR and NOT combine these values (<a href="/en/lessons/L02/">L02</a>). Reading a table comes from <a href="/en/lessons/L03/">L03</a>; equivalence and De Morgan’s laws, used below, come from <a href="/en/lessons/L04/">L04</a>.

## A precise promise

Imagine this rule: “If a card is red, it has a stamp.” Each card has one uniform colour: red or blue, never both.

First fix **one card**:

- $A$: “the card is red”.
- $B$: “the card has a stamp”.

The rule fails for a **red card without a stamp**. It requires nothing of a blue card: with or without a stamp, that card does not contradict the rule.

![Four cards: blue without a stamp, blue with a stamp and red with a stamp do not contradict the rule; red without a stamp is the only failure.](/diagrams/logic/L05-cards-en.svg)

The four cards above represent all possible combinations. The word “red” and the stamp symbol also make the drawing readable without distinguishing colours.

**One card and a general rule.** For a fixed card, we evaluate an implication. Saying “all red cards have a stamp” requires this implication to be true for every card. A single red card without a stamp refutes that general rule; one compliant card is not enough to prove it.

Mathematical implication relates truth values. By itself, it does not describe a cause or a sequence of events: the colour does not create the stamp.

## Definition and reading

Read $A \Rightarrow B$ as “A implies B” or “if A, then B”. $A$ is the **antecedent** (the condition); $B$ is the **consequent** (what the condition requires).

**Definition:** implication is false exactly when A is true and B is false. It is true in the other three cases.

Why declare it true when A is false? Here, “true” means that this combination is not the forbidden failure. It means neither that B is true nor that A and B have a causal connection. This is sometimes called **vacuous truth**: the condition is not met, so no requirement is violated.

In this table, 0 means false and 1 means true.

| A | B | ¬A | A ⇒ B |
| --- | --- | --- | --- |
| 0 | 0 | 1 | 1 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 |
| 1 | 1 | 0 | 1 |

Read the row A = 1, B = 0 first: it is the only failure. Then the first two rows: A is false, so these combinations cannot violate the rule.

We obtain exactly the same table with:
$$
(A \Rightarrow B) \equiv (\neg A \lor B).
$$

$\neg A$ means “NOT A”; $\lor$ means “inclusive OR” (at least one of the two assertions is true). Thus, “not red OR stamped” excludes only the red card without a stamp.

$\equiv$ means that both formulas have the same value for **every choice of values for A and B**: the four rows of the table, also called assignments. $\Rightarrow$ forms an implication; $\equiv$ compares two formulas. The symbols have different roles.

## Guided example: the blue card without a stamp

Before calculating, ask: “Is the red condition met?” No. The rule therefore requires nothing of this card.

1. The card is not red: $A = 0$.
2. It has no stamp: $B = 0$.
3. Therefore $\neg A = 1$.
4. Evaluate $\neg A \lor B = 1 \lor 0 = 1$.

This card does not contradict the rule. **It also does not prove that every red card has a stamp.** An observation and a general proof are different things.

**Predict first:** keep the card unstamped and change only its colour. When does the implication become false?

<div class="implication-lab" data-logic-lab="cards">
<fieldset><legend>Explore the four cards</legend>
<div class="implication-controls">
<label>Colour — value of A<select data-a disabled><option value="0" selected>Blue: A = 0</option><option value="1">Red: A = 1</option></select></label>
<label>Stamp — value of B<select data-b disabled><option value="0" selected>Without a stamp: B = 0</option><option value="1">With a stamp: B = 1</option></select></label>
</div></fieldset>
<div aria-live="polite" aria-atomic="true">
<p class="implication-card" data-card data-colour="blue">Blue card, without a stamp.</p>
<p data-calculation>¬A ∨ B = 1 ∨ 0 = 1</p>
<p data-reason>A is false: this card does not contradict the rule. This does not prove the rule for all cards.</p>
</div>
<p>The row matching your card is outlined in the table above. Both lists also work with a keyboard.</p>
<noscript><p>Enable JavaScript to manipulate the cards. The drawing and table above already show all four cases.</p></noscript>
</div>

This guided work, whose solution is visible, is for exploration; it does not measure your mastery independently.

## Necessary and sufficient

This course uses $\mathbb{N} = \{0,1,2,\ldots\}$ for the natural numbers, including zero. Fix a natural number n and let:

- $A$: “n > 10”.
- $B$: “n > 5”.

If n is greater than 10, it must be greater than 5. This holds for **every** natural number: exceeding 10 is enough to guarantee exceeding 5.

When $A \Rightarrow B$ is true:

- A is **sufficient** for B: knowing A is true is enough to conclude B is true.
- B is **necessary** for A: B must be true for A to be true. But B alone does not guarantee A.

Thus, being greater than 5 is necessary for being greater than 10. It is not sufficient: **8** is greater than 5 but not greater than 10. The **converse**, meaning the implication in the other direction, would be “if n > 5, then n > 10”; 8 refutes it.

**Predict first:** what happens at n = 5 and then at n = 10? Find every natural number that refutes the converse before moving the slider.

<div class="implication-lab" data-number-lab>
<fieldset><legend>Explore the thresholds 5 and 10</legend>
<label for="l05-number">Natural number n (from 0 to 15) : <output for="l05-number">8</output></label>
<input id="l05-number" type="range" min="0" max="15" step="1" value="8" disabled>
</fieldset>
<svg viewBox="0 0 510 175" role="img" aria-label="Two rows of integers: B starts at 6, A starts at 11; 5 and 10 are excluded thresholds. The vertical line marks n.">
<g stroke="currentColor" fill="none" stroke-width="2"><path d="M170 55H480l-8 -5m8 5l-8 5M310 105H480l-8 -5m8 5l-8 5"/>
<circle cx="170" cy="55" r="6" fill="var(--card)"/><circle cx="310" cy="105" r="6" fill="var(--card)"/>
<line data-marker x1="254" x2="254" y1="25" y2="125" stroke-dasharray="4 4" stroke-width="3"/>
</g><g fill="currentColor" font-size="20" font-family="sans-serif"><text x="30" y="28">B : n &gt; 5</text><text x="30" y="106">A : n &gt; 10</text><text x="25" y="158">0</text><text x="165" y="158">5</text><text x="300" y="158">10</text><text x="440" y="158">15</text></g><circle cx="198" cy="55" r="3" fill="currentColor"/><circle cx="226" cy="55" r="3" fill="currentColor"/><circle cx="254" cy="55" r="3" fill="currentColor"/><circle cx="282" cy="55" r="3" fill="currentColor"/><circle cx="310" cy="55" r="3" fill="currentColor"/><circle cx="338" cy="55" r="3" fill="currentColor"/><circle cx="366" cy="55" r="3" fill="currentColor"/><circle cx="394" cy="55" r="3" fill="currentColor"/><circle cx="422" cy="55" r="3" fill="currentColor"/><circle cx="450" cy="55" r="3" fill="currentColor"/><circle cx="338" cy="105" r="3" fill="currentColor"/><circle cx="366" cy="105" r="3" fill="currentColor"/><circle cx="394" cy="105" r="3" fill="currentColor"/><circle cx="422" cy="105" r="3" fill="currentColor"/><circle cx="450" cy="105" r="3" fill="currentColor"/></svg>
<p data-number-result aria-live="polite" aria-atomic="true">n = 8: A (“n > 10”) is false; B (“n > 5”) is true. A ⇒ B is 1; B ⇒ A is 0. This number refutes the converse.</p>
<noscript><p>Enable JavaScript to move n. The drawing remains readable at n = 8.</p></noscript>
</div>

The slider shows only the integers from 0 to 15; the arrows extend both conditions beyond this range. The thresholds 5 and 10 are excluded by “>”. Over all natural numbers, the counterexamples to the converse are exactly **6, 7, 8, 9 and 10**. The drawing helps you see this; the general argument is that the number must exceed 5 without exceeding 10.

To revisit number families: <a href="/en/lessons/L10/">L10</a> and the <a href="/en/numbers/">visual guide</a>.

## Negating an implication

For **one fixed card**, negating the implication describes its only failure: the condition holds AND the required result is missing.
$$
\neg(A \Rightarrow B) \equiv A \land \neg B.
$$

$\land$ means “AND”; the parentheses show that NOT applies to the **whole** implication. For the cards: “the card is red AND it has no stamp”.

To negate the rule about **all** cards, say: “there is at least one red card without a stamp”. Do not say that all cards are red and unstamped.

Here is the calculation, one step at a time. Try to predict the next step before opening it.

<div class="implication-lab">
<details><summary>1 · Rewrite the implication</summary><p>Replace “if A, then B” with “NOT A OR B”: ¬(A ⇒ B) ≡ ¬(¬A ∨ B).</p></details>
<details><summary>2 · Negate the OR</summary><p>For an OR to be false, both its parts must be false (De Morgan’s law, L04): ¬(¬A ∨ B) ≡ ¬¬A ∧ ¬B.</p></details>
<details><summary>3 · Remove the double negation</summary><p>NOT NOT A has the same value as A: ¬¬A ∧ ¬B ≡ A ∧ ¬B. We recover the red card without a stamp.</p></details>
</div>

**Trap:** negating both operands to write $\neg A \Rightarrow \neg B$ still leaves an implication. It does not negate the whole implication.

**Predict first:** when A = B = 1, do the negation and the implication between the negated operands have the same value? Then test the other three cases.

<div class="implication-lab" data-logic-lab="negation">
<fieldset><legend>Compare the negations</legend>
<div class="implication-controls">
<label>Value of A<select data-a disabled><option value="0">0</option><option value="1" selected>1</option></select></label>
<label>Value of B<select data-b disabled><option value="0">0</option><option value="1" selected>1</option></select></label>
</div></fieldset>
<div aria-live="polite" aria-atomic="true">
<p data-implication>A ⇒ B : true (1)</p>
<p data-negation>¬(A ⇒ B) : false (0)</p>
<p data-failure>A ∧ ¬B = 1 ∧ 0 = 0</p>
<p data-operands>¬A ⇒ ¬B : true (1)</p>
<p data-comparison>The last two values differ, so these formulas are not equivalent.</p>
</div>
<noscript><p>Enable JavaScript to change A and B. The case A = B = 1 already distinguishes the two formulas.</p></noscript>
</div>

## Watch the trap

A counterexample to $A \Rightarrow B$ requires **A true and B false**. A false condition is never sufficient. Similarly, A implies B does not guarantee that B implies A: the number 8 showed this. Lesson <a href="/en/lessons/L06/">L06</a> explores the converse and contrapositive further.

## A pause to check

Without looking at the table, explain why a blue card with a stamp does not contradict the rule. Then complete: “To refute an implication, I need a ___ condition and a ___ conclusion.”

<details><summary>See an explained answer</summary><p>For the blue card, A is false: the rule requires no stamp of it. To refute an implication, you need a true condition and a false conclusion.</p></details>

## Independent practice

The selected exercises cover the false case, the truth table, necessary/sufficient conditions, negation, a natural-language rule and a numerical counterexample.

The explorations on this page are freely accessible and are not saved. Practice with feedback and private progress is available with an account when sign-in is configured: use “Practise” after the lesson.

## Takeaway

Implication is a promise with one failure case: **the condition holds, but the promised result does not**. A is sufficient for B; B is necessary for A. To negate the implication, describe its failure: A AND NOT B.

Original project text, drawings and examples. Coverage follows PDF pages 20–23 in the repository’s course map; no professor-authored exercise is reproduced.
