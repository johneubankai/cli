import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { VaultService } from '../../services/vault';
import * as dotenv from 'dotenv';
import inquirer from 'inquirer';

// Load environment variables
dotenv.config();

interface VaultSetOptions {
  projectRef?: string;
}

export class VaultSetCommand extends SubCommand {
  parentCommand = 'vault';
  name = 'set';
  description = 'Add or update a secret in Supabase Vault';

  protected configureOptions(command: Command): void {
    command
      .argument('<key>', 'Secret key name')
      .argument('[value]', 'Secret value (will prompt if not provided)')
      .option('--project-ref <projectRef>', 'Project reference ID');
  }

  async execute(options: VaultSetOptions, command?: Command): Promise<void> {
    try {
      const key = command?.args?.[0];
      let value = command?.args?.[1];
      
      if (!key) {
        this.logger.error('Secret key is required');
        this.logger.info('Usage: jx vault set <key> [value] [options]');
        process.exit(1);
      }

      // If value not provided, prompt for it
      if (!value) {
        const answers = await inquirer.prompt([
          {
            type: 'password',
            name: 'value',
            message: 'Enter secret value:',
            validate: (input: string) => input.length > 0 || 'Value is required'
          }
        ]);
        value = answers.value;
      }

      const spinner = this.logger.spinner('Setting secret...');

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

        // Set the secret
        await vaultService.setSecret(key, value!);
        
        spinner.succeed(`Secret "${key}" has been set successfully`);

      } catch (error) {
        spinner.fail('Failed to set secret');
        throw error;
      }

    } catch (error: unknown) {
      this.logger.error(`Failed to set vault secret: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }
}
