import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { execSync } from 'child_process';

interface FlyDeployOptions {
  app?: string;
  config?: string;
  image?: string;
  buildOnly?: boolean;
  localOnly?: boolean;
  remote?: boolean;
  strategy?: string;
  buildArg?: string[];
  buildSecret?: string[];
  env?: string[];
  wait?: number;
  detach?: boolean;
}

export class FlyDeployCommand extends SubCommand {
  parentCommand = 'fly';
  name = 'deploy';
  description = 'Deploy to Fly.io platform';

  protected configureOptions(command: Command): void {
    command
      .option('-a, --app <app>', 'App name to deploy')
      .option('-c, --config <config>', 'Path to config file')
      .option('-i, --image <image>', 'Image to deploy')
      .option('--build-only', 'Build image without deploying')
      .option('--local-only', 'Build using local Docker daemon')
      .option('--remote', 'Build using remote Fly.io builders')
      .option('--strategy <strategy>', 'Deployment strategy (rolling, immediate, canary)')
      .option('--build-arg <arg...>', 'Build arguments')
      .option('--build-secret <secret...>', 'Build secrets')
      .option('-e, --env <vars...>', 'Environment variables')
      .option('--wait <seconds>', 'Wait for deployment to complete')
      .option('--detach', 'Return immediately after starting deployment');
  }

  async execute(options: FlyDeployOptions): Promise<void> {
    const spinner = this.logger.spinner('Preparing Fly.io deployment...');

    try {
      // Build fly deploy command
      let flyCommand = 'fly deploy';
      
      if (options.app) {
        flyCommand += ` --app ${options.app}`;
      }
      
      if (options.config) {
        flyCommand += ` --config ${options.config}`;
      }
      
      if (options.image) {
        flyCommand += ` --image ${options.image}`;
      }
      
      if (options.buildOnly) {
        flyCommand += ' --build-only';
      }
      
      if (options.localOnly) {
        flyCommand += ' --local-only';
      }
      
      if (options.remote) {
        flyCommand += ' --remote';
      }
      
      if (options.strategy) {
        flyCommand += ` --strategy ${options.strategy}`;
      }
      
      if (options.buildArg && options.buildArg.length > 0) {
        options.buildArg.forEach(arg => {
          flyCommand += ` --build-arg ${arg}`;
        });
      }
      
      if (options.buildSecret && options.buildSecret.length > 0) {
        options.buildSecret.forEach(secret => {
          flyCommand += ` --build-secret ${secret}`;
        });
      }
      
      if (options.env && options.env.length > 0) {
        options.env.forEach(envVar => {
          flyCommand += ` -e ${envVar}`;
        });
      }
      
      if (options.wait !== undefined) {
        flyCommand += ` --wait ${options.wait}`;
      }
      
      if (options.detach) {
        flyCommand += ' --detach';
      }

      spinner.text = 'Deploying to Fly.io...';
      
      // Execute fly deploy command
      try {
        const output = execSync(flyCommand, {
          stdio: 'pipe',
          encoding: 'utf-8'
        });
        
        spinner.succeed('Fly.io deployment completed!');
        this.logger.info(output);
      } catch (error) {
        if (error instanceof Error && 'stdout' in error) {
          this.logger.info((error as any).stdout);
        }
        throw error;
      }
    } catch (error) {
      spinner.fail('Fly.io deployment failed');
      throw error;
    }
  }
}
