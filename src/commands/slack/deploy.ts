import { Command } from 'commander';
import { SlackCommand } from './base';

export class SlackDeployCommand extends SlackCommand {
  name = 'deploy';
  description = 'Deploy the app to the Slack platform (production or staging)';

  protected configureOptions(command: Command): void {
    command
      .option('-w, --workspace <workspace>', 'Workspace to deploy to')
      .option('-e, --environment <environment>', 'Environment to deploy to (production, staging)')
      .option('-f, --force', 'Force deployment without confirmation')
      .option('--prod', 'Deploy to production environment')
      .option('--staging', 'Deploy to staging environment')
      .option('--dry-run', 'Preview deployment without actually deploying');
  }

  async execute(options: any): Promise<void> {
    const slackArgs = ['deploy'];

    // Add options
    if (options.workspace) slackArgs.push('--workspace', options.workspace);
    if (options.environment) slackArgs.push('--environment', options.environment);
    if (options.force) slackArgs.push('--force');
    if (options.prod) slackArgs.push('--prod');
    if (options.staging) slackArgs.push('--staging');
    if (options.dryRun) slackArgs.push('--dry-run');

    await this.executeSlackCommand(slackArgs);
  }
}
