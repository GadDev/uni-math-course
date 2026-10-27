# From messages to bits

*Chapter 04 · Sequence T01 · Source: PDF pp. 2–6 · Unpublished draft.*

## Objectives and prerequisites

After this sequence you should be able to: (1) describe sender, channel and receiver; (2) distinguish a message from its transmission format; (3) define a bit; (4) count binary strings of a fixed length; (5) encode and decode text under a stated convention; (6) identify what transmission alone does not guarantee.

Prerequisites: counting possibilities and reading a function. We work with finite strings of symbols.

## 01 · Why encode information?

**Source motivation, p. 2.** The Perseverance rover and the first image after its arrival on Mars motivate a question: how does an image travel such a distance? Page 3 draws the conceptual chain **sender → channel → receiver**. Both endpoints need to agree how the data is represented.

A message might be text, an image, audio or video. A **bit** is one symbol of the binary alphabet $T=\{0,1\}$. A binary string is a word over that alphabet; it does not intrinsically mean an image or a letter. **An encoding is a convention**, and a decoder must know that convention.

**Check.** Does a sequence of eight bits guarantee which letter it represents? No: the rule translating bits into characters is required.

## 02 · How many binary messages?

**Additional teaching example.** With exactly three bits, each position has two choices, giving $2^3=8$ strings: $000,001,010,011,100,101,110,111$.

For exactly $n$ binary positions there are $2^n$ words, for $n\in\mathbb N$ (and $0\in\mathbb N$ in this course). For $n=0$ there is just the empty word $\varepsilon$. Be careful: length **exactly** $n$ is different from length **at most** $n$.

**Worked example.** Eight states can be represented using three fixed-length bits since $2^3=8$. Nine states cannot be represented by three bits; four bits offer $2^4=16$ distinct strings.

## 03 · The “Hello World” exercise

**PDF question, p. 6.** Encode “Hello World” in binary and explain the decoding procedure. The PDF does not specify a character encoding, so it does not impose **one** unique binary answer.

**Additional worked solution with an explicit convention.** Choose UTF-8: each of the eleven characters of “Hello World”, including the space, belongs here to ASCII and occupies one byte. Hence the result has $11\times8=88$ bits:

| Character | UTF-8 bits |
| --- | --- |
| H | $01001000$ |
| e | $01100101$ |
| l | $01101100$ |
| o | $01101111$ |
| space | $00100000$ |
| W | $01010111$ |
| r | $01110010$ |
| d | $01100100$ |

Keeping the repetitions in order gives:

$01001000\,01100101\,01101100\,01101100\,01101111\,00100000\,01010111\,01101111\,01110010\,01101100\,01100100$.

To decode: split these bits into bytes, interpret each byte according to UTF-8, and restore the characters in order. Byte splitting works here because every character uses one byte; **UTF-8 does not always use one byte per character**.

## 04 · Transmission has several separate challenges

**PDF, p. 3.** The listed challenges include data and transmission formats, security, error correction and energy efficiency. These are distinct tasks. A code that shortens a message is not automatically encrypted or error-correcting.

**Common mistake.** Thinking “binary” means “secret”: a message written using $0$ and $1$ may be entirely readable to anyone who knows the decoding convention.

## Check your understanding — with answers

1. **Question.** How many four-bit strings are there? **Answer.** $2^4=16$.
2. **Question.** Can three fixed-length bits encode seven distinct states? **Answer.** Yes; eight codewords are available, leaving one unused.
3. **Question.** Must an image and a text with the same bits mean the same thing? **Answer.** No; their formats define how to interpret the bits.
4. **Question.** If one bit changes in transit, will the text encoding necessarily detect it? **Answer.** No; additional error-detection or correction mechanisms are required.

**Next.** T02 defines source alphabets and encoding functions.