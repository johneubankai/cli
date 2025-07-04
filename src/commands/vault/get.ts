import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { VaultService } from '../../services/vault';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface VaultGetOptions {
  projectRef?: string;
  reveal?: boolean;
}

export class VaultGetCommand extends SubCommand {
  parentCommand = 'vault';
  name = 'get';
  description = 'Get a specific secret from Supabase Vault';

  protected configureOptions(command: Command): void {
    command
      .argument('<key>', 'Secret key name to retrieve')
      .option('--project-ref <projectRef>', 'Project reference ID')
      .option('--reveal', 'Show the actual secret value (use with caution)');
  }

  async execute(options: VaultGetOptions, command?: Command): Promise<void> {
    try {
      const key = command?.args?.[0];
      
      if (!key) {
        this.logger.error('Secret key is required');
        this.logger.info('Usage: jx vault get <key> [options]');
        process.exit(1);
      }

      const spinner = this.logger.spinner('Retrieving secret...');

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

        // Get the secret
        const secret = await vaultService.getSecret(key, options.reveal || false);
        
        spinner.succeed(`Secret retrieved: ${key}`);
        
        if (options.reveal && secret.value) {
          this.logger.info(`Value: ${secret.value}`);
        } else {
          this.logger.info('Value: ******** (use --reveal to show)');
        }

      } catch (error) {
        spinner.fail('Failed to retrieve secret');
        throw error;
      }

    } catch (error: unknown) {
      this.logger.error(`Failed to get vault secret: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }
}
