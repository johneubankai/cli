import { Command } from 'commander';
import { SlackCommand } from './base';

export class SlackRunCommand extends SlackCommand {
  name = 'run';
  description = 'Start a local Slack app dev server (for testing)';

  protected configureOptions(command: Command): void {
    command
      .option('-p, --port <port>', 'Port to run the dev server on')
      .option('-w, --workspace <workspace>', 'Workspace to run the app in')
      .option('-e, --env <env>', 'Environment file to use')
      .option('--local', 'Run in local development mode')
      .option('--debug', 'Enable debug logging')
      .option('--no-watch', 'Disable file watching');
  }

  async execute(options: any): Promise<void> {
    const slackArgs = ['run'];

    // Add options
    if (options.port) slackArgs.push('--port', options.port);
    if (options.workspace) slackArgs.push('--workspace', options.workspace);
    if (options.env) slackArgs.push('--env', options.env);
    if (options.local) slackArgs.push('--local');
    if (options.debug) slackArgs.push('--debug');
    if (options.noWatch === false) slackArgs.push('--no-watch');

    await this.executeSlackCommand(slackArgs);
  }
}
