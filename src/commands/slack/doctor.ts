import { Command } from 'commander';
import { SlackCommand } from './base';

export class SlackDoctorCommand extends SlackCommand {
  name = 'doctor';
  description = 'Check system and app setup (diagnostics)';

  protected configureOptions(command: Command): void {
    command
      .option('-w, --workspace <workspace>', 'Check specific workspace configuration')
      .option('-v, --verbose', 'Show verbose output')
      .option('--fix', 'Attempt to fix issues automatically')
      .option('--check-auth', 'Check authentication status')
      .option('--check-deps', 'Check dependencies')
      .option('--check-env', 'Check environment setup');
  }

  async execute(options: any): Promise<void> {
    const slackArgs = ['doctor'];

    // Add options
    if (options.workspace) slackArgs.push('--workspace', options.workspace);
    if (options.verbose) slackArgs.push('--verbose');
    if (options.fix) slackArgs.push('--fix');
    if (options.checkAuth) slackArgs.push('--check-auth');
    if (options.checkDeps) slackArgs.push('--check-deps');
    if (options.checkEnv) slackArgs.push('--check-env');

    await this.executeSlackCommand(slackArgs);
  }
}
