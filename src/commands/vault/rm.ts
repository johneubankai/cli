import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { VaultService } from '../../services/vault';
import * as dotenv from 'dotenv';
import inquirer from 'inquirer';

// Load environment variables
dotenv.config();

interface VaultRemoveOptions {
  projectRef?: string;
  yes?: boolean;
}

export class VaultRemoveCommand extends SubCommand {
  parentCommand = 'vault';
  name = 'rm';
  description = 'Remove a secret from Supabase Vault';
  aliases = ['remove'];

  protected configureOptions(command: Command): void {
    command
      .argument('<key>', 'Secret key name to remove')
      .option('--project-ref <projectRef>', 'Project reference ID')
      .option('-y, --yes', 'Skip confirmation');
  }

  async execute(options: VaultRemoveOptions, command?: Command): Promise<void> {
    try {
      const key = command?.args?.[0];
      
      if (!key) {
        this.logger.error('Secret key is required');
        this.logger.info('Usage: jx vault rm <key> [options]');
        process.exit(1);
      }

      // Confirm removal unless --yes flag is provided
      if (!options.yes) {
        const answers = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to remove the secret "${key}"?`,
            default: false
          }
        ]);
        
        if (!answers.confirm) {
          this.logger.info('Removal cancelled');
          return;
        }
      }

      const spinner = this.logger.spinner('Removing secret...');

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

        // Remove the secret
        await vaultService.removeSecret(key);
        
        spinner.succeed(`Secret "${key}" has been removed`);

      } catch (error) {
        spinner.fail('Failed to remove secret');
        throw error;
      }

    } catch (error: unknown) {
      this.logger.error(`Failed to remove vault secret: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }
}
