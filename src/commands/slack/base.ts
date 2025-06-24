import { SubCommand } from '../subcommand';
import { execSync, spawn } from 'child_process';

export abstract class SlackCommand extends SubCommand {
  parentCommand = 'slack';

  /**
   * Check if Slack CLI is installed
   */
  protected checkSlackInstalled(): boolean {
    try {
      execSync('slack --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Execute a Slack CLI command
   */
  protected async executeSlackCommand(args: string[]): Promise<void> {
    if (!this.checkSlackInstalled()) {
      this.logger.error('Slack CLI is not installed. Please install it from https://api.slack.com/automation/cli/install');
      process.exit(1);
    }

    return new Promise((resolve, reject) => {
      const slack = spawn('slack', args, {
        stdio: 'inherit',
        shell: true
      });

      slack.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Slack CLI exited with code ${code}`));
        }
      });

      slack.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Parse command options into Slack CLI arguments
   */
  protected buildSlackArgs(command: string, options: Record<string, unknown>): string[] {
    const args = [command];

    // Add flags and options
    Object.entries(options).forEach(([key, value]) => {
      if (value === true) {
        // Boolean flag
        args.push(`--${key}`);
      } else if (value !== undefined && value !== false) {
        // Option with value
        args.push(`--${key}`, String(value));
      }
    });

    return args;
  }
}
