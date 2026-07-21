import { commands, env, Uri, window, workspace } from 'vscode';
import { CONSTANTS } from '../constants';

type McpServerConfig = {
  type: 'http';
  url: string;
};

type McpJson = {
  servers?: Record<string, McpServerConfig>;
};

/**
 * Adds the GraphAcademy MCP server to the workspace `.vscode/mcp.json` file,
 * creating or merging the file as needed. This matches the configuration
 * documented for VS Code, where MCP servers live under a top level `servers`
 * key.
 *
 * If there is no open workspace folder, or the existing file cannot be parsed
 * (e.g. it contains comments), the configuration is copied to the clipboard and
 * the user is guided to add it manually.
 */
export async function addGraphAcademyMcpServer(): Promise<void> {
  const serverName = CONSTANTS.MCP.GRAPHACADEMY_SERVER_NAME;
  const serverConfig: McpServerConfig = {
    type: 'http',
    url: CONSTANTS.MCP.GRAPHACADEMY_SERVER_URL,
  };

  const workspaceFolder = workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    await copyConfigToClipboard(serverName, serverConfig);
    void window.showInformationMessage(
      `Open a folder to add the '${serverName}' MCP server to .vscode/mcp.json. The configuration has been copied to your clipboard.`,
    );
    return;
  }

  const mcpUri = Uri.joinPath(workspaceFolder.uri, '.vscode', 'mcp.json');

  let existingText: string | undefined;
  try {
    const bytes = await workspace.fs.readFile(mcpUri);
    existingText = new TextDecoder().decode(bytes).trim();
  } catch {
    // File does not exist yet, we will create it.
    existingText = undefined;
  }

  let config: McpJson = {};
  if (existingText) {
    try {
      config = JSON.parse(existingText) as McpJson;
    } catch {
      // The file exists but isn't plain JSON (e.g. it has comments). Rather
      // than risk clobbering it, open it and let the user paste the entry.
      await copyConfigToClipboard(serverName, serverConfig);
      await commands.executeCommand('vscode.open', mcpUri);
      void window.showWarningMessage(
        `Couldn't automatically update mcp.json. Add the '${serverName}' server entry manually — it has been copied to your clipboard.`,
      );
      return;
    }
  }

  config.servers ??= {};
  if (config.servers[serverName]) {
    // Already configured — open the file so the user can start the server.
    await commands.executeCommand('vscode.open', mcpUri);
    void window.showInformationMessage(
      `The '${serverName}' MCP server is already configured in this workspace.`,
    );
    return;
  }

  config.servers[serverName] = serverConfig;
  await workspace.fs.writeFile(
    mcpUri,
    new TextEncoder().encode(JSON.stringify(config, null, 2)),
  );

  // Open mcp.json so the "Start" action shown above the server entry is one
  // click away. VS Code does not expose an API to start a server for us.
  await commands.executeCommand('vscode.open', mcpUri);
  void window.showInformationMessage(
    `Added the '${serverName}' MCP server to .vscode/mcp.json. Click "Start" above the server entry to begin using it.`,
  );
}

async function copyConfigToClipboard(
  serverName: string,
  serverConfig: McpServerConfig,
): Promise<void> {
  const snippet = JSON.stringify(
    { servers: { [serverName]: serverConfig } },
    null,
    2,
  );
  await env.clipboard.writeText(snippet);
}
