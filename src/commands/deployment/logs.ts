import { Command } from 'commander';
import { BaseCommand } from '../base';

interface LogsOptions {
  follow?: boolean;
  lines?: string;
  since?: string;
  until?: string;
}

export class LogsCommand extends BaseCommand {
  name = 'logs [deploymentUrl]';
  description = 'View deployment logs';

  protected configureOptions(command: Command): void {
    command
      .option('-f, --follow', 'Follow log output')
      .option('-n, --lines <number>', 'Number of lines to show', '100')
      .option('-s, --since <time>', 'Show logs since timestamp')
      .option('-u, --until <time>', 'Show logs until timestamp');
  }

  async execute(options: LogsOptions, command?: Command): Promise<void> {
    const args = command?.args || [];
    const deploymentUrl = args[0];

    const spinner = this.logger.spinner('Fetching logs...');

    try {
      const token = await this.config.getAuthToken();
      if (!token) {
        spinner.fail('Not authenticated');
        this.logger.error('Please run "jx login" first');        process.exit(1);
      }

      if (!deploymentUrl) {
        spinner.fail('Deployment URL required');
        this.logger.error('Usage: jx logs <deployment-url>');
        this.logger.info('Run "jx ls" to see your deployments');
        process.exit(1);
      }

      spinner.succeed('Logs loaded');

      const lines = parseInt(options.lines || '100', 10);
      const logs = this.getMockLogs(lines);

      this.logger.log('\n' + logs.join('\n'));

      if (options.follow) {
        this.logger.info('\nFollowing logs... (press Ctrl+C to stop)');
        
        // Simulate following logs
        const interval = setInterval(() => {
          const timestamp = new Date().toISOString();
          const logLine = `${timestamp} [info] Random log entry ${Math.random()}`;
          this.logger.log(logLine);
        }, 2000);

        process.on('SIGINT', () => {
          clearInterval(interval);
          process.exit(0);
        });
      }
    } catch (error) {
      spinner.fail('Failed to fetch logs');      throw error;
    }
  }

  private getMockLogs(lines: number): string[] {
    const logs: string[] = [];
    const logLevels = ['info', 'warn', 'error', 'debug'];
    const messages = [
      'Starting application...',
      'Listening on port 3000',
      'Connected to database',
      'Processing request',
      'Request completed',
      'Cache hit for key: user_123',
      'Executing background job',
      'Health check passed',
    ];

    for (let i = 0; i < lines; i++) {
      const timestamp = new Date(Date.now() - (lines - i) * 1000).toISOString();
      const level = logLevels[Math.floor(Math.random() * logLevels.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      
      logs.push(`${timestamp} [${level}] ${message}`);
    }

    return logs;
  }
}
