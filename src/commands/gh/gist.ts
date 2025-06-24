import { Command } from 'commander';
import { GitHubCommand } from './base';

export class GhGistCommand extends GitHubCommand {
  name = 'gist';
  description = 'Gist management (create and list gists)';

  protected configureOptions(command: Command): void {
    command
      .argument('[subcommand]', 'gist subcommand (create, list, view, edit, delete, clone)')
      .argument('[id]', 'Gist ID')
      .option('-d, --desc <description>', 'A description for the gist')
      .option('-f, --filename <filename>', 'Filename for the gist file')
      .option('-p, --public', 'Make the gist public')
      .option('-w, --web', 'Open the web browser')
      .option('-L, --limit <number>', 'Maximum number of gists to fetch')
      .option('--secret', 'List only secret gists')
      .option('--public', 'List only public gists');
  }

  async execute(options: any, command?: Command): Promise<void> {
    const args = command?.args || [];
    const subcommand = args[0] || 'list';
    const ghArgs = ['gist', subcommand];

    // Add gist ID if provided
    if (args[1] && ['view', 'edit', 'delete', 'clone'].includes(subcommand)) {
      ghArgs.push(args[1]);
    }

    // Handle options based on subcommand
    if (subcommand === 'create') {
      if (options.desc) ghArgs.push('--desc', options.desc);
      if (options.filename) ghArgs.push('--filename', options.filename);
      if (options.public) ghArgs.push('--public');
      if (options.web) ghArgs.push('--web');
      // For create, we need to pass stdin or files
      // The user should pipe content or specify files
    } else if (subcommand === 'list') {
      if (options.limit) ghArgs.push('--limit', options.limit);
      if (options.secret) ghArgs.push('--secret');
      if (options.public) ghArgs.push('--public');
    } else if (subcommand === 'view' || subcommand === 'edit') {
      if (options.web) ghArgs.push('--web');
    }

    await this.executeGhCommand(ghArgs);
  }
}
