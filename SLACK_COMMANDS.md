# Slack CLI Integration

This document describes the Slack CLI commands integrated into the `jx` CLI tool.

## Available Commands

All Slack commands follow the pattern: `jx slack <command> [options]`

### 1. `jx slack login`
**Description**: Log in to Slack via Slack CLI (authenticates CLI with workspace)

**Options**:
- `-w, --workspace <workspace>`: Specific workspace to log in to
- `-t, --team <team>`: Team ID to authenticate with
- `--no-browser`: Skip opening a browser for authentication

**Example**:
```bash
jx slack login --workspace my-workspace
```

### 2. `jx slack create`
**Description**: Create a new Slack app project (scaffold app)

**Usage**: `jx slack create [app-name] [options]`

**Options**:
- `-t, --template <template>`: Template to use for the app
- `-d, --directory <directory>`: Directory to create the app in
- `--typescript`: Use TypeScript template
- `--javascript`: Use JavaScript template
- `--bolt`: Use Bolt framework
- `--deno`: Use Deno runtime

**Example**:
```bash
jx slack create my-app --typescript --bolt
```

### 3. `jx slack run`
**Description**: Start a local Slack app dev server (for testing)

**Options**:
- `-p, --port <port>`: Port to run the dev server on
- `-w, --workspace <workspace>`: Workspace to run the app in
- `-e, --env <env>`: Environment file to use
- `--local`: Run in local development mode
- `--debug`: Enable debug logging
- `--no-watch`: Disable file watching

**Example**:
```bash
jx slack run --port 3000 --debug
```

### 4. `jx slack deploy`
**Description**: Deploy the app to the Slack platform (production or staging)

**Options**:
- `-w, --workspace <workspace>`: Workspace to deploy to
- `-e, --environment <environment>`: Environment to deploy to (production, staging)
- `-f, --force`: Force deployment without confirmation
- `--prod`: Deploy to production environment
- `--staging`: Deploy to staging environment
- `--dry-run`: Preview deployment without actually deploying

**Example**:
```bash
jx slack deploy --prod --workspace my-workspace
```

### 5. `jx slack env`
**Description**: Manage Slack app environment variables (add, list, remove)

**Usage**: `jx slack env [subcommand] [key] [value] [options]`

**Subcommands**:
- `add <key> <value>`: Add a new environment variable
- `list`: List all environment variables
- `remove <key>`: Remove an environment variable

**Options**:
- `-w, --workspace <workspace>`: Workspace to manage env vars for
- `-e, --environment <environment>`: Environment to manage (production, staging, local)
- `-f, --force`: Force operation without confirmation
- `--secret`: Mark variable as secret (for add subcommand)

**Examples**:
```bash
jx slack env add API_KEY my-secret-key --secret
jx slack env list --workspace my-workspace
jx slack env remove API_KEY --force
```

### 6. `jx slack doctor`
**Description**: Check system and app setup (diagnostics)

**Options**:
- `-w, --workspace <workspace>`: Check specific workspace configuration
- `-v, --verbose`: Show verbose output
- `--fix`: Attempt to fix issues automatically
- `--check-auth`: Check authentication status
- `--check-deps`: Check dependencies
- `--check-env`: Check environment setup

**Example**:
```bash
jx slack doctor --verbose --check-auth --check-deps
```

## Prerequisites

These commands require the Slack CLI to be installed on your system. If it's not installed, you'll receive an error message with a link to the installation instructions.

Install Slack CLI from: https://api.slack.com/automation/cli/install

## Implementation Details

The Slack commands follow the same pattern as the GitHub CLI integration:
- Each command extends the `SlackCommand` base class
- Commands pass through to the actual Slack CLI with proper argument handling
- All commands check for Slack CLI installation before executing
- Error handling and output is handled consistently across all commands
