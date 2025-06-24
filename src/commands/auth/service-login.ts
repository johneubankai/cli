import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { BaseCommand } from '../base';
import { ServiceManager } from '../../utils/service-manager';
import { SUPPORTED_SERVICES } from '../../types/services';

interface ServiceLoginOptions {
  all?: boolean;
  service?: string;
}

export class ServiceLoginCommand extends BaseCommand {
  name = 'login';
  description = 'Unified login for all supported services';

  protected configureOptions(command: Command): void {
    command
      .option('-a, --all', 'Login to all services')
      .option('-s, --service <name>', 'Login to a specific service')
      .argument('[service]', 'Service name to login to');
  }

  async execute(options: ServiceLoginOptions, command?: Command): Promise<void> {
    try {
      // Get service name from argument if provided
      const serviceName = command?.args[0] || options.service;

      if (serviceName) {
        await this.loginToSpecificService(serviceName);
      } else if (options.all) {
        await this.loginToAllServices();
      } else {
        await this.interactiveLogin();
      }
    } catch (error) {
      throw error;
    }
  }

  private async loginToSpecificService(serviceName: string): Promise<void> {
    const service = SUPPORTED_SERVICES.find(s => s.name === serviceName);
    
    if (!service) {
      this.logger.error(`Unknown service: ${serviceName}`);
      this.logger.info(`Supported services: ${SUPPORTED_SERVICES.map(s => s.name).join(', ')}`);
      return;
    }

    await ServiceManager.loginToService(service);
  }

  private async loginToAllServices(): Promise<void> {
    this.logger.info(chalk.bold('\n🔐 JX Universal Login\n'));
    this.logger.info('This will guide you through logging into all supported services.\n');

    const results: { service: string; success: boolean }[] = [];

    for (const service of SUPPORTED_SERVICES) {
      const success = await ServiceManager.loginToService(service);
      results.push({ service: service.displayName, success });
      
      if (success) {
        this.logger.info(''); // Empty line for spacing
      }
    }

    // Summary
    this.logger.info(chalk.bold('\n📊 Login Summary:\n'));
    results.forEach(({ service, success }) => {
      const icon = success ? '✅' : '❌';
      const status = success ? chalk.green('Success') : chalk.red('Failed');
      this.logger.info(`${icon} ${service}: ${status}`);
    });
  }

  private async interactiveLogin(): Promise<void> {
    this.logger.info(chalk.bold('\n🔐 JX Universal Login\n'));
    
    // Get current authentication status
    const statuses = await ServiceManager.getAllServiceStatuses();
    
    // Create choices with status indicators
    const choices: any[] = SUPPORTED_SERVICES.map(service => {
      const isAuthenticated = statuses.get(service.name);
      const status = isAuthenticated ? chalk.green('✓') : chalk.gray('○');
      return {
        name: `${status} ${service.displayName}`,
        value: service.name,
        short: service.displayName,
      };
    });

    choices.push(new inquirer.Separator());
    choices.push({
      name: chalk.cyan('Login to all services'),
      value: 'all',
      short: 'All services',
    });
    choices.push({
      name: chalk.yellow('Exit'),
      value: 'exit',
      short: 'Exit',
    });

    const { selectedService } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedService',
        message: 'Select a service to authenticate:',
        choices,
        pageSize: 12,
      },
    ]);

    if (selectedService === 'exit') {
      return;
    }

    if (selectedService === 'all') {
      await this.loginToAllServices();
    } else {
      const service = SUPPORTED_SERVICES.find(s => s.name === selectedService);
      if (service) {
        await ServiceManager.loginToService(service);
        
        // Ask if they want to continue with other services
        const { continueAuth } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'continueAuth',
            message: 'Would you like to authenticate with another service?',
            default: true,
          },
        ]);

        if (continueAuth) {
          await this.interactiveLogin();
        }
      }
    }
  }
}

// Create individual service login commands
export class SlackLoginCommand extends BaseCommand {
  name = 'slack';
  description = 'Login to Slack';

  protected configureOptions(command: Command): void {
    command.argument('<action>', 'Action to perform (login)');
  }

  async execute(_options: unknown, command?: Command): Promise<void> {
    const action = command?.args[0];
    if (action === 'login') {
      const service = SUPPORTED_SERVICES.find(s => s.name === 'slack');
      if (service) {
        await ServiceManager.loginToService(service);
      }
    } else {
      this.logger.error(`Unknown action: ${action}`);
    }
  }
}

export class VercelServiceLoginCommand extends BaseCommand {
  name = 'vercel';
  description = 'Login to Vercel';

  protected configureOptions(command: Command): void {
    command.argument('<action>', 'Action to perform (login)');
  }

  async execute(_options: unknown, command?: Command): Promise<void> {
    const action = command?.args[0];
    if (action === 'login') {
      const service = SUPPORTED_SERVICES.find(s => s.name === 'vercel');
      if (service) {
        await ServiceManager.loginToService(service);
      }
    } else {
      this.logger.error(`Unknown action: ${action}`);
    }
  }
}

export class SupabaseLoginCommand extends BaseCommand {
  name = 'supabase';
  description = 'Login to Supabase';

  protected configureOptions(command: Command): void {
    command.argument('<action>', 'Action to perform (login)');
  }

  async execute(_options: unknown, command?: Command): Promise<void> {
    const action = command?.args[0];
    if (action === 'login') {
      const service = SUPPORTED_SERVICES.find(s => s.name === 'supabase');
      if (service) {
        await ServiceManager.loginToService(service);
      }
    } else {
      this.logger.error(`Unknown action: ${action}`);
    }
  }
}

export class GhLoginCommand extends BaseCommand {
  name = 'gh';
  description = 'Login to GitHub';

  protected configureOptions(command: Command): void {
    command.argument('<action>', 'Action to perform (login)');
  }

  async execute(_options: unknown, command?: Command): Promise<void> {
    const action = command?.args[0];
    if (action === 'login') {
      const service = SUPPORTED_SERVICES.find(s => s.name === 'gh');
      if (service) {
        await ServiceManager.loginToService(service);
      }
    } else {
      this.logger.error(`Unknown action: ${action}`);
    }
  }
}

export class MermaidChartLoginCommand extends BaseCommand {
  name = 'mermaidchart';
  description = 'Login to MermaidChart';

  protected configureOptions(command: Command): void {
    command.argument('<action>', 'Action to perform (login)');
  }

  async execute(_options: unknown, command?: Command): Promise<void> {
    const action = command?.args[0];
    if (action === 'login') {
      const service = SUPPORTED_SERVICES.find(s => s.name === 'mermaidchart');
      if (service) {
        await ServiceManager.loginToService(service);
      }
    } else {
      this.logger.error(`Unknown action: ${action}`);
    }
  }
}

export class FlyioLoginCommand extends BaseCommand {
  name = 'fly';
  description = 'Login to Fly.io';

  protected configureOptions(command: Command): void {
    command.argument('<action>', 'Action to perform (login)');
  }

  async execute(_options: unknown, command?: Command): Promise<void> {
    const action = command?.args[0];
    if (action === 'login') {
      const service = SUPPORTED_SERVICES.find(s => s.name === 'flyio');
      if (service) {
        await ServiceManager.loginToService(service);
      }
    } else {
      this.logger.error(`Unknown action: ${action}`);
    }
  }
}

export class ClaudeLoginCommand extends BaseCommand {
  name = 'claude';
  description = 'Login to Claude Code';

  protected configureOptions(command: Command): void {
    command.argument('<action>', 'Action to perform (login)');
  }

  async execute(_options: unknown, command?: Command): Promise<void> {
    const action = command?.args[0];
    if (action === 'login') {
      const service = SUPPORTED_SERVICES.find(s => s.name === 'claude');
      if (service) {
        await ServiceManager.loginToService(service);
      }
    } else {
      this.logger.error(`Unknown action: ${action}`);
    }
  }
}

export class CodexLoginCommand extends BaseCommand {
  name = 'codex';
  description = 'Login to OpenAI Codex';

  protected configureOptions(command: Command): void {
    command.argument('<action>', 'Action to perform (login)');
  }

  async execute(_options: unknown, command?: Command): Promise<void> {
    const action = command?.args[0];
    if (action === 'login') {
      const service = SUPPORTED_SERVICES.find(s => s.name === 'codex');
      if (service) {
        await ServiceManager.loginToService(service);
      }
    } else {
      this.logger.error(`Unknown action: ${action}`);
    }
  }
}

export class LinearLoginCommand extends BaseCommand {
  name = 'linear';
  description = 'Login to Linear';

  protected configureOptions(command: Command): void {
    command.argument('<action>', 'Action to perform (login)');
  }

  async execute(_options: unknown, command?: Command): Promise<void> {
    const action = command?.args[0];
    if (action === 'login') {
      const service = SUPPORTED_SERVICES.find(s => s.name === 'linear');
      if (service) {
        await ServiceManager.loginToService(service);
      }
    } else {
      this.logger.error(`Unknown action: ${action}`);
    }
  }
}
