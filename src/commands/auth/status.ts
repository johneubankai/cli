import { Command } from 'commander';
import chalk from 'chalk';
import { BaseCommand } from '../base';
import { ServiceManager } from '../../utils/service-manager';
import { SUPPORTED_SERVICES } from '../../types/services';

export class StatusCommand extends BaseCommand {
  name = 'status';
  description = 'Check authentication status for all services';

  protected configureOptions(command: Command): void {
    command.option('-s, --service <name>', 'Check status for a specific service');
  }

  async execute(options: { service?: string }): Promise<void> {
    if (options.service) {
      await this.checkSpecificService(options.service);
    } else {
      await this.checkAllServices();
    }
  }

  private async checkSpecificService(serviceName: string): Promise<void> {
    const service = SUPPORTED_SERVICES.find(s => s.name === serviceName);
    
    if (!service) {
      this.logger.error(`Unknown service: ${serviceName}`);
      this.logger.info(`Supported services: ${SUPPORTED_SERVICES.map(s => s.name).join(', ')}`);
      return;
    }

    const isAuthenticated = await ServiceManager.checkServiceStatus(service.name);
    const status = isAuthenticated ? chalk.green('✓ Authenticated') : chalk.red('✗ Not authenticated');
    
    this.logger.info(`${service.displayName}: ${status}`);
  }

  private async checkAllServices(): Promise<void> {
    this.logger.info(chalk.bold('\n🔐 Authentication Status\n'));
    
    const statuses = await ServiceManager.getAllServiceStatuses();
    let authenticatedCount = 0;
    
    for (const service of SUPPORTED_SERVICES) {
      const isAuthenticated = statuses.get(service.name) || false;
      if (isAuthenticated) authenticatedCount++;
      
      const status = isAuthenticated ? chalk.green('✓') : chalk.gray('○');
      const statusText = isAuthenticated ? chalk.green('Authenticated') : chalk.gray('Not authenticated');
      
      this.logger.log(`${status} ${service.displayName.padEnd(20)} ${statusText}`);
    }
    
    this.logger.info(`\n${chalk.bold('Summary:')} ${authenticatedCount}/${SUPPORTED_SERVICES.length} services authenticated`);
    
    if (authenticatedCount < SUPPORTED_SERVICES.length) {
      this.logger.info(`\nRun ${chalk.cyan('jx login')} to authenticate with services`);
    }
  }
}
