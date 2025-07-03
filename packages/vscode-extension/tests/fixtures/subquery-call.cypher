MATCH (n)
CALL {
  WITH n
  RETURN n AS m
}
RETURN id(m)