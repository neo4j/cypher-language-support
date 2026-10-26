MATCH (n)
CALL () {
  MATCH (n:Person)
  RETURN n AS x
}
RETURN x;