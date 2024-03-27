package org.neo4j.intellij.lsp.language;

import com.intellij.openapi.fileTypes.LanguageFileType;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import javax.swing.*;

public final class CypherFileType extends LanguageFileType {

  public static final CypherFileType INSTANCE = new CypherFileType();

  private CypherFileType() {
    super(CypherLanguage.INSTANCE);
  }

  @NotNull
  @Override
  public String getName() {
    return "Cypher File";
  }

  @NotNull
  @Override
  public String getDescription() {
    return "Cypher language file";
  }

  @NotNull
  @Override
  public String getDefaultExtension() {
    return "cypher";
  }

  @Nullable
  @Override
  public Icon getIcon() {
    return CypherIcons.FILE;
  }

}