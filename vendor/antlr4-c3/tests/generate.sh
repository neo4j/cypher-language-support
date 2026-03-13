GRAMMAR_DIR=${PWD}

antlr-ng -Dlanguage=TypeScript \
  -l false -v false \
  -o ${GRAMMAR_DIR}/generated --exact-output-dir \
  -- ${GRAMMAR_DIR}/*.g4
