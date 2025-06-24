import { SubCommand } from '../subcommand';
import { Command } from 'commander';
import { execSync } from 'child_process';

export class FlyLoginCommand extends SubCommand {
  parentCommand = 'fly';
  name = 'login';
  description = 'Login to Fly.io';

  protected configureOptions(_command: Command): void {
    // No additional options
  }

  async execute(): Promise<void> {
    const spinner = this.logger.spinner('Logging in to Fly.io...');

    try {
      // Check if fly CLI is installed
      try {
        execSync('fly version', { stdio: 'ignore' });
      } catch {
        spinner.fail('Fly CLI is not installed');
        this.logger.error('Please install the Fly CLI from https://fly.io/docs/hands-on/install-flyctl/');
        process.exit(1);
      }

      spinner.stop();
      
      // Execute fly auth login
      this.logger.info('Opening browser for Fly.io authentication...');
      execSync('fly auth login', { stdio: 'inherit' });
      
      this.logger.success('Successfully logged in to Fly.io!');
    } catch (error) {
      spinner.fail('Failed to login to Fly.io');
      throw error;
    }
  }
}
