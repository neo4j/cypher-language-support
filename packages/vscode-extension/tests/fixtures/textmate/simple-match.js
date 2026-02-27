
const _a = /* cypher */`
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
`

const _b = /*cypher*/`
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
`

const _c = `//cypher
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
`

const _e = `/* cypher */
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
`

const _f = `/*cypher*/
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
`

const _g = "/*cypher*/ MATCH (n:Label) RETURN function(n.property)"

const _h = '/*cypher*/ MATCH (n:Label) RETURN function(n.property)'

// This one shouldn't highglight
const _i = "//cypher MATCH (n:Label) RETURN function(n.property)"

// This one shouldn't highglight
const _j = '//cypher MATCH (n:Label) RETURN function(n.property)'