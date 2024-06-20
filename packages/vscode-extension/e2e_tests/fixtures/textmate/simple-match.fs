let a = "//cypher
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
"

let b = "/* cypher */
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
"

let c = "/*cypher*/ MATCH (n:Label) RETURN function(n.property)"

// This one shouldn't highglight
let d = "//cypher MATCH (n:Label) RETURN function(n.property)"