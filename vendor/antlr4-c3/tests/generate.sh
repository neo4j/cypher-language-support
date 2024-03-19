GRAMMAR_DIR=${PWD}/tests

antlr4 -Dlanguage=TypeScript \
  -no-listener -no-visitor \
  ${GRAMMAR_DIR}/*.g4 \
  -o ${GRAMMAR_DIR}/generated -Xexact-output-dir
