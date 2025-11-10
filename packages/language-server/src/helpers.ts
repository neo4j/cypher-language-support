/**Checks if we should bail on the job, which would be if we have only typed a letter/number/underscore */
export function shouldBail(query: string, oldQuery: string) {
  //Trying to determine if we typed in a single character or copy-pasted, and if single char, if this new char is a non number/letter

  let shouldBail = false;
  if (query.length === oldQuery.length + 1) {
    let newCharCandidateIndex: number = undefined;
    for (let i = 0; i < oldQuery.length; i++) {
      //if we just consider typing, we only have 1 diff, the inserted symbol
      //if diff, the symbol was inserted into newquery here, if we never do the new symbol is the last
      //if we copypaste, we could do to equally long -> in that case, removing the first diff symbol would not yield
      //the same query
      if (query[i] != oldQuery[i]) {
        newCharCandidateIndex = i;
        break;
      }
    }
    newCharCandidateIndex = newCharCandidateIndex ?? query.length - 1;
    const oldifiedNewQuery =
      query.slice(0, newCharCandidateIndex) +
      query.slice(newCharCandidateIndex + 1, query.length);
    if (oldifiedNewQuery === oldQuery) {
      const newChar = query[newCharCandidateIndex];
      const letterOrNumber = /^\w/;
      const isLetterOrNumber = newChar.match(letterOrNumber);
      if (isLetterOrNumber) {
        shouldBail = true;
      }
    }
  }
  return shouldBail;
}
