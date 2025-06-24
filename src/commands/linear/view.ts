import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { spawn } from 'child_process';

interface LinearViewOptions {
  web?: boolean;
  app?: boolean;
  id?: boolean;
  title?: boolean;
  url?: boolean;
}

export class LinearViewCommand extends SubCommand {
  parentCommand = 'linear';
  name = 'view';
  description = 'View issue details (Linear) by ID';

  protected configureOptions(command: Command): void {
    command
      .argument('[issue-id]', 'Issue ID (e.g., ABC-123)')
      .option('-w, --web', 'Open issue in web browser')
      .option('-a, --app', 'Open issue in Linear.app')
      .option('--id', 'Print just the issue ID')
      .option('--title', 'Print just the issue title')
      .option('--url', 'Print the Linear.app URL for the issue');
  }

  async execute(options: LinearViewOptions, command?: Command): Promise<void> {
    const issueId = command?.args[0];
    
    // Check for API key
    const apiKey = process.env.LINEAR_API_KEY;
    if (!apiKey) {
      this.logger.error('Linear API key not found');
      this.logger.info('Please run "jx linear init" first or set LINEAR_API_KEY environment variable');
      return;
    }

    try {
      // Build linear command
      const linearArgs = ['issue'];
      
      // Handle different view modes
      if (options.id) {
        linearArgs.push('id');
      } else if (options.title) {
        linearArgs.push('title');
      } else if (options.url) {
        linearArgs.push('url');
      } else {
        linearArgs.push('view');
        if (issueId) {
          // For specific issue viewing, we might need to handle this differently
          // as the schpet/linear-cli works with branch names
          this.logger.warn('Note: Linear CLI works best when your git branch includes the issue ID');
          this.logger.info(`Looking for issue: ${issueId}`);
        }
      }
      
      if (options.web) {
        linearArgs.push('-w');
      }
      
      if (options.app) {
        linearArgs.push('-a');
      }

      // Execute linear command
      const linearProcess = spawn('linear', linearArgs, {
        stdio: 'inherit',
        env: process.env
      });

      linearProcess.on('error', (error) => {
        this.logger.error(`Failed to view Linear issue: ${error.message}`);
        this.logger.info('Please ensure Linear CLI is installed: jx linear init');
        
        // Provide helpful context
        if (!issueId) {
          this.logger.info('Tip: Linear CLI detects issues from your git branch name');
          this.logger.info('Use branches like: feature/ABC-123-my-feature');
        }
        
        process.exit(1);
      });

      linearProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          this.logger.error(`Linear view exited with code ${code}`);
          
          // Provide helpful guidance
          if (!issueId) {
            this.logger.info('\nTip: To view a specific issue:');
            this.logger.info('  1. Checkout a branch with the issue ID (e.g., git checkout -b fix/ABC-123)');
            this.logger.info('  2. Or open Linear directly: jx linear list -w');
          }
          
          process.exit(code);
        }
      });

    } catch (error) {
      this.logger.error('Failed to view Linear issue');
      throw error;
    }
  }
}
