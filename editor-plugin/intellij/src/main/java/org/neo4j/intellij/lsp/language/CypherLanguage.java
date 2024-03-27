package org.neo4j.intellij.lsp.language;

import com.intellij.lang.Language;

public class CypherLanguage extends Language {

    public static final CypherLanguage INSTANCE = new CypherLanguage();
    private CypherLanguage() {
        super("Cypher");
    }
}
