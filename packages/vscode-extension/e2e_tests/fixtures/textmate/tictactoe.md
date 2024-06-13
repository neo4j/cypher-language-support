# Tic tac toe

```cypher
CALL {
  CALL {
      UNWIND range(1,4) AS direction
      MATCH p = (start:Cell)(()-[r WHERE r.direction = direction]->()){4}(end)
      OPTIONAL MATCH (before_start)-[r0]->(start)
          WHERE r0.direction = direction
      OPTIONAL MATCH (end)-[r5]->(after_end)
          WHERE r5.direction = direction
      RETURN p, before_start, start, end, after_end, direction
  } // -- all valid paths

  WITH *
      WHERE all(node IN nodes(p) WHERE node.state IS NULL OR node.state = $symbol) OR 
            all(node IN nodes(p) WHERE node.state IS NULL OR node.state <> $symbol) // -- exclude all paths that include both symbols since they cannot lead to victory

  WITH *,
      CASE
      WHEN before_start IS NOT NULL AND before_start.state IS NULL AND end.state IS NULL THEN 1
      WHEN start.state IS NULL AND after_end IS NOT NULL AND after_end.state IS NULL THEN 2
      ELSE 0
      END AS openEnded

  WITH *, 
      size([node IN nodes(p) WHERE node.state = $symbol]) AS myScore, 
      size([node IN nodes(p) WHERE node.state <> $symbol]) AS otherScore
      // -- the two size filters above are enough, since any path including both symbols have already been excluded above

  UNWIND nodes(p) AS candidate 
  WITH * WHERE candidate.state IS NULL

  WITH *,
  CASE
      WHEN myScore = 4 THEN 2
      WHEN otherScore = 4 THEN 1
      ELSE 0
  END AS isWinningMove, // -- 2 means it is my win, 1 means that opponent could win in next move
  CASE
      WHEN myScore = 3 AND ((openEnded = 1 AND candidate <> end) OR (openEnded = 2 AND candidate <> start)) THEN 2     
      WHEN otherScore = 3 AND ((openEnded = 1 AND candidate <> end) OR (openEnded = 2 AND candidate <> start)) THEN 1
      ELSE 0
  END AS isThreeWinningMove,  
  CASE
      WHEN myScore = 3 THEN 1
      ELSE 0
  END AS isMyThreeMove,
  CASE
      WHEN otherScore = 3 THEN 1
      ELSE 0
  END AS isOtherThreeMove, 
  CASE
      WHEN myScore = 2 AND ((openEnded = 1 AND candidate <> end) OR (openEnded = 2 AND candidate <> start)) THEN 1
      ELSE 0
  END AS isMyTwoMove,
  CASE
      WHEN otherScore = 2 AND ((openEnded = 1 AND candidate <> end) OR (openEnded = 2 AND candidate <> start)) THEN 1
      ELSE 0
  END AS isOtherTwoMove

  WITH candidate, 
      direction,
      max(isWinningMove) AS maxIsWinningMove,
      max(isThreeWinningMove) AS maxIsThreeWinningMove,
      max(isMyThreeMove) AS maxIsMyThreeMove,
      max(isOtherThreeMove) AS maxIsOtherThreeMove,
      max(isMyTwoMove) AS maxIsMyTwoMove,
      max(isOtherTwoMove) AS maxIsOtherTwoMove,
      sum((myScore + otherScore + toInteger(openEnded > 0))) AS candidateScore // -- give an additional point for open-ended paths, as a heuristic

  WITH candidate, 
      sum(maxIsWinningMove) AS isWinningMove,
      sum(maxIsThreeWinningMove) AS isThreeWinningMove,
      sum(maxIsMyThreeMove) AS isMyThreeMoveSum,
      sum(maxIsOtherThreeMove) AS isOtherThreeMoveSum,
      sum(maxIsMyTwoMove) AS isMyTwoMoveSum,
      sum(maxIsOtherTwoMove) AS isOtherTwoMoveSum,
      sum(candidateScore) + count(*) AS score // -- give one point extra for each direction that a candidate advances play in, as a heuristic

  WITH *,
  CASE
      WHEN isMyThreeMoveSum >= 2 THEN 2
      WHEN isOtherThreeMoveSum >= 2 THEN 1
      WHEN isMyThreeMoveSum > 0 AND isMyTwoMoveSum > 0 THEN 2
      WHEN isOtherThreeMoveSum > 0 AND isOtherTwoMoveSum > 0 THEN 1
      WHEN isMyTwoMoveSum  >= 2 THEN 2
      WHEN isOtherTwoMoveSum  >= 2 THEN 1
      ELSE 0
  END AS isFork

  WITH * ORDER BY isWinningMove DESC, isThreeWinningMove DESC, isFork DESC, score DESC 
  LIMIT 1
  RETURN candidate, isWinningMove
  
  UNION 

  // -- When the game will for sure end in a tie we still need to update the game

  MATCH (candidate) WHERE candidate.state IS NULL
  RETURN candidate, -1 AS isWinningMove LIMIT 1
}

WITH * ORDER BY isWinningMove DESC
LIMIT 1

SET candidate.state = $symbol
```
