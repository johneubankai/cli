import { Command } from 'commander';
import { SubCommand } from '../subcommand';

export class SbDbCommand extends SubCommand {
  parentCommand = 'sb';
  name = 'db';
  description = 'Manage Supabase database';

  protected configureOptions(_command: Command): void {
    // This is a parent command that groups subcommands
  }

  async execute(): Promise<void> {
    // This will be handled by commander.js to show help
    this.logger.info('Use "jx sb db push" to push migrations');
  }
}
