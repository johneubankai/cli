import { Command } from 'commander';
import { spawn } from 'child_process';
import { BaseCommand } from '../base';

interface DevOptions {
  port?: string;
  host?: string;
  listen?: string;
}

export class DevCommand extends BaseCommand {
  name = 'dev';
  description = 'Start a local development server';

  protected configureOptions(command: Command): void {
    command
      .option('-p, --port <port>', 'Port to listen on', '3000')
      .option('-H, --host <host>', 'Host to listen on', 'localhost')
      .option('-l, --listen <address>', 'Listen on a specific address');
  }

  async execute(options: DevOptions): Promise<void> {
    const spinner = this.logger.spinner('Starting development server...');

    try {
      const localConfig = await this.config.getLocalConfig();
      const devCommand = localConfig?.settings?.devCommand || 'npm run dev';
      
      spinner.succeed('Development server starting...');
      this.logger.info(`Running: ${devCommand}`);
      this.logger.info(`Local: http://${options.host || 'localhost'}:${options.port || '3000'}`);
      
      // Spawn the dev process
      const devCommand = localConfig.settings?.devCommand || 'npm run dev';
      const [cmd, ...args] = devCommand.split(' ');
      const child = spawn(cmd, args, {
        stdio: 'inherit',
        env: {
          ...process.env,
          PORT: options.port || '3000',
          HOST: options.host || 'localhost',
        },
      });

      child.on('error', (error) => {
        this.logger.error(`Failed to start dev server: ${error.message}`);
        process.exit(1);
      });

      child.on('exit', (code) => {
        if (code !== 0) {
          this.logger.error(`Dev server exited with code ${code}`);
          process.exit(code || 1);
        }
      });

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        child.kill('SIGINT');
        process.exit(0);
      });

    } catch (error) {
      spinner.fail('Failed to start development server');
      throw error;
    }
  }
}
