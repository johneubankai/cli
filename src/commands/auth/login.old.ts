import { Command } from 'commander';
import inquirer from 'inquirer';
import { BaseCommand } from '../base';

interface LoginOptions {
  token?: string;
}

export class LoginCommand extends BaseCommand {
  name = 'login';
  description = 'Log in to your JX account';

  protected configureOptions(command: Command): void {
    command.option('-t, --token <token>', 'Authentication token');
  }

  async execute(options: LoginOptions): Promise<void> {
    const spinner = this.logger.spinner('Logging in...');

    try {
      let token = options.token;

      if (!token) {
        spinner.stop();
        const answers = await inquirer.prompt([
          {
            type: 'password',
            name: 'token',
            message: 'Enter your authentication token:',
            validate: (input: string) => input.length > 0 || 'Token is required',
          },
        ]);
        token = answers.token;        spinner.start('Logging in...');
      }

      // In a real implementation, you would validate the token with an API
      await this.config.setAuthToken(token);

      spinner.succeed('Successfully logged in!');
      this.logger.info('Authentication token saved to ~/.jx/config.json');
    } catch (error) {
      spinner.fail('Login failed');
      throw error;
    }
  }
}
