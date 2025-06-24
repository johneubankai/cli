import { Command } from 'commander';
import { SupabaseCommand } from './base';
import { SupabaseManagementService } from '../../services/supabase-management';
import * as dotenv from 'dotenv';

dotenv.config();

interface SbLinkOptions {
  // No additional options for now
}

export class SbLinkCommand extends SupabaseCommand {
  name = 'link';
  description = 'Link to a Supabase project';

  protected configureOptions(command: Command): void {
    command
      .argument('<project-ref>', 'Supabase project reference ID');
  }

  async execute(_options: SbLinkOptions, command?: Command): Promise<void> {
    try {
      const projectRef = command?.args?.[0];
      
      if (!projectRef) {
        this.logger.error('Project reference is required');
        this.logger.info('Usage: jx sb link <project-ref>');
        process.exit(1);
      }

      const spinner = this.logger.spinner('Linking to Supabase project...');

      try {
        const accessToken = process.env.SUPABASE_PAT || process.env.SUPABASE_ACCESS_TOKEN;
        if (!accessToken) {
          spinner.fail('Supabase access token not found');
          this.logger.error('Please set SUPABASE_PAT in your .env file');
          this.logger.info('Get your token from: https://app.supabase.com/account/tokens');
          process.exit(1);
        }

        // Create management service
        const managementService = new SupabaseManagementService({
          accessToken,
          projectRef
        });

        // Verify project exists
        await managementService.linkProject(projectRef);

        // Save project reference to config
        const supabaseConfig = await this.config.getSupabaseConfig();
        await this.config.setSupabaseConfig(
          supabaseConfig.projectUrl || `https://${projectRef}.supabase.co`,
          supabaseConfig.anonKey || '',
          projectRef
        );

        spinner.succeed(`Successfully linked to project: ${projectRef}`);
        this.logger.info('Project configuration saved');

      } catch (error) {
        spinner.fail('Failed to link project');
        throw error;
      }

    } catch (error: unknown) {
      this.logger.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }
}
