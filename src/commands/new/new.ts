import { Command } from 'commander';
import { BaseCommand } from '../base';

export class NewCommand extends BaseCommand {
  name = 'new';
  description = 'Create new resources (tasks, etc.)';

  protected configureOptions(_command: Command): void {
    // Parent command doesn't need options
  }

  async execute(): Promise<void> {
    // This is just a parent command, actual work is done in subcommands
    this.logger.info('Please specify a resource type to create');
    this.logger.info('Available commands:');
    this.logger.info('  jx new task <content>  - Add a new task to the public tasks queue');
  }
}