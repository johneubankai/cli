import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { spawn } from 'child_process';

interface LinearListOptions {
  state?: string;
  sort?: string;
  web?: boolean;
  app?: boolean;
  assignee?: string;
  team?: string;
  project?: string;
  limit?: number;
}

export class LinearListCommand extends SubCommand {
  parentCommand = 'linear';
  name = 'list';
  description = 'List Linear issues (open or all issues)';

  protected configureOptions(command: Command): void {
    command
      .option('-s, --state <state>', 'Filter by state (e.g., "In Progress", "Todo")')
      .option('--sort <sort>', 'Sort by field (e.g., "priority", "created", "updated")')
      .option('-w, --web', 'Open issue list in web browser')
      .option('-a, --app', 'Open issue list in Linear.app')
      .option('--assignee <assignee>', 'Filter by assignee')
      .option('--team <team>', 'Filter by team')
      .option('--project <project>', 'Filter by project')
      .option('-l, --limit <limit>', 'Limit number of results', '20');
  }

  async execute(options: LinearListOptions): Promise<void> {
    // Check for API key
    const apiKey = process.env.LINEAR_API_KEY;
    if (!apiKey) {
      this.logger.error('Linear API key not found');
      this.logger.info('Please run "jx linear init" first or set LINEAR_API_KEY environment variable');
      return;
    }

    const spinner = this.logger.spinner('Fetching Linear issues...');

    try {
      // Build linear command
      const linearArgs = ['issue', 'list'];
      
      if (options.state) {
        linearArgs.push('-s', options.state);
      }
      
      if (options.sort) {
        linearArgs.push('--sort', options.sort);
      }
      
      if (options.web) {
        linearArgs.push('-w');
      }
      
      if (options.app) {
        linearArgs.push('-a');
      }

      spinner.stop();

      // Execute linear list command
      const linearProcess = spawn('linear', linearArgs, {
        stdio: 'inherit',
        env: process.env
      });

      linearProcess.on('error', (error) => {
        this.logger.error(`Failed to list Linear issues: ${error.message}`);
        this.logger.info('Please ensure Linear CLI is installed: jx linear init');
        process.exit(1);
      });

      linearProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          this.logger.error(`Linear list exited with code ${code}`);
          process.exit(code);
        }
      });

    } catch (error) {
      spinner.fail('Failed to list Linear issues');
      throw error;
    }
  }
}
