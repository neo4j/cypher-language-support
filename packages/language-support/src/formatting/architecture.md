# Cypher formatter architecture
This document outlines the architecture of the Cypher formatter contained in this directory.
It is heavily inspired by dartfmt, scalafmt, and the Prettier paper. Links (in order of importance):
- [dartfmt blog post](https://journal.stuffwithstuff.com/2015/09/08/the-hardest-program-ive-ever-written/)
- [scalafmt thesis](https://geirsson.com/assets/olafur.geirsson-scalafmt-thesis.pdf)
- [Prettier paper](https://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf)

It is recommended that you skim at least the dartfmt blog post before diving deeper into how this formatter works. The 
scalafmt paper is also very informative, and has inspired many choices in this formatter. It is not necessarily essential to read, but it's recommended that you skim its data structures section.
The Prettier paper is not at all essential for understanding the architecture, though it gives a good 
background on the theory behind formatting.

## High-level overview of the flow from query -> formatted query
1. The cypher formatter parses cypher queries into an AST using the ANTLR parser. 
2. The AST is converted into a weighted graph, where each node represents some point in the query, and each edge represents either inserting a space or a 
newline. 
    - Newlines are penalized as we try to fit as much on each line as possible, but the formatter tries to keep each line within 80 characters.
         - We always prefer a solution that fits everything within 80 characters to one that doesn't, regardless of how many newlines it has.
3. Through a best-first search over the solution space, it finds the "optimal" solution, where solutions are better if they split lines as infrequently as possible, and avoid doing so within semantically related constructs.

## Internal formatting types
The formatter uses a handful of data structures to achieve the above steps. Understanding the data structures is a key part of understanding
the overall architecture.

### Chunk
A chunk is similar to ANTLR Tokens, but differs in the following ways
1. A chunk can consist of multiple tokens, if those tokens should always be kept together.
An example would be the opening parenthesis of a function call, e.g. `function()`; `function(` would become one chunk,
since these tokens should never be separated.
2. A chunk can represent the start or end of a group or indentation
    - This is not ideal and will likely be moved away from in the future.
3. A chunk embeds information about the possible splitting characters that can follow it. For instance, we never want
to split a line after `WHERE`, and so we encode that in the chunk for `WHERE`.

### Group
A group represents a collection of chunks that are semantically related. For instance, a group might contain all of the 
arguments in a function call, a node pattern, or nested groups. Groups are used to penalize the formatter for splitting within 
semantically related constructs, where the more nested the group, the higher the penalty for splitting within it.

Groups are also used to ensure that we align things correctly vertically after splitting. 
For instance, if we split this where clause on the `,` the `b = 1` part should align with the `a = 1` above. This is achieved by remembering where the outermost group started (which was at `a = 1`)
```cypher
// Unsplit
WHERE a = 1, b = 1

// Groups visualized
WHERE [[a = 1,] [b = 1]]

// Split, aligned on the outer group.
WHERE a = 1,
      b = 1
```

### Choice
A choice represents the possible ways the gap between two chunks can be filled. The most common choice would be between
inserting a space or inserting a newline, though in some cases the choice might be limited to just one option. The possible
split choices in a Choice are what eventually become the weighted edges in the graph we perform a best-first search over.

### Decision
A decision is a Choice that has chosen one of the possible splits. Like a Choice, it has a left and a right chunk. It also
contains the alignment for a split, enforced by either INDENT and DEDENT chunks or groups.

Decisions are what eventually give us our final solution; we simply go through all of our decisions, add the text of the left
chunk to the output, and then add the split that was chosen to the output.

### State
A state represents a node in the graph we perform a best-first search over, and is also what we store in the heap that sorts possible solutions (best first).

#### StateEdge
A StateEdge represents an edge to the previous state that lead to this state. It is used to reconstruct the path
we took to land on this solution (Think of a "prev" pointer in a BFS for reconstructing the shortest path).



## Diagram of the flow from query -> formatted query
![Flow diagram](./architecture.png)
