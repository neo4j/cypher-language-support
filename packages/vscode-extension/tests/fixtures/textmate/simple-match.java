String a = """//cypher
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
"""

String b = """/* cypher */
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
"""

String c = "/*cypher*/ MATCH (n:Label) RETURN function(n.property)"

// This one shouldn't highglight
String d = "//cypher MATCH (n:Label) RETURN function(n.property)"