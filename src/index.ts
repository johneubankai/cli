#!/usr/bin/env node

import { Command } from 'commander';
import {
  LoginCommand,
  LogoutCommand,
  StatusCommand,
  DeployCommand,
  DevCommand,
  BuildCommand,
  LinkCommand,
  EnvCommand,
  AddCommand,
  RemoveCommand,
  PullCommand,
  ListCommand,
  LogsCommand,
  VercelDeployCommand,
  VercelDevCommand,
  VercelEnvCommand,
  VercelDomainsCommand,
  SlackServiceLoginCommand,
  VercelServiceLoginCommand,
  SupabaseLoginCommand,
  GhLoginCommand,
  MermaidChartLoginCommand,
  FlyioLoginCommand,
  ClaudeLoginCommand,
  CodexLoginCommand,
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
} from './commands';

const program = new Command();

program
  .name('jx')
  .description('CLI tool that mimics Vercel CLI commands')
  .version('1.0.0');

// Register all commands
const commands = [
  new LoginCommand(),
  new LogoutCommand(),
  new StatusCommand(),
  new DeployCommand(),
  new DevCommand(),
  new BuildCommand(),
  new LinkCommand(),
  new EnvCommand(),
  new AddCommand(),
  new RemoveCommand(),
  new PullCommand(),
  new ListCommand(),
  new LogsCommand(),
  // Vercel subcommands
  new VercelDeployCommand(),
  new VercelDevCommand(),
  new VercelEnvCommand(),
  new VercelDomainsCommand(),
  // Service login commands
  new SlackServiceLoginCommand(),
  new VercelServiceLoginCommand(),
  new SupabaseLoginCommand(),
  new GhLoginCommand(),
  new MermaidChartLoginCommand(),
  new FlyioLoginCommand(),
  new ClaudeLoginCommand(),
  new CodexLoginCommand(),
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
];

commands.forEach((command) => command.register(program));

// Parse command-line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
