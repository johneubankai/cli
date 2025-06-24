import { Command } from 'commander';
import { SlackCommand } from './base';

export class SlackCreateCommand extends SlackCommand {
  name = 'create';
  description = 'Create a new Slack app project (scaffold app)';

  protected configureOptions(command: Command): void {
    command
      .argument('[app-name]', 'Name of the app to create')
      .option('-t, --template <template>', 'Template to use for the app')
      .option('-d, --directory <directory>', 'Directory to create the app in')
      .option('--typescript', 'Use TypeScript template')
      .option('--javascript', 'Use JavaScript template')
      .option('--bolt', 'Use Bolt framework')
      .option('--deno', 'Use Deno runtime');
  }

  async execute(options: any, command?: Command): Promise<void> {
    const appName = command?.args[0];
    const slackArgs = ['create'];

    // Add app name if provided
    if (appName) slackArgs.push(appName);

    // Add options
    if (options.template) slackArgs.push('--template', options.template);
    if (options.directory) slackArgs.push('--directory', options.directory);
    if (options.typescript) slackArgs.push('--typescript');
    if (options.javascript) slackArgs.push('--javascript');
    if (options.bolt) slackArgs.push('--bolt');
    if (options.deno) slackArgs.push('--deno');

    await this.executeSlackCommand(slackArgs);
  }
}
