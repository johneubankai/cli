import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { execSync, spawn } from 'child_process';

interface CheckFunctionsOptions {
  projectRef?: string;
  linked?: boolean;
  format?: 'table' | 'json';
}

export class CheckFunctionsCommand extends SubCommand {
  parentCommand = 'check';
  name = 'functions';
  description = 'List all Supabase Edge Functions';

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

  async execute(options: CheckFunctionsOptions): Promise<void> {
    try {
      const args = ['functions', 'list'];

      // Add options
      if (options.projectRef) {
        args.push('--project-ref', options.projectRef);
      }
      if (options.linked) {
        args.push('--linked');
      }

      // Execute the command
      this.logger.info('Listing Supabase Edge Functions...');
      await this.executeSupabaseCommand(args);

    } catch (error: unknown) {
      this.logger.error(`Failed to list functions: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }
}
