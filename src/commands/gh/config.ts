import { Command } from 'commander';
import { GitHubCommand } from './base';

export class GhConfigCommand extends GitHubCommand {
  name = 'config';
  description = 'GitHub CLI configuration (view/set config for GitHub CLI)';

  protected configureOptions(command: Command): void {
    command
      .argument('[subcommand]', 'config subcommand (get, set, list)')
      .argument('[key]', 'Configuration key')
      .argument('[value]', 'Configuration value (for set command)')
      .option('-h, --host <hostname>', 'Get per-host configuration');
  }

  async execute(options: any, command?: Command): Promise<void> {
    const args = command?.args || [];
    const subcommand = args[0] || 'list';
    const ghArgs = ['config', subcommand];

    if (subcommand === 'get' && args[1]) {
      ghArgs.push(args[1]);
      if (options.host) ghArgs.push('--host', options.host);
    } else if (subcommand === 'set' && args[1] && args[2]) {
      ghArgs.push(args[1], args[2]);
      if (options.host) ghArgs.push('--host', options.host);
    }

    await this.executeGhCommand(ghArgs);
  }
}
