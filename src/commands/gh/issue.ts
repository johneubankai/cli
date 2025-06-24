import { Command } from 'commander';
import { GitHubCommand } from './base';

export class GhIssueCommand extends GitHubCommand {
  name = 'issue';
  description = 'Issue tracking (create, list, view issues)';

  protected configureOptions(command: Command): void {
    command
      .argument('[subcommand]', 'issue subcommand (create, list, status, view, close, reopen, edit, comment, delete, pin, unpin, transfer)')
      .argument('[number]', 'Issue number')
      .option('-t, --title <title>', 'Issue title')
      .option('-b, --body <body>', 'Issue body')
      .option('-l, --label <labels...>', 'Add labels by name')
      .option('-a, --assignee <assignees...>', 'Assign people by their login')
      .option('-p, --project <project>', 'Add the issue to a project')
      .option('-m, --milestone <milestone>', 'Add the issue to a milestone')
      .option('-w, --web', 'Open the browser to create an issue')
      .option('-s, --state <state>', 'Filter by state: {open|closed|all}')
      .option('-L, --limit <number>', 'Maximum number of issues to fetch')
      .option('-A, --author <login>', 'Filter by author')
      .option('-S, --search <query>', 'Search issues with a query')
      .option('--mention <login>', 'Filter by mention')
      .option('--json <fields>', 'Output JSON with the specified fields');
  }

  async execute(options: any, command?: Command): Promise<void> {
    const args = command?.args || [];
    const subcommand = args[0] || 'list';
    const ghArgs = ['issue', subcommand];

    // Add issue number if provided
    if (args[1] && ['view', 'close', 'reopen', 'edit', 'comment', 'delete', 'pin', 'unpin'].includes(subcommand)) {
      ghArgs.push(args[1]);
    }

    // Handle options based on subcommand
    if (subcommand === 'create') {
      if (options.title) ghArgs.push('--title', options.title);
      if (options.body) ghArgs.push('--body', options.body);
      if (options.label) options.label.forEach((l: string) => ghArgs.push('--label', l));
      if (options.assignee) options.assignee.forEach((a: string) => ghArgs.push('--assignee', a));
      if (options.project) ghArgs.push('--project', options.project);
      if (options.milestone) ghArgs.push('--milestone', options.milestone);
      if (options.web) ghArgs.push('--web');
    } else if (subcommand === 'list' || subcommand === 'status') {
      if (options.state) ghArgs.push('--state', options.state);
      if (options.limit) ghArgs.push('--limit', options.limit);
      if (options.author) ghArgs.push('--author', options.author);
      if (options.assignee) ghArgs.push('--assignee', options.assignee[0]);
      if (options.label) ghArgs.push('--label', options.label[0]);
      if (options.search) ghArgs.push('--search', options.search);
      if (options.mention) ghArgs.push('--mention', options.mention);
      if (options.json) ghArgs.push('--json', options.json);
    }

    await this.executeGhCommand(ghArgs);
  }
}
