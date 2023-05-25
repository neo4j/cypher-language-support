ANTLR_JAR_FILE=/usr/local/lib/antlr4-tool.jar
GRAMMAR_DIR=${PWD}/tests
DOCKER_IMG=any0ne22/antlr4:4.13.0
JAVA_ARGS="-Xmx500M -cp ${ANTLR_JAR_FILE} org.antlr.v4.Tool -Dlanguage=TypeScript"
DOCKER_ARGS="run --rm -u $(id -u ${USER}):$(id -g ${USER}) -v ${GRAMMAR_DIR}:/work ${DOCKER_IMG} java ${JAVA_ARGS} "

docker ${DOCKER_ARGS} -no-listener -no-visitor CPP14.g4 Expr.g4 Whitebox.g4 -o /work/generated -Xexact-output-dir
