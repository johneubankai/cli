import { Command } from 'commander';
import { BaseCommand } from './base';
import { execSync, spawn } from 'child_process';

interface MermaidChartOptions {
  action?: 'auth' | 'push' | 'pull' | 'link';
  check?: boolean;
  force?: boolean;
  apiKey?: string;
}

export class MermaidChartCommand extends BaseCommand {
  name = 'mermaidchart';
  description = 'Mermaid Chart service integration - leverages Mermaid Chart (web-based diagram tool by Mermaid team)';

  protected configureOptions(command: Command): void {
    command
      .argument('[files...]', 'Mermaid files to operate on')
      .option('-a, --action <action>', 'Action: auth, push, pull, or link', 'push')
      .option('--check', 'Check if files would be updated (pull only)')
      .option('--force', 'Force operation without confirmation')
      .option('--api-key <key>', 'MermaidChart API key');
  }

  async execute(options: MermaidChartOptions, command?: Command): Promise<void> {
    const files = command?.args || [];
    const action = options.action || 'push';
    
    const spinner = this.logger.spinner('Checking MermaidChart CLI installation...');

    try {
      // Check if @mermaidchart/cli is available
      try {
        execSync('npx @mermaidchart/cli --version', { stdio: 'ignore' });
        spinner.succeed('MermaidChart CLI is available');
      } catch {
        spinner.text = 'Setting up MermaidChart CLI...';
        // npx will automatically download and cache the package
      }

      spinner.stop();

      // Check for API key
      const apiKey = options.apiKey || process.env.MERMAIDCHART_API_KEY;
      
      // Build MermaidChart command
      const mermaidChartArgs = ['@mermaidchart/cli'];
      
      // Handle different actions
      switch (action) {
        case 'auth':
          if (!apiKey) {
            spinner.fail('MermaidChart API key not found');
            this.logger.error('Please provide --api-key or set MERMAIDCHART_API_KEY environment variable');
            this.logger.info('Get your API key from: https://www.mermaidchart.com/app/user/settings');
            return;
          }
          mermaidChartArgs.push('auth');
          break;
          
        case 'push':
          if (files.length === 0) {
            this.logger.error('No files specified for push');
            return;
          }
          mermaidChartArgs.push('push', ...files);
          if (options.force) {
            mermaidChartArgs.push('--force');
          }
          break;
          
        case 'pull':
          if (files.length === 0) {
            this.logger.error('No files specified for pull');
            return;
          }
          mermaidChartArgs.push('pull', ...files);
          if (options.check) {
            mermaidChartArgs.push('--check');
          }
          break;
          
        case 'link':
          if (files.length === 0) {
            this.logger.error('No files specified for link');
            return;
          }
          mermaidChartArgs.push('link', ...files);
          break;
          
        default:
          this.logger.error(`Unknown action: ${action}`);
          return;
      }

      this.logger.info(`Executing MermaidChart ${action}...`);

      // Set environment variables
      const env = { ...process.env };
      if (apiKey) {
        env.MERMAIDCHART_API_KEY = apiKey;
      }

      // Execute MermaidChart command using npx
      const mermaidChartProcess = spawn('npx', mermaidChartArgs, {
        stdio: 'inherit',
        env
      });

      // Handle process events
      mermaidChartProcess.on('error', (error) => {
        this.logger.error(`Failed to run MermaidChart CLI: ${error.message}`);
        process.exit(1);
      });

      mermaidChartProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          this.logger.error(`MermaidChart CLI exited with code ${code}`);
          process.exit(code);
        } else {
          this.logger.success(`MermaidChart ${action} completed successfully!`);
        }
      });

    } catch (error) {
      spinner.fail('Failed to run MermaidChart CLI');
      throw error;
    }
  }
}
