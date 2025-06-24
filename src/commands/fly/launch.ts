import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { execSync } from 'child_process';

interface FlyLaunchOptions {
  name?: string;
  org?: string;
  region?: string;
  postgres?: boolean;
  redis?: boolean;
  noDeploy?: boolean;
  generateName?: boolean;
  copyConfig?: boolean;
  dockerfilePath?: string;
  imageLabel?: string;
}

export class FlyLaunchCommand extends SubCommand {
  parentCommand = 'fly';
  name = 'launch';
  description = 'Launch new Fly.io app';

  protected configureOptions(command: Command): void {
    command
      .option('-n, --name <name>', 'Name of the new app')
      .option('-o, --org <org>', 'Organization to create the app in')
      .option('-r, --region <region>', 'Region to create the app in')
      .option('--postgres', 'Create a Postgres database cluster')
      .option('--redis', 'Create a Redis database')
      .option('--no-deploy', 'Do not immediately deploy the app')
      .option('--generate-name', 'Generate a unique app name')
      .option('--copy-config', 'Copy configuration from an existing app')
      .option('--dockerfile-path <path>', 'Path to Dockerfile')
      .option('--image-label <label>', 'Image label to use');
  }

  async execute(options: FlyLaunchOptions): Promise<void> {
    const spinner = this.logger.spinner('Preparing Fly.io app launch...');

    try {
      // Build fly launch command
      let flyCommand = 'fly launch';
      
      if (options.name) {
        flyCommand += ` --name ${options.name}`;
      }
      
      if (options.org) {
        flyCommand += ` --org ${options.org}`;
      }
      
      if (options.region) {
        flyCommand += ` --region ${options.region}`;
      }
      
      if (options.postgres) {
        flyCommand += ' --postgres';
      }
      
      if (options.redis) {
        flyCommand += ' --redis';
      }
      
      if (options.noDeploy) {
        flyCommand += ' --no-deploy';
      }
      
      if (options.generateName) {
        flyCommand += ' --generate-name';
      }
      
      if (options.copyConfig) {
        flyCommand += ' --copy-config';
      }
      
      if (options.dockerfilePath) {
        flyCommand += ` --dockerfile-path ${options.dockerfilePath}`;
      }
      
      if (options.imageLabel) {
        flyCommand += ` --image-label ${options.imageLabel}`;
      }

      spinner.text = 'Launching Fly.io app...';
      
      // Execute fly launch command
      try {
        const output = execSync(flyCommand, {
          stdio: 'pipe',
          encoding: 'utf-8'
        });
        
        spinner.succeed('Fly.io app launched successfully!');
        this.logger.info(output);
      } catch (error) {
        if (error instanceof Error && 'stdout' in error) {
          this.logger.info((error as any).stdout);
        }
        throw error;
      }
    } catch (error) {
      spinner.fail('Fly.io app launch failed');
      throw error;
    }
  }
}
