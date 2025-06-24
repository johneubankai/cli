import { Command } from 'commander';
import { BaseCommand } from '../base';
import { Environment, EnvironmentTarget } from '../../types';

interface EnvOptions {
  production?: boolean;
  preview?: boolean;
  development?: boolean;
}

export class EnvCommand extends BaseCommand {
  name = 'env';
  description = 'Manage environment variables';

  protected configureOptions(command: Command): void {
    command
      .option('--prod, --production', 'Show production environment variables')
      .option('--preview', 'Show preview environment variables')
      .option('--dev, --development', 'Show development environment variables');
  }

  async execute(options: EnvOptions): Promise<void> {
    const spinner = this.logger.spinner('Fetching environment variables...');

    try {
      const token = await this.config.getAuthToken();
      if (!token) {
        spinner.fail('Not authenticated');
        this.logger.error('Please run "jx login" first');
        process.exit(1);
      }

      const localConfig = await this.config.getLocalConfig();      if (!localConfig?.projectId) {
        spinner.fail('No project linked');
        this.logger.error('Please run "jx link" first');
        process.exit(1);
      }

      // Mock environment variables
      const environments = this.getMockEnvironments();
      
      const targets: EnvironmentTarget[] = [];
      if (options.production) targets.push('production');
      if (options.preview) targets.push('preview');
      if (options.development) targets.push('development');
      
      const filtered = targets.length > 0
        ? environments.filter(env => env.target.some((t: EnvironmentTarget) => targets.includes(t)))
        : environments;

      spinner.succeed('Environment variables loaded');

      if (filtered.length === 0) {
        this.logger.info('No environment variables found');
        return;
      }

      this.logger.table(filtered.map(env => ({
        Key: env.key,
        Value: env.type === 'secret' ? '******' : env.value,
        Target: env.target.join(', '),
        Type: env.type || 'plain',
      })));
    } catch (error) {      spinner.fail('Failed to fetch environment variables');
      throw error;
    }
  }

  private getMockEnvironments(): Environment[] {
    return [
      {
        key: 'API_URL',
        value: 'https://api.example.com',
        target: ['production', 'preview'],
        type: 'plain',
        id: 'env_1',
        createdAt: new Date(),
      },
      {
        key: 'SECRET_KEY',
        value: 'sk_test_123456',
        target: ['production'],
        type: 'secret',
        id: 'env_2',
        createdAt: new Date(),
      },
      {
        key: 'DEBUG',
        value: 'true',
        target: ['development'],
        type: 'plain',
        id: 'env_3',
        createdAt: new Date(),
      },
    ];
  }
}
