import { SubCommand } from '../../subcommand';
import { Command } from 'commander';
import inquirer from 'inquirer';
import { EnvironmentTarget } from '../../../types';

interface VercelEnvAddOptions {
  production?: boolean;
  preview?: boolean;
  development?: boolean;
  secret?: boolean;
}

export class VercelEnvAddCommand extends SubCommand {
  parentCommand = 'vercel env';
  name = 'add [key] [value]';
  description = 'Add an environment variable';

  protected configureOptions(command: Command): void {
    command
      .option('--prod, --production', 'Add to production')
      .option('--preview', 'Add to preview')
      .option('--dev, --development', 'Add to development')
      .option('-s, --secret', 'Mark as secret');
  }

  async execute(options: VercelEnvAddOptions, command?: Command): Promise<void> {
    const args = command?.args || [];
    let key = args[0];
    let value = args[1];

    const spinner = this.logger.spinner('Adding environment variable...');

    try {
      const token = await this.config.getAuthToken();
      if (!token) {
        spinner.fail('Not authenticated');
        this.logger.error('Please run "jx login" first');
        process.exit(1);
      }

      spinner.stop();

      // Prompt for key and value if not provided
      if (!key || !value) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'key',
            message: 'Environment variable key:',
            when: !key,
            validate: (input: string) => input.length > 0 || 'Key is required',
          },
          {
            type: options.secret ? 'password' : 'input',
            name: 'value',
            message: 'Environment variable value:',
            when: !value,
            validate: (input: string) => input.length > 0 || 'Value is required',
          },
        ]);

        key = key || answers.key;
        value = value || answers.value;
      }

      const targets: EnvironmentTarget[] = [];
      if (options.production) targets.push('production');
      if (options.preview) targets.push('preview');
      if (options.development) targets.push('development');

      // Default to all if no target specified
      if (targets.length === 0) {
        const targetAnswer = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'targets',
            message: 'Select target environments:',
            choices: ['production', 'preview', 'development'],
            default: ['development'],
          },
        ]);
        targets.push(...targetAnswer.targets);
      }

      spinner.start('Adding environment variable...');

      // Mock adding environment variable
      await new Promise(resolve => setTimeout(resolve, 1000));

      spinner.succeed(`Environment variable "${key}" added successfully!`);
      this.logger.info(`Targets: ${targets.join(', ')}`);
      this.logger.info(`Type: ${options.secret ? 'secret' : 'plain'}`);
    } catch (error) {
      spinner.fail('Failed to add environment variable');
      throw error;
    }
  }
}
