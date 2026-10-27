# Probabilities of a source

*Chapter 04 · Sequence T04 · Source: PDF pp. 11, 13 · Unpublished draft.*

## Objectives and prerequisites

You will: (1) identify the size $n=|S|$; (2) state conditions on a distribution; (3) interpret $p_i$; (4) calculate frequency from observations; (5) build a valid distribution; (6) articulate assumptions of the model.

Prerequisites: T02, fractions and percentages. Probabilities here concern individual source symbols.

## 01 · Not all source symbols are equally frequent

**PDF, p. 11.** A source draws symbols from a finite alphabet $S=\{s_1,\ldots,s_n\}$, where $n=|S|$. The document assumes strictly positive probabilities:

$$p_i>0,\qquad \sum_{i=1}^{n}p_i=1.$$

The number $p_i$ is the probability that the emitted symbol is $s_i$. These values must form a coherent distribution: neither a negative probability nor a sum different from $1$ is allowed.

**PDF example, p. 14 (introduced here to prepare T05).** The source $S=\{x,y,z\}$ has distribution $(1/2,1/4,1/4)$. Since $1/2+1/4+1/4=1$, the distribution is valid.

## 02 · Estimating probabilities using frequencies

**PDF, p. 13.** For text, character frequencies can be estimated using a frequency table.

**Additional teaching example.** Observe ten source characters: $xxxxyyyxxz$. Symbol $x$ occurs six times, $y$ three times and $z$ once. Hence the empirical frequencies are

$$\widehat p(x)=6/10,\qquad \widehat p(y)=3/10,\qquad \widehat p(z)=1/10.$$

They sum to $1$. The hat on $\widehat p$ means **estimate** here: future symbols need not have precisely these proportions. A sample frequency is not a law of nature.

## 03 · Model assumptions

The PDF warns on p. 11 that we make **simplifying assumptions**. Specifying the probability of each symbol does not in itself describe the dependencies between successive symbols.

**Additional teaching example.** Two sources can both have $p(0)=p(1)=1/2$ while generating different patterns: one may alternate deterministically $0101\ldots$, while the other independently chooses each bit. Their symbol probabilities match, but their transition rules do not. Do not confuse a **distribution** with **independence**.

## 04 · Why these probabilities matter for coding

If common symbols have shorter codewords, we may be able to reduce the average length. This motivates the **weighted mean** in T05. The PDF also mentions two-pass estimation for video pixel blocks on p. 13 but does not specify an algorithm; we do not attribute one to that slide.

**Common mistake.** Reading $p(x)=1/2$ as “exactly one in every two characters of every message must be $x$”. A probability is not a guarantee for each finite sample.

## Check your understanding — with answers

1. **Question.** Is $(1/2,1/3,1/6)$ valid? **Answer.** Yes; all probabilities are positive and sum to $1$.
2. **Question.** Is $(1/2,1/2,1/4)$ valid? **Answer.** No, the sum is $5/4$.
3. **Question.** Five $x$s and three $y$s: estimate $\widehat p(x)$. **Answer.** $5/8$.
4. **Question.** Does one sample's frequency guarantee the next sample's frequency? **Answer.** No; it is only an estimate.
5. **Question.** Do $p(x)$ and $p(y)$ establish independence between consecutive symbols? **Answer.** No; transition information is missing.

**Next.** T05: average codeword length.
