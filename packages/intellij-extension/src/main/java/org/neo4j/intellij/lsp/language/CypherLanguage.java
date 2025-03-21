package org.neo4j.intellij.lsp.language;

import com.intellij.lang.Language;
import org.jetbrains.annotations.NotNull;

public class CypherLanguage extends Language {
    public static final CypherLanguage INSTANCE = new CypherLanguage();

    private CypherLanguage() {
        super("Cypher");
    }

    @Override
    public @NotNull String getDisplayName() {
        return "Cypher";
    }
}
