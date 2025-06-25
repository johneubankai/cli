import { Command } from 'commander';
import { BaseCommand } from '../base';

export abstract class NewSubCommand extends BaseCommand {
  abstract parentCommand: string;
  aliases?: string[];
  
  register(program: Command): void {
    const parentCmd = program.commands.find((cmd) => cmd.name() === this.parentCommand);
    
    if (!parentCmd) {
      throw new Error(`Parent command "${this.parentCommand}" not found`);
    }

    const subCmd = parentCmd
      .command(this.name)
      .description(this.description);

    if (this.aliases) {
      subCmd.aliases(this.aliases);
    }

    this.configureOptions(subCmd);

    subCmd.action(async (options) => {
      try {
        await this.execute(options, subCmd);
      } catch (error) {
        this.logger.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    });
  }
}