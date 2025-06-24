import { Command } from 'commander';
import { SupabaseCommand } from './base';
import { SupabaseManagementService } from '../../services/supabase-management';
import * as dotenv from 'dotenv';

dotenv.config();

interface SbFunctionsListOptions {
  projectRef?: string;
}

export class SbFunctionsListCommand extends SupabaseCommand {
  parentCommand = 'sb functions';
  name = 'list';
  description = 'List edge functions in the project';
  aliases = ['ls'];

  protected configureOptions(command: Command): void {
    command
      .option('--project-ref <ref>', 'Override project reference');
  }

  async execute(options: SbFunctionsListOptions): Promise<void> {
    const spinner = this.logger.spinner('Fetching functions...');

    try {
      const accessToken = process.env.SUPABASE_PAT || process.env.SUPABASE_ACCESS_TOKEN;
      if (!accessToken) {
        spinner.fail('Supabase access token not found');
        this.logger.error('Please set SUPABASE_PAT in your .env file');
        this.logger.info('Get your token from: https://app.supabase.com/account/tokens');
        process.exit(1);
      }

      // Get project reference
      const supabaseConfig = await this.config.getSupabaseConfig();
      const projectRef = options.projectRef || supabaseConfig.projectRef || process.env.SUPABASE_PROJECT_REF;
      
      if (!projectRef) {
        spinner.fail('No project linked');
        this.logger.error('Please run "jx sb link <project-ref>" first');
        process.exit(1);
      }

      // Create management service
      const managementService = new SupabaseManagementService({
        accessToken,
        projectRef
      });

      // List functions
      const functions = await managementService.listFunctions();

      spinner.succeed('Functions retrieved');

      if (functions.length === 0) {
        this.logger.info('No functions deployed');
        return;
      }

      this.logger.info(`\nFunctions in project ${projectRef}:\n`);
      functions.forEach(func => {
        this.logger.log(`  • ${func.name || func.slug}`);
        if (func.created_at) {
          this.logger.log(`    Created: ${new Date(func.created_at).toLocaleString()}`);
        }
        if (func.updated_at) {
          this.logger.log(`    Updated: ${new Date(func.updated_at).toLocaleString()}`);
        }
      });

    } catch (error: unknown) {
      spinner.fail('Failed to list functions');
      this.logger.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }
}
