RETURN abs()
CALL apoc.import.csv(nodes, rels, config)
CALL apoc.import.csv(nodes, rels, config, other)