import { Command } from 'commander';
import { SupabaseCommand } from './base';
import { SupabaseManagementService } from '../../services/supabase-management';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

interface SbDbPushOptions {
  projectRef?: string;
}

export class SbDbPushCommand extends SupabaseCommand {
  parentCommand = 'sb db';
  name = 'push';
  description = 'Push database migrations to Supabase';

  protected configureOptions(command: Command): void {
    command
      .option('--project-ref <ref>', 'Override project reference');
  }

  async execute(options: SbDbPushOptions): Promise<void> {
    const spinner = this.logger.spinner('Pushing database migrations...');

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

      // Get migrations path
      const migrationsPath = path.join(this.getSupabaseProjectPath(), 'migrations');

      // Run migrations
      await managementService.runMigrations(migrationsPath);

      spinner.succeed('Database migrations pushed successfully');
      this.logger.info(`Project: ${projectRef}`);

    } catch (error: unknown) {
      spinner.fail('Failed to push migrations');
      this.logger.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }
}
