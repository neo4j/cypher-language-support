
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
