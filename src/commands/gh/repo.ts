import { Command } from 'commander';
import { GitHubCommand } from './base';

export class GhRepoCommand extends GitHubCommand {
  name = 'repo';
  description = 'Repository management (create, clone, view repos)';

  protected configureOptions(command: Command): void {
    command
      .argument('[subcommand]', 'repo subcommand (clone, create, fork, list, view, delete, archive, unarchive, edit, sync)')
      .argument('[repository]', 'Repository name (OWNER/REPO format)')
      .option('-p, --public', 'Make the repository public')
      .option('--private', 'Make the repository private')
      .option('-d, --description <description>', 'Repository description')
      .option('-h, --homepage <url>', 'Repository home page URL')
      .option('-y, --confirm', 'Confirm operation without prompting')
      .option('--add-readme', 'Add a README file')
      .option('--license <license>', 'Specify an open source license')
      .option('--gitignore <language>', 'Specify a .gitignore template')
      .option('-t, --team <team>', 'The name of the organization team to be granted access')
      .option('-c, --clone', 'Clone the new repository to the current directory')
      .option('--disable-issues', 'Disable issues in the new repository')
      .option('--disable-wiki', 'Disable wiki in the new repository');
  }

  async execute(options: any, command?: Command): Promise<void> {
    const args = command?.args || [];
    const subcommand = args[0] || 'list';
    const ghArgs = ['repo', subcommand];

    // Add repository name if provided
    if (args[1] && subcommand !== 'create' && subcommand !== 'list') {
      ghArgs.push(args[1]);
    }

    // Handle options based on subcommand
    if (subcommand === 'create') {
      if (args[1]) ghArgs.push(args[1]);
      if (options.public) ghArgs.push('--public');
      if (options.private) ghArgs.push('--private');
      if (options.description) ghArgs.push('--description', options.description);
      if (options.homepage) ghArgs.push('--homepage', options.homepage);
      if (options.addReadme) ghArgs.push('--add-readme');
      if (options.license) ghArgs.push('--license', options.license);
      if (options.gitignore) ghArgs.push('--gitignore', options.gitignore);
      if (options.team) ghArgs.push('--team', options.team);
      if (options.clone) ghArgs.push('--clone');
      if (options.disableIssues) ghArgs.push('--disable-issues');
      if (options.disableWiki) ghArgs.push('--disable-wiki');
    } else if (subcommand === 'delete' || subcommand === 'archive' || subcommand === 'unarchive') {
      if (options.confirm) ghArgs.push('--yes');
    }

    await this.executeGhCommand(ghArgs);
  }
}
