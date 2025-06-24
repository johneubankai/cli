import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { execSync } from 'child_process';

interface VercelDomainsOptions {
  add?: string;
  rm?: string;
  ls?: boolean;
}

export class VercelDomainsCommand extends SubCommand {
  parentCommand = 'vercel';
  name = 'domains';
  description = 'Manage domains in Vercel';

  protected configureOptions(command: Command): void {
    command
      .option('--add <domain>', 'Add a domain')
      .option('--rm <domain>', 'Remove a domain')
      .option('--ls', 'List domains');
  }

  async execute(options: VercelDomainsOptions): Promise<void> {
    try {
      let vercelCommand = 'vercel domains';
      
      if (options.add) {
        vercelCommand += ` add ${options.add}`;
      } else if (options.rm) {
        vercelCommand += ` rm ${options.rm}`;
      } else {
        vercelCommand += ' ls';
      }

      const output = execSync(vercelCommand, {
        stdio: 'pipe',
        encoding: 'utf-8'
      });
      
      this.logger.info(output);
    } catch (error) {
      this.logger.error('Failed to manage Vercel domains');
      throw error;
    }
  }
}
