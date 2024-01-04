package org.neo4j.intellij.lsp.cypherlspsupport;

import com.intellij.execution.ExecutionException;
import com.intellij.execution.configurations.GeneralCommandLine;
import com.intellij.javascript.nodejs.interpreter.NodeCommandLineConfigurator;
import com.intellij.javascript.nodejs.interpreter.NodeJsInterpreter;
import com.intellij.javascript.nodejs.interpreter.NodeJsInterpreterManager;
import com.intellij.javascript.nodejs.interpreter.local.NodeJsLocalInterpreter;
import com.intellij.javascript.nodejs.interpreter.wsl.WslNodeInterpreter;
import com.intellij.lang.javascript.service.JSLanguageServiceUtil;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.vfs.VirtualFile;
import com.intellij.platform.lsp.api.LspServerSupportProvider;
import com.intellij.platform.lsp.api.ProjectWideLspServerDescriptor;
import org.jetbrains.annotations.NotNull;

import java.io.File;
import java.nio.charset.StandardCharsets;

/**
 *
 * @author Gerrit Meier
 * @author Rob Steward
 */
public class CypherLspServerSupportProvider implements LspServerSupportProvider {
    public void fileOpened(
            Project project,
            VirtualFile file,
            LspServerSupportProvider.LspServerStarter serverStarter
    ) {
        String ext = file.getExtension(); // null when the filename didn't contain a "."
        if (ext != null && ext.equals("cypher")) {
            NodeJsInterpreter node = NodeJsInterpreterManager.getInstance(project).getInterpreter();

            if (node instanceof NodeJsLocalInterpreter || node instanceof WslNodeInterpreter) {
                serverStarter.ensureServerStarted(new CypherLspServerDescriptor(project));
            }
        }
    }

    private class CypherLspServerDescriptor extends ProjectWideLspServerDescriptor {
        private final Project project;

        @Override
        public boolean isSupportedFile(VirtualFile file) {
            return file.getExtension().equals("cypher");
        }

        @Override
        public boolean getLspGoToDefinitionSupport() {
            return false;
        }

        public CypherLspServerDescriptor(Project project) {
            super(project, "Cypher");
            this.project = project;
        }

        @Override
        @NotNull
        public GeneralCommandLine createCommandLine()
                throws ExecutionException {
            NodeJsInterpreter interpreter = NodeJsInterpreterManager.getInstance(this.project).getInterpreter();
            if (!(interpreter instanceof NodeJsLocalInterpreter) && !(interpreter instanceof WslNodeInterpreter)) {
                throw new ExecutionException("Could not find nodeJS interpreter");
            }

            File lsp = JSLanguageServiceUtil.getPluginDirectory(this.getClass(), "cypher-language-server.js");
            if (lsp == null || !lsp.exists()) {
                throw new ExecutionException("Language server not found :(");
            }

            GeneralCommandLine cmd = new GeneralCommandLine()
                    .withParentEnvironmentType(GeneralCommandLine.ParentEnvironmentType.CONSOLE)
                    .withCharset(StandardCharsets.UTF_8);

            cmd.addParameter(lsp.getPath());
            cmd.addParameter("--stdio");

            NodeCommandLineConfigurator.find(interpreter)
                    .configure(cmd, NodeCommandLineConfigurator.defaultOptions(project));

            return cmd;
        }
    }
}
