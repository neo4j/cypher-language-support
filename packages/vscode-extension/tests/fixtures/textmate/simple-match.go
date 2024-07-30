package main

var a = `//cypher
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
`

var b = `/* cypher */
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
`

var c = "/*cypher*/ MATCH (n:Label) RETURN function(n.property)"

// This one shouldn't highglight
var d = "//cypher MATCH (n:Label) RETURN function(n.property)"
