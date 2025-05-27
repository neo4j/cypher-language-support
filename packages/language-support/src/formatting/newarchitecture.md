# cypherfmt - architecture/technical overview
This document provides some context on how the formatter contained in this directory works. It does not have
an explicit name, but we prefer `cypherfmt` to be consistent with the naming of other formatters, and to indicate
that it is the "official one" (by default, since no good alternatives exist).

The formatter was written as a thesis project, and the thesis describing it can be fuond here:
- [An Evaluation of Approaches to Code Formatting](https://lup.lub.lu.se/student-papers/search/publication/9188816)
The thesis project covers some academic elements that are not directly relevant, but understanding the context of how this formatter was developed
might be of interest. It also covers some interesting details about styling preferences and technical details that will
not be covered here.

The formatting algorithm is heavily inspired by the following paper on Pretty printing:
- [Prettier paper](https://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf)

Some names and concepts have also been adopted from the following sources:
- [dartfmt blog post](https://journal.stuffwithstuff.com/2015/09/08/the-hardest-program-ive-ever-written/)
- [scalafmt thesis](https://geirsson.com/assets/olafur.geirsson-scalafmt-thesis.pdf)


Reading any of these sources is generally not necessary in order to understand and start contributing to the formatter.
If you do want to dig deeper into the underlying details, read them in the order they were presented.

## High-level overview of the flow from query -> formatted query
1. The query is parsed into a CST using the ANTLR-generated parser.
2. An ANTLR visitor class walks through the CST (see `formatting.ts`), does some preprocessing (e.g. grouping related constructs), and adds
"simple formatting" (formatting without dynamic line breaks)
3. The processed CST is handed off to the "layout engine" (see `layoutEngine.ts`) which applies the "layout-based" approach to dynamic line breaks,
which, in short, produces formatting output similar to that of the Prettier JS/TS formatter. See the next section for more details.

TODO: architecture image
## Layout engine

