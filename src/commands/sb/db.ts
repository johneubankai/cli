import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { SbDbPushCommand } from './db-push';

export class SbDbCommand extends SubCommand {
  parentCommand = 'sb';
  name = 'db';
  description = 'Manage Supabase database';

  register(program: Command): void {
    // Find parent command
    const parent = program.commands.find(cmd => cmd.name() === this.parentCommand);
    
    if (!parent) {
      throw new Error(`Parent command "${this.parentCommand}" not found`);
    }
    
    const cmd = parent
      .command(this.name)
      .description(this.description);
    
    this.configureOptions(cmd);
    
    // Register the push subcommand
    const pushCmd = new SbDbPushCommand();
    cmd
      .command('push')
      .description(pushCmd.description)
      .option('--project-ref <ref>', 'Override project reference')
      .action(async (options) => {
        try {
          await pushCmd.execute(options);
        } catch (error) {
          this.logger.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          process.exit(1);
        }
      });
    
    cmd.action(async () => {
      try {
        await this.execute();
      } catch (error) {
        this.logger.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    });
  }

  protected configureOptions(_command: Command): void {
    // This is a parent command that groups subcommands
  }

  async execute(): Promise<void> {
    // This will be handled by commander.js to show help
    this.logger.info('Use "jx sb db push" to push migrations');
  }
}
