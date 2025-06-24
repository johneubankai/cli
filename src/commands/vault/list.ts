import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { VaultService } from '../../services/vault';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface VaultListOptions {
  projectRef?: string;
  format?: 'table' | 'json';
}

export class VaultListCommand extends SubCommand {
  parentCommand = 'vault';
  name = 'list';
  description = 'List all secret keys from Supabase Vault';

  protected configureOptions(command: Command): void {
    command
      .option('--project-ref <projectRef>', 'Project reference ID')
      .option('--format <format>', 'Output format (table, json)', 'table');
  }

  async execute(options: VaultListOptions): Promise<void> {
    const spinner = this.logger.spinner('Listing secrets...');

    try {
      // Get Supabase configuration
      const supabaseConfig = await this.config.getSupabaseConfig();
      const projectRef = options.projectRef || supabaseConfig.projectRef;
      
      if (!supabaseConfig.projectUrl || !supabaseConfig.anonKey) {
        spinner.fail('Supabase configuration missing');
        this.logger.error('Please set SUPABASE_PROJECT_REF and SUPABASE_ANON_KEY in your .env file');
        this.logger.info('Or configure using: jx supabase login');
        process.exit(1);
      }

      // Create vault service instance
      const vaultService = new VaultService({
        projectUrl: supabaseConfig.projectUrl,
        anonKey: supabaseConfig.anonKey,
        projectRef
      });

      // List secrets
      const secrets = await vaultService.listSecrets();
      
      spinner.succeed('Secrets retrieved');

      if (secrets.length === 0) {
        this.logger.info('No secrets found in vault');
        return;
      }

      if (options.format === 'json') {
        this.logger.log(JSON.stringify(secrets, null, 2));
      } else {
        this.logger.info(`\nFound ${secrets.length} secret(s):\n`);
        secrets.forEach(secret => {
          this.logger.log(`  • ${secret.name}`);
        });
      }

    } catch (error: unknown) {
      spinner.fail('Failed to list secrets');
      this.logger.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }
}
