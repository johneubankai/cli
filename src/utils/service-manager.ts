import { spawn } from 'child_process';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { ConfigManager } from './config';
import { SUPPORTED_SERVICES, ServiceConfig } from '../types/services';
import { Logger } from './logger';

export class ServiceManager {
  static async loginToService(service: ServiceConfig): Promise<boolean> {
    const spinner = Logger.spinner(`Logging into ${service.displayName}...`);
    
    try {
      spinner.stop();
      
      // Check if already logged in
      const existingAuth = await ConfigManager.getServiceAuth(service.name);
      if (existingAuth && existingAuth.token) {
        const { reauth } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'reauth',
            message: `You are already logged into ${service.displayName}. Re-authenticate?`,
            default: false,
          },
        ]);
        
        if (!reauth) {
          Logger.info(`Skipping ${service.displayName} - already authenticated`);
          return true;
        }
      }

      Logger.info(`\n${chalk.bold(`Setting up ${service.displayName}:`)}`);
      
      switch (service.authType) {
        case 'cli':
          return await this.handleCliAuth(service);
        case 'api-key':
          return await this.handleApiKeyAuth(service);
        case 'oauth':
          return await this.handleOAuthAuth(service);
        case 'token':
          return await this.handleTokenAuth(service);
        default:
          Logger.warn(`Authentication type ${service.authType} not implemented for ${service.displayName}`);
          return false;
      }
    } catch (error) {
      spinner.fail(`Failed to authenticate with ${service.displayName}`);
      Logger.error(error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  private static async handleCliAuth(service: ServiceConfig): Promise<boolean> {
    Logger.info(`This will run: ${chalk.cyan(service.authCommand)}`);
    
    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: `Proceed with ${service.displayName} CLI authentication?`,
        default: true,
      },
    ]);

    if (!proceed) {
      return false;
    }

    return new Promise((resolve) => {
      const [command, ...args] = service.authCommand.split(' ');
      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
      });

      child.on('close', async (code) => {
        if (code === 0) {
          // Store a placeholder to indicate successful auth
          await ConfigManager.setServiceAuth(service.name, {
            token: 'CLI_AUTHENTICATED',
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
          });
          Logger.success(`Successfully authenticated with ${service.displayName}`);
          resolve(true);
        } else {
          Logger.error(`Failed to authenticate with ${service.displayName}`);
          resolve(false);
        }
      });

      child.on('error', (error) => {
        Logger.error(`Failed to run ${service.authCommand}: ${error.message}`);
        resolve(false);
      });
    });
  }

  private static async handleApiKeyAuth(service: ServiceConfig): Promise<boolean> {
    const { apiKey } = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: `Enter your ${service.displayName} API key:`,
        validate: (input: string) => input.length > 0 || 'API key is required',
      },
    ]);

    await ConfigManager.setServiceAuth(service.name, {
      token: apiKey,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    });

    Logger.success(`Successfully stored ${service.displayName} API key`);
    return true;
  }

  private static async handleOAuthAuth(service: ServiceConfig): Promise<boolean> {
    Logger.info(`OAuth authentication for ${service.displayName} requires browser-based flow.`);
    Logger.info(`Please visit: ${service.authUrl || `https://${service.name}.com/oauth`}`);
    
    const { token } = await inquirer.prompt([
      {
        type: 'password',
        name: 'token',
        message: `Paste your ${service.displayName} access token here:`,
        validate: (input: string) => input.length > 0 || 'Token is required',
      },
    ]);

    await ConfigManager.setServiceAuth(service.name, {
      token,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
    });

    Logger.success(`Successfully authenticated with ${service.displayName}`);
    return true;
  }

  private static async handleTokenAuth(service: ServiceConfig): Promise<boolean> {
    const { token } = await inquirer.prompt([
      {
        type: 'password',
        name: 'token',
        message: `Enter your ${service.displayName} authentication token:`,
        validate: (input: string) => input.length > 0 || 'Token is required',
      },
    ]);

    await ConfigManager.setServiceAuth(service.name, {
      token,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    });

    Logger.success(`Successfully authenticated with ${service.displayName}`);
    return true;
  }

  static async checkServiceStatus(serviceName: string): Promise<boolean> {
    const auth = await ConfigManager.getServiceAuth(serviceName);
    if (!auth || !auth.token) {
      return false;
    }

    // Check if token is expired
    if (auth.expiresAt) {
      const expiryDate = new Date(auth.expiresAt);
      if (expiryDate < new Date()) {
        return false;
      }
    }

    return true;
  }

  static async getAllServiceStatuses(): Promise<Map<string, boolean>> {
    const statuses = new Map<string, boolean>();
    
    for (const service of SUPPORTED_SERVICES) {
      const isAuthenticated = await this.checkServiceStatus(service.name);
      statuses.set(service.name, isAuthenticated);
    }
    
    return statuses;
  }
}
