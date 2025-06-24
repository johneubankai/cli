import { Command } from 'commander';
import { BaseCommand } from './base';
import { execSync, spawn } from 'child_process';

interface ClaudeOptions {
  apiKey?: string;
  bug?: boolean;
}

export class ClaudeCommand extends BaseCommand {
  name = 'claude';
  description = 'Anthropic Claude assistant (CLI) - "agentic" coding tool in terminal (requires Anthropic API key)';

  protected configureOptions(command: Command): void {
    command
      .option('--api-key <key>', 'Anthropic API key (defaults to environment variable)')
      .option('--bug', 'Report a bug within Claude Code');
  }

  async execute(options: ClaudeOptions): Promise<void> {
    const spinner = this.logger.spinner('Checking Claude Code CLI installation...');

    try {
      // Check if claude is installed
      try {
        execSync('which claude', { stdio: 'ignore' });
        spinner.succeed('Claude Code CLI is installed');
      } catch {
        spinner.text = 'Installing Claude Code CLI...';
        try {
          execSync('npm install -g @anthropic-ai/claude-code', { stdio: 'pipe' });
          spinner.succeed('Claude Code CLI installed successfully');
        } catch (error) {
          spinner.fail('Failed to install Claude Code CLI');
          this.logger.error('Please install it manually: npm install -g @anthropic-ai/claude-code');
          throw error;
        }
      }

      // Check for API key (only if not using OAuth)
      const apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;
      
      spinner.stop();
      
      // Build claude command
      const claudeArgs = [];
      
      if (options.bug) {
        claudeArgs.push('/bug');
      }

      this.logger.info('Starting Claude Code CLI...');
      
      if (!apiKey) {
        this.logger.info('No API key provided. Claude Code will use OAuth authentication.');
        this.logger.info('You will be prompted to authenticate with your Anthropic Console account.');
      }
      
      this.logger.info('Press CTRL+C to exit');

      // Set environment variables
      const env = { ...process.env };
      if (options.apiKey) {
        env.ANTHROPIC_API_KEY = options.apiKey;
      }

      // Start claude in interactive mode
      const claudeProcess = spawn('claude', claudeArgs, {
        stdio: 'inherit',
        env,
        cwd: process.cwd()
      });

      // Handle process events
      claudeProcess.on('error', (error) => {
        this.logger.error(`Failed to start Claude Code CLI: ${error.message}`);
        this.logger.info('Make sure you are in a project directory');
        process.exit(1);
      });

      claudeProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          this.logger.error(`Claude Code CLI exited with code ${code}`);
          process.exit(code);
        }
      });

      // Handle CTRL+C gracefully
      process.on('SIGINT', () => {
        claudeProcess.kill('SIGINT');
        process.exit(0);
      });

    } catch (error) {
      spinner.fail('Failed to run Claude Code CLI');
      throw error;
    }
  }
}
