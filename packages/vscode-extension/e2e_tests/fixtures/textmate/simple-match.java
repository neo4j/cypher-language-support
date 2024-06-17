String a = """//cypher
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
"""

String b = """/* cypher */
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
"""