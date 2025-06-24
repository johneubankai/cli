import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { execSync } from 'child_process';

interface VercelDevOptions {
  port?: string;
  listen?: string;
  debug?: boolean;
}

export class VercelDevCommand extends SubCommand {
  parentCommand = 'vercel';
  name = 'dev';
  description = 'Start a local development server with Vercel';

  protected configureOptions(command: Command): void {
    command
      .option('-p, --port <port>', 'Port to listen on', '3000')
      .option('-l, --listen <address>', 'Address to listen on', 'localhost')
      .option('--debug', 'Enable debug output');
  }

  async execute(options: VercelDevOptions): Promise<void> {
    this.logger.info('Starting Vercel development server...');

    try {
      let vercelCommand = 'vercel dev';
      
      if (options.port) {
        vercelCommand += ` --port ${options.port}`;
      }
      
      if (options.listen) {
        vercelCommand += ` --listen ${options.listen}`;
      }
      
      if (options.debug) {
        vercelCommand += ' --debug';
      }

      // Execute Vercel dev command
      execSync(vercelCommand, {
        stdio: 'inherit'
      });
    } catch (error) {
      this.logger.error('Failed to start Vercel development server');
      throw error;
    }
  }
}
