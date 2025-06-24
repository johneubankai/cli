import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { spawn } from 'child_process';

interface LinearCreateOptions {
  title?: string;
  description?: string;
  assignee?: string;
  priority?: number;
  team?: string;
  project?: string;
  label?: string[];
  estimate?: number;
}

export class LinearCreateCommand extends SubCommand {
  parentCommand = 'linear';
  name = 'create';
  description = 'Create a new Linear issue';

  protected configureOptions(command: Command): void {
    command
      .option('-t, --title <title>', 'Issue title')
      .option('-d, --description <desc>', 'Issue description')
      .option('-a, --assignee <assignee>', 'Assignee (user ID or email)')
      .option('-p, --priority <priority>', 'Priority (0-4, where 0=No priority, 1=Urgent, 4=Low)')
      .option('--team <team>', 'Team ID')
      .option('--project <project>', 'Project ID')
      .option('-l, --label <labels...>', 'Labels to add')
      .option('-e, --estimate <estimate>', 'Estimate (in points)');
  }

  async execute(options: LinearCreateOptions): Promise<void> {
    // Check for API key
    const apiKey = process.env.LINEAR_API_KEY;
    if (!apiKey) {
      this.logger.error('Linear API key not found');
      this.logger.info('Please run "jx linear init" first or set LINEAR_API_KEY environment variable');
      return;
    }

    // Since the schpet/linear-cli doesn't have a direct create command,
    // we'll need to use the Linear API directly or suggest using the web UI
    this.logger.info('Creating Linear issue...');
    
    if (!options.title) {
      this.logger.error('Issue title is required (use --title)');
      return;
    }

    // Build a command to open Linear with pre-filled issue
    const linearArgs = ['issue', 'list', '-w'];
    
    this.logger.info('Opening Linear to create a new issue...');
    this.logger.info(`Title: ${options.title}`);
    if (options.description) {
      this.logger.info(`Description: ${options.description}`);
    }
    
    // Note: The schpet/linear-cli focuses on viewing and managing existing issues
    // For creating issues, it's best to use the Linear web UI or API directly
    this.logger.warn('Note: The Linear CLI primarily focuses on viewing and managing existing issues.');
    this.logger.info('For full issue creation with all options, consider:');
    this.logger.info('  1. Using the Linear web interface');
    this.logger.info('  2. Using the Linear API directly');
    this.logger.info('  3. Creating an issue in Linear and then using "jx linear start <issue-id>"');
    
    // Open Linear in web browser to create issue
    const linearProcess = spawn('linear', linearArgs, {
      stdio: 'inherit',
      env: process.env
    });

    linearProcess.on('error', (error) => {
      this.logger.error(`Failed to open Linear: ${error.message}`);
      this.logger.info('Please ensure Linear CLI is installed: jx linear init');
    });

    linearProcess.on('exit', (code) => {
      if (code === 0) {
        this.logger.info('Linear opened in your browser. Create your issue there.');
      }
    });
  }
}
