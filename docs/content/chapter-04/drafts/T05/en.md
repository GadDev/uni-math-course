# Average length and coding efficiency

*Chapter 04 · Sequence T05 · Source: PDF pp. 11–16 · Unpublished draft.*

## Objectives and prerequisites

You will: (1) count codeword length $|w_i|$; (2) apply a weighted mean; (3) calculate $L(c)$; (4) compare two code proposals; (5) check that decoding is possible; (6) explain why a small average does not prove optimality.

Prerequisites: T03–T04 and fraction arithmetic. The source alphabet is finite, $S=\{s_1,\ldots,s_n\}$, with probabilities $p_i>0$ summing to $1$.

## 01 · An average that reflects frequencies

**PDF definition, p. 12.** When $c(s_i)=w_i$, the **average codeword length**, in target-alphabet symbols per source symbol, is

$$L(c)=\sum_{i=1}^{n}p_i|w_i|.$$

Here $|w_i|$ is the codeword length and $p_i$ is its expected frequency. This is **not** the simple average of lengths unless the symbols are equally likely.

**Additional teaching example.** For two symbols of probabilities $(3/4,1/4)$ with lengths $(1,3)$, we get $L(c)=3/4\times1+1/4\times3=3/2$ bits per source symbol. The unweighted average would be $2$, which ignores symbol frequencies.

## 02 · Calculating the source example step by step

**PDF, pp. 14–15.** Let $S=\{x,y,z\}$, $p=(1/2,1/4,1/4)$, and consider:

| Symbol | $p_i$ | $c_1(s_i)$ | $|c_1(s_i)|$ | $c_2(s_i)$ | $|c_2(s_i)|$ |
| --- | --- | --- | --- | --- | --- |
| $x$ | $1/2$ | $001$ | $3$ | $0$ | $1$ |
| $y$ | $1/4$ | $01$ | $2$ | $01$ | $2$ |
| $z$ | $1/4$ | $0$ | $1$ | $011$ | $3$ |

For $c_1$:

$$L(c_1)=\frac12\cdot3+\frac14\cdot2+\frac14\cdot1=\frac94=2{,}25.$$

For $c_2$:

$$L(c_2)=\frac12\cdot1+\frac14\cdot2+\frac14\cdot3=\frac74=1{,}75.$$

Both quantities are **bits per source symbol**. Thus the second code's average is smaller by $1/2$ bit per source symbol. Which symbol receives which length matters: the most likely symbol, $x$, has the shorter codeword in $c_2$.

## 03 · An essential caveat: can you decode it?

An average-length calculation alone does not make a code usable.

**Mathematical check of the PDF example.** As T03 explains, $c_1(x)=001=c_1(zy)$: the first code is ambiguous and not uniquely decodable. The second code is uniquely decodable even though it is not prefix-free. The arithmetic of $L$ is correct in both cases, but it does not override this requirement.

## 04 · Shorter is not necessarily shortest

**PDF question, pp. 15–16.** In what sense is $L(c_2)$ “good”? It is smaller than $L(c_1)$ for this comparison. **This does not prove it minimises average length across every possible code.**

**Additional counterexample.** Consider the prefix code

$$d(x)=0,\qquad d(y)=10,\qquad d(z)=11.$$

It is uniquely decodable, and

$$L(d)=\frac12\cdot1+\frac14\cdot2+\frac14\cdot2=\frac32=1{,}5.$$

Therefore $L(d)<L(c_2)$. We have found an admissible code with a smaller average, so $c_2$ is not optimal. Proving a code **globally optimal** requires a further argument, not given in these slides.

**Guiding idea from the PDF, p. 16.** Use short codewords for common symbols and longer ones for rare symbols, without sacrificing unique decodability.

## Check your understanding — with answers

1. **Question.** Probabilities $(1/2,1/2)$ and lengths $(1,3)$: find $L$. **Answer.** $L=2$.
2. **Question.** For $(3/4,1/4)$ and lengths $(1,2)$: find $L$. **Answer.** $3/4+1/2=5/4=1{,}25$.
3. **Question.** Why does $L(c_1)=9/4$ not make $c_1$ acceptable? **Answer.** It is ambiguous: $c_1(x)=c_1(zy)$.
4. **Question.** Can average length $1{,}75$ be improved here? **Answer.** Yes; the prefix code $d$ achieves $1{,}5$.
5. **Question.** Does reducing the average guarantee confidentiality? **Answer.** No; length, decodability and secrecy are separate properties.

**Next.** T06 connects probabilities to information.
