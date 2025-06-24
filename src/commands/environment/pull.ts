import { Command } from 'commander';
import * as fs from 'fs/promises';
import * as path from 'path';
import { BaseCommand } from '../base';

interface PullOptions {
  production?: boolean;
  preview?: boolean;
  development?: boolean;
  output?: string;
}

export class PullCommand extends BaseCommand {
  name = 'pull';
  description = 'Pull environment variables';

  protected configureOptions(command: Command): void {
    command
      .option('--prod, --production', 'Pull production environment')
      .option('--preview', 'Pull preview environment')
      .option('--dev, --development', 'Pull development environment')
      .option('-o, --output <file>', 'Output file (default: .env)');
  }

  async execute(options: PullOptions): Promise<void> {
    const spinner = this.logger.spinner('Pulling environment variables...');

    try {
      const token = await this.config.getAuthToken();
      if (!token) {
        spinner.fail('Not authenticated');
        this.logger.error('Please run "jx login" first');
        process.exit(1);      }

      const localConfig = await this.config.getLocalConfig();
      if (!localConfig?.projectId) {
        spinner.fail('No project linked');
        this.logger.error('Please run "jx link" first');
        process.exit(1);
      }

      // Determine environment to pull
      let environment = 'development';
      if (options.production) environment = 'production';
      else if (options.preview) environment = 'preview';
      else if (options.development) environment = 'development';

      // Mock environment variables
      const envVars = this.getMockEnvVars(environment);
      
      const outputFile = options.output || '.env';
      const outputPath = path.join(process.cwd(), outputFile);
      
      const content = Object.entries(envVars)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

      await fs.writeFile(outputPath, content);

      spinner.succeed(`Environment variables pulled successfully!`);
      this.logger.info(`Written to: ${outputFile}`);
      this.logger.info(`Environment: ${environment}`);
      this.logger.info(`Variables: ${Object.keys(envVars).length}`);
    } catch (error) {      spinner.fail('Failed to pull environment variables');
      throw error;
    }
  }

  private getMockEnvVars(environment: string): Record<string, string> {
    const base = {
      NODE_ENV: environment,
      APP_NAME: 'My JX App',
    };

    switch (environment) {
      case 'production':
        return {
          ...base,
          API_URL: 'https://api.production.example.com',
          DATABASE_URL: 'postgresql://prod_user:prod_pass@prod.db.com/myapp',
          SECRET_KEY: 'prod_secret_key_123456',
        };
      case 'preview':
        return {
          ...base,
          API_URL: 'https://api.preview.example.com',
          DATABASE_URL: 'postgresql://preview_user:preview_pass@preview.db.com/myapp',
          SECRET_KEY: 'preview_secret_key_123456',
        };
      default:
        return {
          ...base,
          API_URL: 'http://localhost:3001',
          DATABASE_URL: 'postgresql://dev_user:dev_pass@localhost:5432/myapp_dev',
          SECRET_KEY: 'dev_secret_key_123456',
          DEBUG: 'true',
        };
    }
  }
}
