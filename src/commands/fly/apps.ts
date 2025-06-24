import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { execSync } from 'child_process';

interface FlyAppsOptions {
  org?: string;
  status?: string;
  json?: boolean;
}

export class FlyAppsCommand extends SubCommand {
  parentCommand = 'fly';
  name = 'apps';
  description = 'Manage Fly applications';

  protected configureOptions(command: Command): void {
    command
      .option('-o, --org <org>', 'Organization to list apps for')
      .option('-s, --status <status>', 'Filter by app status')
      .option('--json', 'Output as JSON');
  }

  async execute(options: FlyAppsOptions): Promise<void> {
    const spinner = this.logger.spinner('Fetching Fly.io applications...');

    try {
      // Build fly apps command
      let flyCommand = 'fly apps list';
      
      if (options.org) {
        flyCommand += ` --org ${options.org}`;
      }
      
      if (options.status) {
        flyCommand += ` --status ${options.status}`;
      }
      
      if (options.json) {
        flyCommand += ' --json';
      }

      spinner.text = 'Retrieving Fly.io applications...';
      
      // Execute fly apps command
      try {
        const output = execSync(flyCommand, {
          stdio: 'pipe',
          encoding: 'utf-8'
        });
        
        spinner.succeed('Fly.io applications retrieved!');
        
        if (options.json) {
          console.log(output);
        } else {
          this.logger.info(output);
        }
      } catch (error) {
        if (error instanceof Error && 'stdout' in error) {
          this.logger.info((error as any).stdout);
        }
        throw error;
      }
    } catch (error) {
      spinner.fail('Failed to retrieve Fly.io applications');
      throw error;
    }
  }
}
