import { Command } from 'commander';
import { SlackCommand } from './base';

export class SlackLoginCommand extends SlackCommand {
  name = 'login';
  description = 'Log in to Slack via Slack CLI (authenticates CLI with workspace)';

  protected configureOptions(command: Command): void {
    command
      .option('-w, --workspace <workspace>', 'Specific workspace to log in to')
      .option('-t, --team <team>', 'Team ID to authenticate with')
      .option('--no-browser', 'Skip opening a browser for authentication');
  }

  async execute(options: any): Promise<void> {
    const slackArgs = ['login'];

    // Add options
    if (options.workspace) slackArgs.push('--workspace', options.workspace);
    if (options.team) slackArgs.push('--team', options.team);
    if (options.noBrowser === false) slackArgs.push('--no-browser');

    await this.executeSlackCommand(slackArgs);
  }
}
