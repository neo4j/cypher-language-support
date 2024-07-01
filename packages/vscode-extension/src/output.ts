import * as vscode from 'vscode';

export default class OutputChannel {
  private static channel = vscode.window.createOutputChannel('Neo4j');

  public static append(value: string) {
    // OutputChannel.channel.show(true);
    OutputChannel.channel.appendLine(value);
  }

  public static show() {
    OutputChannel.channel.show(true);
  }
}
