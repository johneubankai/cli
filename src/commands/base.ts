import { Command } from 'commander';
import { ConfigManager } from '../utils/config';
import { Logger } from '../utils/logger';

export abstract class BaseCommand {
  protected config = ConfigManager;
  protected logger = Logger;

  abstract name: string;
  abstract description: string;

  abstract execute(options: unknown, command?: Command): Promise<void>;

  register(program: Command): void {
    const cmd = program
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

  protected abstract configureOptions(command: Command): void;
}
