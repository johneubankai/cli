import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { execSync, spawn } from 'child_process';

interface VaultListOptions {
  projectRef?: string;
  linked?: boolean;
  format?: 'table' | 'json';
}

export class VaultListCommand extends SubCommand {
  parentCommand = 'vault';
  name = 'list';
  description = 'List all secret keys from Supabase Vault';

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
      .option('--project-ref <projectRef>', 'Project reference ID')
      .option('--linked', 'Use linked project')
      .option('--format <format>', 'Output format (table, json)', 'table');
  }

  async execute(options: VaultListOptions): Promise<void> {
    try {
      const args = ['secrets', 'list'];

      // Add options
      if (options.projectRef) {
        args.push('--project-ref', options.projectRef);
      }
      if (options.linked) {
        args.push('--linked');
      }

      // Execute the command
      this.logger.info('Listing Supabase Vault secrets...');
      await this.executeSupabaseCommand(args);

    } catch (error: unknown) {
      this.logger.error(`Failed to list vault secrets: ${error instanceof Error ? error.message : String(error)}`);
      this.logger.info('Note: Make sure you are logged in and have access to the project');
      this.logger.info('Run "supabase login" if needed');
      process.exit(1);
    }
  }
}
