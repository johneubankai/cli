import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { execSync } from 'child_process';

interface VercelEnvOptions {
  add?: boolean;
  rm?: boolean;
  pull?: boolean;
  ls?: boolean;
}

export class VercelEnvCommand extends SubCommand {
  parentCommand = 'vercel';
  name = 'env';
  description = 'Manage environment variables in Vercel';

  protected configureOptions(command: Command): void {
    command
      .option('--add', 'Add environment variable')
      .option('--rm', 'Remove environment variable')
      .option('--pull', 'Pull environment variables')
      .option('--ls', 'List environment variables')
      .argument('[key]', 'Environment variable key')
      .argument('[value]', 'Environment variable value (for add)');
  }

  async execute(options: VercelEnvOptions, command?: Command): Promise<void> {
    const args = command?.args || [];
    
    try {
      let vercelCommand = 'vercel env';
      
      if (options.add && args[0] && args[1]) {
        vercelCommand += ` add ${args[0]} ${args[1]}`;
      } else if (options.rm && args[0]) {
        vercelCommand += ` rm ${args[0]}`;
      } else if (options.pull) {
        vercelCommand += ' pull';
      } else {
        vercelCommand += ' ls';
      }

      const output = execSync(vercelCommand, {
        stdio: options.pull ? 'inherit' : 'pipe',
        encoding: 'utf-8'
      });
      
      if (!options.pull) {
        this.logger.info(output);
      }
    } catch (error) {
      this.logger.error('Failed to manage Vercel environment variables');
      throw error;
    }
  }
}
