import { Command } from 'commander';
import { BaseCommand } from './base';
import { execSync, spawn } from 'child_process';

interface CodexOptions {
  model?: string;
  mode?: 'suggest' | 'auto-edit' | 'full-auto';
  provider?: string;
  apiKey?: string;
}

export class CodexCommand extends BaseCommand {
  name = 'codex';
  description = 'OpenAI Codex assistant (CLI) - interactive coding agent (requires OpenAI API key)';

  protected configureOptions(command: Command): void {
    command
      .option('-m, --model <model>', 'Model to use (e.g., o4-mini, o3)', 'o4-mini')
      .option('--mode <mode>', 'Approval mode: suggest, auto-edit, or full-auto', 'suggest')
      .option('--provider <provider>', 'API provider (openai, anthropic, groq, etc.)', 'openai')
      .option('--api-key <key>', 'API key (defaults to environment variable)');
  }

  async execute(options: CodexOptions): Promise<void> {
    const spinner = this.logger.spinner('Checking OpenAI Codex CLI installation...');

    try {
      // Check if codex is installed
      try {
        execSync('which codex', { stdio: 'ignore' });
        spinner.succeed('OpenAI Codex CLI is installed');
      } catch {
        spinner.text = 'Installing OpenAI Codex CLI...';
        try {
          execSync('npm install -g @openai/codex', { stdio: 'pipe' });
          spinner.succeed('OpenAI Codex CLI installed successfully');
        } catch (error) {
          spinner.fail('Failed to install OpenAI Codex CLI');
          this.logger.error('Please install it manually: npm install -g @openai/codex');
          throw error;
        }
      }

      // Check for API key
      const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        spinner.fail('OpenAI API key not found');
        this.logger.error('Please set OPENAI_API_KEY environment variable or use --api-key option');
        this.logger.info('Get your API key from: https://platform.openai.com/api-keys');
        return;
      }

      spinner.stop();
      
      // Build codex command
      const codexArgs = [];
      
      if (options.model) {
        codexArgs.push('-m', options.model);
      }
      
      if (options.mode) {
        codexArgs.push(`--${options.mode}`);
      }
      
      if (options.provider && options.provider !== 'openai') {
        codexArgs.push('--provider', options.provider);
      }

      this.logger.info('Starting OpenAI Codex CLI...');
      this.logger.info('Press CTRL+C to exit');

      // Set environment variables
      const env = { ...process.env };
      if (options.apiKey) {
        env.OPENAI_API_KEY = options.apiKey;
      }

      // Start codex in interactive mode
      const codexProcess = spawn('codex', codexArgs, {
        stdio: 'inherit',
        env
      });

      // Handle process events
      codexProcess.on('error', (error) => {
        this.logger.error(`Failed to start Codex CLI: ${error.message}`);
        process.exit(1);
      });

      codexProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          this.logger.error(`Codex CLI exited with code ${code}`);
          process.exit(code);
        }
      });

      // Handle CTRL+C gracefully
      process.on('SIGINT', () => {
        codexProcess.kill('SIGINT');
        process.exit(0);
      });

    } catch (error) {
      spinner.fail('Failed to run OpenAI Codex CLI');
      throw error;
    }
  }
}
