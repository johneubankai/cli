import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { spawn } from 'child_process';

interface FlyLogsOptions {
  app?: string;
  region?: string;
  instance?: string;
  since?: string;
  until?: string;
  json?: boolean;
  raw?: boolean;
}

export class FlyLogsCommand extends SubCommand {
  parentCommand = 'fly';
  name = 'logs';
  description = 'View Fly app logs';

  protected configureOptions(command: Command): void {
    command
      .option('-a, --app <app>', 'App name to fetch logs for')
      .option('-r, --region <region>', 'Region to fetch logs from')
      .option('-i, --instance <instance>', 'Instance ID to fetch logs from')
      .option('--since <time>', 'Show logs since timestamp')
      .option('--until <time>', 'Show logs until timestamp')
      .option('--json', 'Output logs as JSON')
      .option('--raw', 'Show raw log output');
  }

  async execute(options: FlyLogsOptions): Promise<void> {
    this.logger.info('Streaming Fly.io app logs...');

    try {
      // Build fly logs command arguments
      const args = ['logs'];
      
      if (options.app) {
        args.push('--app', options.app);
      }
      
      if (options.region) {
        args.push('--region', options.region);
      }
      
      if (options.instance) {
        args.push('--instance', options.instance);
      }
      
      if (options.since) {
        args.push('--since', options.since);
      }
      
      if (options.until) {
        args.push('--until', options.until);
      }
      
      if (options.json) {
        args.push('--json');
      }
      
      if (options.raw) {
        args.push('--raw');
      }

      // Use spawn for streaming logs
      const flyProcess = spawn('fly', args, {
        stdio: 'inherit'
      });

      // Handle process events
      flyProcess.on('error', (error) => {
        this.logger.error(`Failed to start log streaming: ${error.message}`);
        process.exit(1);
      });

      flyProcess.on('exit', (code) => {
        if (code !== 0) {
          this.logger.error(`Log streaming exited with code ${code}`);
          process.exit(code || 1);
        }
      });

      // Handle CTRL+C gracefully
      process.on('SIGINT', () => {
        flyProcess.kill('SIGINT');
        process.exit(0);
      });

    } catch (error) {
      this.logger.error(`Failed to stream logs: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
}
