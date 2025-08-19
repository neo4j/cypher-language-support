UNWIND range(1, 3) AS i
CALL (i) {
  UNWIND [1, 2] AS j
  CREATE (n:N {i: i, j: j})
} IN TRANSACTIONS