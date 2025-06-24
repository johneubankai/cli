import { Command } from 'commander';
import { GitHubCommand } from './base';

export class GhPrCommand extends GitHubCommand {
  name = 'pr';
  description = 'Pull request handling (create, list, merge PRs)';

  protected configureOptions(command: Command): void {
    command
      .argument('[subcommand]', 'pr subcommand (create, list, status, view, checkout, merge, close, reopen, ready, review, checks, diff, edit, comment)')
      .argument('[number]', 'Pull request number')
      .option('-t, --title <title>', 'Title for the pull request')
      .option('-b, --body <body>', 'Body for the pull request')
      .option('-B, --base <branch>', 'The base branch')
      .option('-H, --head <branch>', 'The head branch')
      .option('-d, --draft', 'Mark pull request as a draft')
      .option('-f, --fill', 'Fill title and body from commits')
      .option('-w, --web', 'Open the web browser to create a pull request')
      .option('-a, --assignee <assignees...>', 'Assign people by their login')
      .option('-l, --label <labels...>', 'Add labels by name')
      .option('-m, --milestone <milestone>', 'Add the pull request to a milestone')
      .option('-p, --project <project>', 'Add the pull request to a project')
      .option('-r, --reviewer <reviewers...>', 'Request reviews from people')
      .option('-s, --state <state>', 'Filter by state: {open|closed|merged|all}')
      .option('-L, --limit <number>', 'Maximum number of pull requests to fetch')
      .option('--merge', 'Merge the pull request')
      .option('--squash', 'Squash and merge the pull request')
      .option('--rebase', 'Rebase and merge the pull request')
      .option('--auto', 'Enable auto-merge for the pull request')
      .option('--delete-branch', 'Delete the branch after merge');
  }

  async execute(options: any, command?: Command): Promise<void> {
    const args = command?.args || [];
    const subcommand = args[0] || 'list';
    const ghArgs = ['pr', subcommand];

    // Add PR number if provided
    if (args[1] && ['view', 'checkout', 'merge', 'close', 'reopen', 'ready', 'review', 'checks', 'diff', 'edit', 'comment'].includes(subcommand)) {
      ghArgs.push(args[1]);
    }

    // Handle options based on subcommand
    if (subcommand === 'create') {
      if (options.title) ghArgs.push('--title', options.title);
      if (options.body) ghArgs.push('--body', options.body);
      if (options.base) ghArgs.push('--base', options.base);
      if (options.head) ghArgs.push('--head', options.head);
      if (options.draft) ghArgs.push('--draft');
      if (options.fill) ghArgs.push('--fill');
      if (options.web) ghArgs.push('--web');
      if (options.assignee) options.assignee.forEach((a: string) => ghArgs.push('--assignee', a));
      if (options.label) options.label.forEach((l: string) => ghArgs.push('--label', l));
      if (options.milestone) ghArgs.push('--milestone', options.milestone);
      if (options.project) ghArgs.push('--project', options.project);
      if (options.reviewer) options.reviewer.forEach((r: string) => ghArgs.push('--reviewer', r));
    } else if (subcommand === 'list' || subcommand === 'status') {
      if (options.state) ghArgs.push('--state', options.state);
      if (options.limit) ghArgs.push('--limit', options.limit);
      if (options.assignee) ghArgs.push('--assignee', options.assignee[0]);
      if (options.label) ghArgs.push('--label', options.label[0]);
    } else if (subcommand === 'merge') {
      if (options.merge) ghArgs.push('--merge');
      if (options.squash) ghArgs.push('--squash');
      if (options.rebase) ghArgs.push('--rebase');
      if (options.auto) ghArgs.push('--auto');
      if (options.deleteBranch) ghArgs.push('--delete-branch');
    }

    await this.executeGhCommand(ghArgs);
  }
}
