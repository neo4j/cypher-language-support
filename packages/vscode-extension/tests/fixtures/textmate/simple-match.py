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

e = "/*cypher*/ MATCH (n:Label) RETURN n"

f = '/*cypher*/ MATCH (n:Label) RETURN n'

# This one shouldn't highlight
g = "//cypher MATCH (n:Label) RETURN n"

# This one shouldn't highlight
h = '//cypher MATCH (n:Label) RETURN n'