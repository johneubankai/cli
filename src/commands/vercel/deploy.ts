import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { execSync } from 'child_process';

interface VercelDeployOptions {
  prod?: boolean;
  buildArgs?: string;
  env?: string[];
  meta?: string[];
  force?: boolean;
  token?: string;
  scope?: string;
  regions?: string;
  noWait?: boolean;
}

export class VercelDeployCommand extends SubCommand {
  parentCommand = 'vercel';
  name = 'deploy';
  description = 'Deploy using Vercel';

  protected configureOptions(command: Command): void {
    command
      .option('--prod', 'Deploy to production')
      .option('--build-args <args>', 'Build arguments')
      .option('-e, --env <vars...>', 'Environment variables')
      .option('-m, --meta <data...>', 'Metadata for the deployment')
      .option('-f, --force', 'Force a new deployment')
      .option('--token <token>', 'Vercel authentication token')
      .option('--scope <scope>', 'Deploy to a specific team or user')
      .option('--regions <regions>', 'Regions to deploy to')
      .option('--no-wait', "Don't wait for deployment to finish");
  }

  async execute(options: VercelDeployOptions): Promise<void> {
    const spinner = this.logger.spinner('Preparing Vercel deployment...');

    try {
      // Build Vercel command
      let vercelCommand = 'vercel';
      
      if (options.prod) {
        vercelCommand += ' --prod';
      }
      
      if (options.buildArgs) {
        vercelCommand += ` --build-args ${options.buildArgs}`;
      }
      
      if (options.env && options.env.length > 0) {
        options.env.forEach(envVar => {
          vercelCommand += ` -e ${envVar}`;
        });
      }
      
      if (options.meta && options.meta.length > 0) {
        options.meta.forEach(meta => {
          vercelCommand += ` -m ${meta}`;
        });
      }
      
      if (options.force) {
        vercelCommand += ' --force';
      }
      
      if (options.token) {
        vercelCommand += ` --token ${options.token}`;
      }
      
      if (options.scope) {
        vercelCommand += ` --scope ${options.scope}`;
      }
      
      if (options.regions) {
        vercelCommand += ` --regions ${options.regions}`;
      }
      
      if (options.noWait) {
        vercelCommand += ' --no-wait';
      }

      spinner.text = 'Deploying with Vercel...';
      
      // Execute Vercel deployment
      try {
        const output = execSync(vercelCommand, {
          stdio: 'pipe',
          encoding: 'utf-8'
        });
        
        spinner.succeed('Vercel deployment completed!');
        this.logger.info(output);
      } catch (error) {
        if (error instanceof Error && 'stdout' in error) {
          this.logger.info((error as any).stdout);
        }
        throw error;
      }
    } catch (error) {
      spinner.fail('Vercel deployment failed');
      throw error;
    }
  }
}
