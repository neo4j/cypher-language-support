
const a = /* cypher */`
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
`

const b = /*cypher*/`  
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
`

const c = `//cypher
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
`

const e = `/* cypher */
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
`

const f = `/*cypher*/
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
`

const g = "/*cypher*/ MATCH (n:Label) RETURN function(n.property)"

const h = '/*cypher*/ MATCH (n:Label) RETURN function(n.property)'

// This one shouldn't highglight
const i = "//cypher MATCH (n:Label) RETURN function(n.property)"

// This one shouldn't highglight
const j = '//cypher MATCH (n:Label) RETURN function(n.property)'