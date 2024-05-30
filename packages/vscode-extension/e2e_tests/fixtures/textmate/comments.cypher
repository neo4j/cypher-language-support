/* This is a 
multiline comment
*/
MATCH (u1:CommerceUser), (u2: CommerceUser)
WHERE u1 <> u2
// This is a single line comment
RETURN relsDate, nodes
/* Another multiline
comment */
LIMIT $limit