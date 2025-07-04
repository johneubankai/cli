#!/usr/bin/env node

import { Command } from 'commander';
import { HelpFormatter } from './utils/helpFormatter';
import {
  LoginCommand,
  LogoutCommand,
  StatusCommand,
  VercelDeployCommand,
  VercelDevCommand,
  VercelDomainsCommand,
  VercelLinkCommand,
  VercelLogsCommand,
  VercelListCommand,
  VercelBuildCommand,
  SlackServiceLoginCommand,
  SupabaseLoginCommand,
  FlyioLoginCommand,
  LinearLoginCommand,
  GhAuthCommand,
  GhConfigCommand,
  GhRepoCommand,
  GhIssueCommand,
  GhPrCommand,
  GhGistCommand,
  SlackLoginCommand,
  SlackCreateCommand,
  SlackRunCommand,
  SlackDeployCommand,
  SlackEnvCommand,
  SlackDoctorCommand,
  FlyLaunchCommand,
  FlyDeployCommand,
  FlyAppsCommand,
  FlyLogsCommand,
  FlySecretsCommand,
  FlyLoginCommand,
  CodexCommand,
  ClaudeCommand,
  MermaidCommand,
  MermaidChartCommand,
  LinearInitCommand,
  LinearCreateCommand,
  LinearListCommand,
  LinearViewCommand,
  CheckFunctionsCommand,
  VaultListCommand,
  VaultGetCommand,
  VaultSetCommand,
  VaultRemoveCommand,
  SbCommand,
  SbLinkCommand,
  SbDbCommand,
  SbFunctionsCommand,
  NewCommand,
  NewTaskCommand,
  DebugTasksCommand,
} from './commands';

const program = new Command();

program
  .name('jx')
  .description('CLI tool that mimics Vercel CLI commands')
  .version('1.0.0');

// Configure custom help
const helpFormatter = new HelpFormatter();
program.configureHelp({
  formatHelp: (cmd) => helpFormatter.formatHelp(cmd)
});

// Register all commands
const commands = [
  new LoginCommand(),
  new LogoutCommand(),
  new StatusCommand(),
  // Vercel subcommands
  new VercelDeployCommand(),
  new VercelDevCommand(),
  new VercelDomainsCommand(),
  new VercelLinkCommand(),
  new VercelLogsCommand(),
  new VercelListCommand(),
  new VercelBuildCommand(),
  // Service login commands
  new SlackServiceLoginCommand(),
  new SupabaseLoginCommand(),
  new FlyioLoginCommand(),
  new LinearLoginCommand(),
  // GitHub CLI commands
  new GhAuthCommand(),
  new GhConfigCommand(),
  new GhRepoCommand(),
  new GhIssueCommand(),
  new GhPrCommand(),
  new GhGistCommand(),
  // Slack CLI commands
  new SlackLoginCommand(),
  new SlackCreateCommand(),
  new SlackRunCommand(),
  new SlackDeployCommand(),
  new SlackEnvCommand(),
  new SlackDoctorCommand(),
  // Fly.io commands
  new FlyLaunchCommand(),
  new FlyDeployCommand(),
  new FlyAppsCommand(),
  new FlyLogsCommand(),
  new FlySecretsCommand(),
  new FlyLoginCommand(),
  // AI assistant commands
  new CodexCommand(),
  new ClaudeCommand(),
  // Mermaid commands
  new MermaidCommand(),
  new MermaidChartCommand(),
  // Linear commands
  new LinearInitCommand(),
  new LinearCreateCommand(),
  new LinearListCommand(),
  new LinearViewCommand(),
  // Check commands
  new CheckFunctionsCommand(),
  // Vault commands
  new VaultListCommand(),
  new VaultGetCommand(),
  new VaultSetCommand(),
  new VaultRemoveCommand(),
  // Supabase commands
  new SbCommand(),
  new SbLinkCommand(),
  new SbDbCommand(),
  new SbFunctionsCommand(),
  // New commands
  new NewCommand(),
  new NewTaskCommand(),
  new DebugTasksCommand(),
];

commands.forEach((command) => command.register(program));

// Parse command-line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
