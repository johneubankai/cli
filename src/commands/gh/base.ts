import { SubCommand } from '../subcommand';
import { execSync, spawn } from 'child_process';

export abstract class GitHubCommand extends SubCommand {
  parentCommand = 'gh';

  /**
   * Check if GitHub CLI is installed
   */
  protected checkGhInstalled(): boolean {
    try {
      execSync('gh --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Execute a GitHub CLI command
   */
  protected async executeGhCommand(args: string[]): Promise<void> {
    if (!this.checkGhInstalled()) {
      this.logger.error('GitHub CLI (gh) is not installed. Please install it from https://cli.github.com/');
      process.exit(1);
    }

    return new Promise((resolve, reject) => {
      const gh = spawn('gh', args, {
        stdio: 'inherit',
        shell: true
      });

      gh.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`GitHub CLI exited with code ${code}`));
        }
      });

      gh.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Parse command options into gh CLI arguments
   */
  protected buildGhArgs(command: string, subcommand: string, options: Record<string, unknown>): string[] {
    const args = [command, subcommand];

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
