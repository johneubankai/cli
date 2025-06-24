import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { execSync } from 'child_process';

interface FlySecretsOptions {
  app?: string;
  action?: 'list' | 'set' | 'unset';
  secrets?: string[];
  json?: boolean;
  detach?: boolean;
  stage?: boolean;
}

export class FlySecretsCommand extends SubCommand {
  parentCommand = 'fly';
  name = 'secrets';
  description = 'Manage Fly app secrets';

  protected configureOptions(command: Command): void {
    command
      .option('-a, --app <app>', 'App name')
      .option('--action <action>', 'Action to perform (list, set, unset)', 'list')
      .option('--secrets <secrets...>', 'Secrets to set/unset (KEY=VALUE format for set, KEY for unset)')
      .option('--json', 'Output as JSON (for list action)')
      .option('--detach', 'Return immediately after starting update')
      .option('--stage', 'Stage secrets for next deployment');
  }

  async execute(options: FlySecretsOptions): Promise<void> {
    const action = options.action || 'list';
    const spinner = this.logger.spinner(`Preparing to ${action} secrets...`);

    try {
      let flyCommand = 'fly secrets';
      
      // Add action
      flyCommand += ` ${action}`;
      
      if (options.app) {
        flyCommand += ` --app ${options.app}`;
      }

      // Handle different actions
      switch (action) {
        case 'list':
          if (options.json) {
            flyCommand += ' --json';
          }
          break;
          
        case 'set':
          if (!options.secrets || options.secrets.length === 0) {
            spinner.fail('No secrets provided to set');
            this.logger.error('Please provide secrets in KEY=VALUE format');
            return;
          }
          flyCommand += ` ${options.secrets.join(' ')}`;
          
          if (options.detach) {
            flyCommand += ' --detach';
          }
          
          if (options.stage) {
            flyCommand += ' --stage';
          }
          break;
          
        case 'unset':
          if (!options.secrets || options.secrets.length === 0) {
            spinner.fail('No secret keys provided to unset');
            this.logger.error('Please provide secret keys to unset');
            return;
          }
          flyCommand += ` ${options.secrets.join(' ')}`;
          
          if (options.detach) {
            flyCommand += ' --detach';
          }
          
          if (options.stage) {
            flyCommand += ' --stage';
          }
          break;
          
        default:
          spinner.fail(`Unknown action: ${action}`);
          return;
      }

      spinner.text = `${action === 'list' ? 'Fetching' : 'Managing'} secrets...`;
      
      // Execute fly secrets command
      try {
        const output = execSync(flyCommand, {
          stdio: 'pipe',
          encoding: 'utf-8'
        });
        
        spinner.succeed(`Secrets ${action} completed!`);
        
        if (options.json && action === 'list') {
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
      spinner.fail(`Failed to ${action} secrets`);
      throw error;
    }
  }
}
