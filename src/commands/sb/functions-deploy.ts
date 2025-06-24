import { Command } from 'commander';
import { SupabaseCommand } from './base';
import { SupabaseManagementService } from '../../services/supabase-management';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as dotenv from 'dotenv';

dotenv.config();

interface SbFunctionsDeployOptions {
  projectRef?: string;
  all?: boolean;
}

export class SbFunctionsDeployCommand extends SupabaseCommand {
  parentCommand = 'sb functions';
  name = 'deploy';
  description = 'Deploy edge functions to Supabase';

  protected configureOptions(command: Command): void {
    command
      .argument('[function-name]', 'Name of the function to deploy')
      .option('--project-ref <ref>', 'Override project reference')
      .option('--all', 'Deploy all functions');
  }

  async execute(options: SbFunctionsDeployOptions, command?: Command): Promise<void> {
    try {
      const functionName = command?.args?.[0];
      
      if (!functionName && !options.all) {
        this.logger.error('Function name is required unless --all is specified');
        this.logger.info('Usage: jx sb functions deploy <function-name>');
        this.logger.info('       jx sb functions deploy --all');
        process.exit(1);
      }

      const spinner = this.logger.spinner('Deploying edge functions...');

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

        // Get functions path
        const functionsPath = path.join(this.getSupabaseProjectPath(), 'functions');

        if (options.all) {
          // Deploy all functions
          const functions = await fs.readdir(functionsPath);
          const functionDirs = [];
          
          for (const item of functions) {
            const itemPath = path.join(functionsPath, item);
            const stat = await fs.stat(itemPath);
            if (stat.isDirectory() && !item.startsWith('.')) {
              functionDirs.push(item);
            }
          }

          spinner.text = `Deploying ${functionDirs.length} functions...`;

          for (const func of functionDirs) {
            spinner.text = `Deploying ${func}...`;
            await managementService.deployFunction(func, path.join(functionsPath, func));
          }

          spinner.succeed(`Successfully deployed ${functionDirs.length} functions`);
          this.logger.info('Functions deployed: ' + functionDirs.join(', '));

        } else {
          // Deploy single function
          const functionPath = path.join(functionsPath, functionName!);
          
          // Check if function exists
          try {
            await fs.access(functionPath);
          } catch {
            spinner.fail(`Function "${functionName}" not found`);
            this.logger.error(`Expected function at: ${functionPath}`);
            process.exit(1);
          }

          await managementService.deployFunction(functionName!, functionPath);
          spinner.succeed(`Successfully deployed function: ${functionName}`);
        }

        this.logger.info(`Project: ${projectRef}`);

      } catch (error) {
        spinner.fail('Failed to deploy functions');
        throw error;
      }

    } catch (error: unknown) {
      this.logger.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }
}
