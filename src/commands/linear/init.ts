import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface LinearInitOptions {
  apiKey?: string;
  workspace?: string;
  team?: string;
}

export class LinearInitCommand extends SubCommand {
  parentCommand = 'linear';
  name = 'init';
  description = 'Initialize Linear CLI (setup) - set API token and configure workspace';

  protected configureOptions(command: Command): void {
    command
      .option('--api-key <key>', 'Linear API key')
      .option('-w, --workspace <workspace>', 'Linear workspace ID')
      .option('-t, --team <team>', 'Default team ID');
  }

  async execute(options: LinearInitOptions): Promise<void> {
    const spinner = this.logger.spinner('Checking Linear CLI installation...');

    try {
      // Check if linear is installed
      try {
        execSync('which linear', { stdio: 'ignore' });
        spinner.succeed('Linear CLI is installed');
      } catch {
        spinner.text = 'Installing Linear CLI...';
        try {
          // Try to install via deno
          execSync('deno install --allow-env --allow-sys --allow-run --allow-read --allow-net -g -n linear jsr:@schpet/linear-cli', { 
            stdio: 'pipe' 
          });
          spinner.succeed('Linear CLI installed successfully');
        } catch (error) {
          spinner.fail('Failed to install Linear CLI');
          this.logger.error('Please install it manually:');
          this.logger.info('  Using Homebrew: brew install schpet/tap/linear');
          this.logger.info('  Using Deno: deno install --allow-env --allow-sys --allow-run --allow-read --allow-net -g -n linear jsr:@schpet/linear-cli');
          throw error;
        }
      }

      spinner.text = 'Configuring Linear CLI...';

      // Check for API key
      const apiKey = options.apiKey || process.env.LINEAR_API_KEY;
      if (!apiKey) {
        spinner.fail('Linear API key not found');
        this.logger.error('Please provide --api-key or set LINEAR_API_KEY environment variable');
        this.logger.info('Get your API key from: https://linear.app/settings/account/security');
        return;
      }

      // Set environment variable for Linear CLI
      const env = { ...process.env, LINEAR_API_KEY: apiKey };

      // Run linear config command
      spinner.text = 'Running Linear configuration wizard...';
      spinner.stop();

      this.logger.info('Starting Linear configuration...');
      this.logger.info('This will create a .linear.toml config file in your repository');

      // Start linear config in interactive mode
      const linearProcess = spawn('linear', ['config'], {
        stdio: 'inherit',
        env
      });

      // Handle process events
      linearProcess.on('error', (error) => {
        this.logger.error(`Failed to run Linear config: ${error.message}`);
        process.exit(1);
      });

      linearProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          this.logger.error(`Linear config exited with code ${code}`);
          process.exit(code);
        } else {
          this.logger.success('Linear CLI configured successfully!');
          
          // Check if .linear.toml was created
          const configPath = path.join(process.cwd(), '.linear.toml');
          if (fs.existsSync(configPath)) {
            this.logger.info(`Configuration saved to: ${configPath}`);
            this.logger.info('You can now use other Linear commands like: jx linear list, jx linear create, etc.');
          }
        }
      });

    } catch (error) {
      spinner.fail('Failed to initialize Linear CLI');
      throw error;
    }
  }
}
