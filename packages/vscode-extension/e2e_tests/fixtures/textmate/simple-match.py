a = """//cypher
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
"""

b = """/* cypher */
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
"""

d = '''//cypher
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
'''

d = '''/* cypher */
    // This is a comment
    MATCH (n:Label) RETURN function(n.property)
'''