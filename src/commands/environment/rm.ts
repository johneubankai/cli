import { Command } from 'commander';
import inquirer from 'inquirer';
import { BaseCommand } from '../base';

interface RemoveOptions {
  yes?: boolean;
}

export class RemoveCommand extends BaseCommand {
  name = 'rm [key]';
  description = 'Remove an environment variable';

  protected configureOptions(command: Command): void {
    command
      .option('-y, --yes', 'Skip confirmation');
  }

  async execute(options: RemoveOptions, command?: Command): Promise<void> {
    const args = command?.args || [];
    let key = args[0];

    const spinner = this.logger.spinner('Removing environment variable...');

    try {
      const token = await this.config.getAuthToken();
      if (!token) {
        spinner.fail('Not authenticated');
        this.logger.error('Please run "jx login" first');
        process.exit(1);
      }

      spinner.stop();

      if (!key) {        const answer = await inquirer.prompt([
          {
            type: 'input',
            name: 'key',
            message: 'Environment variable key to remove:',
            validate: (input: string) => input.length > 0 || 'Key is required',
          },
        ]);
        key = answer.key;
      }

      if (!options.yes) {
        const confirm = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'proceed',
            message: `Are you sure you want to remove "${key}"?`,
            default: false,
          },
        ]);

        if (!confirm.proceed) {
          this.logger.info('Removal cancelled');
          return;
        }
      }

      spinner.start('Removing environment variable...');

      // Mock removing environment variable
      await new Promise(resolve => setTimeout(resolve, 1000));

      spinner.succeed(`Environment variable "${key}" removed successfully!`);    } catch (error) {
      spinner.fail('Failed to remove environment variable');
      throw error;
    }
  }
}
