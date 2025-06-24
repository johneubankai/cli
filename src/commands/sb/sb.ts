import { Command } from 'commander';
import { BaseCommand } from '../base';

export class SbCommand extends BaseCommand {
  name = 'sb';
  description = 'Supabase management commands';

  protected configureOptions(_command: Command): void {
    // This is a parent command that groups subcommands
  }

  async execute(): Promise<void> {
    // This will be handled by commander.js to show help
    this.logger.info('Available commands:');
    this.logger.info('  jx sb link              - Link to a Supabase project');
    this.logger.info('  jx sb db push           - Push database migrations');
    this.logger.info('  jx sb functions list    - List edge functions');
    this.logger.info('  jx sb functions deploy  - Deploy edge functions');
  }
}
