import { Command } from 'commander';
import { SlackCommand } from './base';

export class SlackEnvCommand extends SlackCommand {
  name = 'env';
  description = 'Manage Slack app environment variables (add, list, remove)';

  protected configureOptions(command: Command): void {
    command
      .argument('[subcommand]', 'env subcommand (add, list, remove)')
      .argument('[key]', 'Environment variable key (for add/remove)')
      .argument('[value]', 'Environment variable value (for add)')
      .option('-w, --workspace <workspace>', 'Workspace to manage env vars for')
      .option('-e, --environment <environment>', 'Environment to manage (production, staging, local)')
      .option('-f, --force', 'Force operation without confirmation')
      .option('--secret', 'Mark variable as secret');
  }

  async execute(options: any, command?: Command): Promise<void> {
    const subcommand = command?.args[0] || 'list';
    const key = command?.args[1];
    const value = command?.args[2];
    
    const slackArgs = ['env', subcommand];

    // Add key and value based on subcommand
    if (subcommand === 'add' && key && value) {
      slackArgs.push(key, value);
    } else if (subcommand === 'remove' && key) {
      slackArgs.push(key);
    }

    // Add options
    if (options.workspace) slackArgs.push('--workspace', options.workspace);
    if (options.environment) slackArgs.push('--environment', options.environment);
    if (options.force) slackArgs.push('--force');
    if (options.secret && subcommand === 'add') slackArgs.push('--secret');

    await this.executeSlackCommand(slackArgs);
  }
}
