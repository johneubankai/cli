import { Command } from 'commander';
import { BaseCommand } from './base';

export abstract class SubCommand extends BaseCommand {
  abstract parentCommand: string;
  
  register(program: Command): void {
    // Find or create parent command
    let parent = program.commands.find(cmd => cmd.name() === this.parentCommand);
    
    if (!parent) {
      parent = program
        .command(this.parentCommand)
        .description(`${this.parentCommand} commands`);
    }
    
    const cmd = parent
      .command(this.name)
      .description(this.description);
    
    this.configureOptions(cmd);
    
    cmd.action(async (options) => {
      try {
        await this.execute(options, cmd);
      } catch (error) {
        this.logger.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    });
  }
}
