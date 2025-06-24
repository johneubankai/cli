import { Command } from 'commander';
import { BaseCommand } from '../base';

export class LogoutCommand extends BaseCommand {
  name = 'logout';
  description = 'Log out of your JX account';

  protected configureOptions(_command: Command): void {
    // No options for logout
  }

  async execute(): Promise<void> {
    const spinner = this.logger.spinner('Logging out...');

    try {
      await this.config.clearAuth();
      spinner.succeed('Successfully logged out!');
    } catch (error) {
      spinner.fail('Logout failed');
      throw error;
    }
  }
}
