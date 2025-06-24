import { Command } from 'commander';
import { GitHubCommand } from './base';

export class GhAuthCommand extends GitHubCommand {
  name = 'auth';
  description = 'GitHub authentication (login/logout using GitHub CLI credentials)';

  protected configureOptions(command: Command): void {
    command
      .argument('[subcommand]', 'auth subcommand (login, logout, status, refresh, token)')
      .option('-h, --hostname <hostname>', 'The hostname of the GitHub instance to authenticate with')
      .option('-s, --scopes <scopes>', 'Additional authentication scopes to request')
      .option('-w, --web', 'Open a browser to authenticate')
      .option('-p, --git-protocol <protocol>', 'The protocol to use for git operations')
      .option('--insecure-storage', 'Save authentication credentials in plain text instead of credential store');
  }

  async execute(options: any, command?: Command): Promise<void> {
    const subcommand = command?.args[0] || 'status';
    const ghArgs = ['auth', subcommand];

    // Add options based on subcommand
    if (subcommand === 'login') {
      if (options.hostname) ghArgs.push('--hostname', options.hostname);
      if (options.scopes) ghArgs.push('--scopes', options.scopes);
      if (options.web) ghArgs.push('--web');
      if (options.gitProtocol) ghArgs.push('--git-protocol', options.gitProtocol);
      if (options.insecureStorage) ghArgs.push('--insecure-storage');
    } else if (subcommand === 'logout') {
      if (options.hostname) ghArgs.push('--hostname', options.hostname);
    } else if (subcommand === 'token') {
      if (options.hostname) ghArgs.push('--hostname', options.hostname);
    }

    await this.executeGhCommand(ghArgs);
  }
}
