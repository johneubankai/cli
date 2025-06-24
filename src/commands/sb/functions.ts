import { Command } from 'commander';
import { SubCommand } from '../subcommand';

export class SbFunctionsCommand extends SubCommand {
  parentCommand = 'sb';
  name = 'functions';
  description = 'Manage Supabase edge functions';

  protected configureOptions(_command: Command): void {
    // This is a parent command that groups subcommands
  }

  async execute(): Promise<void> {
    // This will be handled by commander.js to show help
    this.logger.info('Available commands:');
    this.logger.info('  jx sb functions list     - List all functions');
    this.logger.info('  jx sb functions deploy   - Deploy a function');
  }
}
