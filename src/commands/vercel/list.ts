import { SubCommand } from '../subcommand';
import { Command } from 'commander';
import { Deployment } from '../../types';
import { icons } from '../../assets/icons';

interface VercelListOptions {
  limit?: string;
  since?: string;
}

export class VercelListCommand extends SubCommand {
  parentCommand = 'vercel';
  name = 'list';
  description = 'List deployments';
  aliases = ['ls'];

  protected configureOptions(command: Command): void {
    command
      .option('-n, --limit <number>', 'Number of deployments to show', '10')
      .option('-s, --since <date>', 'Show deployments since date');
  }

  async execute(options: VercelListOptions): Promise<void> {
    const spinner = this.logger.spinner('Fetching deployments...');

    try {
      const token = await this.config.getAuthToken();
      if (!token) {
        spinner.fail('Not authenticated');
        this.logger.error('Please run "jx login" first');
        process.exit(1);
      }

      const localConfig = await this.config.getLocalConfig();
      if (!localConfig?.projectId) {
        spinner.fail('No project linked');
        this.logger.error('Please run "jx vercel link" first');
        process.exit(1);
      }

      const limit = parseInt(options.limit || '10', 10);
      const deployments = this.getMockDeployments(limit);

      spinner.succeed('Deployments loaded');

      if (deployments.length === 0) {
        this.logger.info('No deployments found');
        return;
      }

      this.logger.log('\nDeployments:\n');
      
      deployments.forEach((deployment, index) => {
        const age = this.getRelativeTime(deployment.createdAt);
        const status = this.getStatusSymbol(deployment.state);
        
        this.logger.log(`  ${status} ${deployment.url}`);
        this.logger.log(`    ${deployment.id} - ${deployment.state} - ${age}`);
        
        if (index < deployments.length - 1) {
          this.logger.log('');
        }
      });
    } catch (error) {
      spinner.fail('Failed to fetch deployments');
      throw error;
    }
  }

  private getMockDeployments(limit: number): Deployment[] {
    const deployments: Deployment[] = [];
    
    for (let i = 0; i < limit; i++) {
      deployments.push({
        id: `dpl_${Math.random().toString(36).substr(2, 9)}`,
        url: `https://myapp-${Math.random().toString(36).substr(2, 5)}.vercel.app`,
        createdAt: new Date(Date.now() - i * 3600000), // 1 hour apart
        state: i === 0 ? 'READY' : i === 1 ? 'BUILDING' : 'READY',
        creator: 'cli',
      });
    }
    
    return deployments;
  }

  private getStatusSymbol(state: string): string {
    switch (state) {
      case 'READY': return icons.success;
      case 'ERROR': return icons.error;
      case 'BUILDING': return icons.spinner;
      case 'QUEUED': return icons.empty;
      case 'CANCELED': return icons.cancelled;
      default: return '?';
    }
  }

  private getRelativeTime(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }
}
