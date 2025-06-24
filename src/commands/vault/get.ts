import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { execSync, spawn } from 'child_process';

export class VaultGetCommand extends SubCommand {
  parentCommand = 'vault';
  name = 'get';
  description = 'Get a specific secret from Supabase Vault';

  /**
   * Check if Supabase CLI is installed
   */
  private checkSupabaseInstalled(): boolean {
    try {
      execSync('supabase --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Execute a Supabase CLI command
   */
  private async executeSupabaseCommand(args: string[]): Promise<void> {
    if (!this.checkSupabaseInstalled()) {
      this.logger.error('Supabase CLI is not installed. Please install it from https://supabase.com/docs/guides/cli');
      process.exit(1);
    }

    return new Promise((resolve, reject) => {
      const supabase = spawn('supabase', args, {
        stdio: 'inherit',
        shell: true
      });

      supabase.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Supabase CLI exited with code ${code}`));
        }
      });

      supabase.on('error', (err) => {
        reject(err);
      });
    });
  }

  protected configureOptions(command: Command): void {
    command
      .argument('<key>', 'Secret key name to retrieve')
      .option('--project-ref <projectRef>', 'Project reference ID')
      .option('--linked', 'Use linked project')
      .option('--reveal', 'Show the actual secret value (use with caution)');
  }

  async execute(options: Record<string, unknown>, command?: Command): Promise<void> {
    try {
      // Get the key argument from command.args
      const key = command?.args?.[0];
      
      if (!key) {
        this.logger.error('Secret key is required');
        this.logger.info('Usage: jx vault get <key> [options]');
        process.exit(1);
      }

      const args = ['secrets', 'get', key];

      // Add options
      if (options.projectRef) {
        args.push('--project-ref', options.projectRef);
      }
      if (options.linked) {
        args.push('--linked');
      }

      // Execute the command
      this.logger.info(`Retrieving secret: ${key}...`);
      
      if (!options.reveal) {
        this.logger.warn('Secret values are hidden by default. Use --reveal to show the actual value.');
      }

      await this.executeSupabaseCommand(args);

    } catch (error: unknown) {
      this.logger.error(`Failed to get vault secret: ${error instanceof Error ? error.message : String(error)}`);
      this.logger.info('Note: Make sure you are logged in and have access to the project');
      this.logger.info('Run "supabase login" if needed');
      process.exit(1);
    }
  }
}
