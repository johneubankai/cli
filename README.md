# JX CLI

A TypeScript CLI tool that mimics Vercel CLI commands. Built with clean typing and designed to work offline for build, lint, and test operations.

## Installation

```bash
npm install -g jx-cli
```

Or run locally:

```bash
npm install
npm run build
npm link
```

## Commands

### Authentication

- `jx login` - Log in to your JX account
- `jx logout` - Log out of your JX account

### Project Management

- `jx link` - Link a project to your JX account
- `jx deploy` - Deploy your project
- `jx dev` - Start a local development server
- `jx build` - Build your project

### Environment Variables
- `jx env` - List environment variables
- `jx add <key> <value>` - Add an environment variable
- `jx rm <key>` - Remove an environment variable
- `jx pull` - Pull environment variables to a local file

### Deployment Management

- `jx ls` - List deployments
- `jx logs <deployment-url>` - View deployment logs

### GitHub CLI Integration

All GitHub commands use the `gh` CLI tool under the hood. Make sure you have [GitHub CLI](https://cli.github.com/) installed.

#### Authentication
- `jx gh auth login` - Authenticate with GitHub
- `jx gh auth logout` - Log out from GitHub
- `jx gh auth status` - View authentication status
- `jx gh auth refresh` - Refresh authentication
- `jx gh auth token` - Print the auth token

#### Configuration
- `jx gh config` - View GitHub CLI configuration
- `jx gh config get <key>` - Get a specific config value
- `jx gh config set <key> <value>` - Set a config value
- `jx gh config list` - List all configuration

#### Repository Management
- `jx gh repo create [name]` - Create a new repository
- `jx gh repo clone <repo>` - Clone a repository
- `jx gh repo list` - List repositories
- `jx gh repo view [repo]` - View repository details
- `jx gh repo delete <repo>` - Delete a repository
- `jx gh repo fork <repo>` - Fork a repository

#### Issue Tracking
- `jx gh issue create` - Create a new issue
- `jx gh issue list` - List issues
- `jx gh issue view <number>` - View an issue
- `jx gh issue close <number>` - Close an issue
- `jx gh issue reopen <number>` - Reopen an issue
- `jx gh issue edit <number>` - Edit an issue

#### Pull Requests
- `jx gh pr create` - Create a pull request
- `jx gh pr list` - List pull requests
- `jx gh pr view <number>` - View a pull request
- `jx gh pr merge <number>` - Merge a pull request
- `jx gh pr close <number>` - Close a pull request
- `jx gh pr checkout <number>` - Check out a pull request

#### Gist Management
- `jx gh gist create` - Create a new gist
- `jx gh gist list` - List your gists
- `jx gh gist view <id>` - View a gist
- `jx gh gist edit <id>` - Edit a gist
- `jx gh gist delete <id>` - Delete a gist

### Supabase Integration

All Supabase commands use the `sb` prefix and require a `SUPABASE_PAT` (Personal Access Token) in your `.env` file.

#### Project Management
- `jx sb link <project-ref>` - Link to a Supabase project
- `jx sb db push` - Push database migrations
- `jx sb functions list` - List edge functions
- `jx sb functions deploy <name>` - Deploy a specific edge function
- `jx sb functions deploy --all` - Deploy all edge functions

#### Vault Management
- `jx vault list` - List all secrets
- `jx vault get <key>` - Get a secret value
- `jx vault get <key> --reveal` - Show the actual secret value
- `jx vault set <key> [value]` - Set or update a secret
- `jx vault rm <key>` - Remove a secret

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the project
npm run build

# Run linting
npm run lint

# Run tests
npm run test
```

## Project Structure

```
jx-cli/
├── src/
│   ├── commands/     # Command implementations
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Utility functions
│   └── index.ts      # CLI entry point
├── dist/            # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

## Configuration

### Global Configuration

Stored in `~/.jx/config.json`:
- Authentication token
- Default team
- Analytics preferences

### Project Configuration

Stored in `jx.json` in your project root:
- Project ID
- Build settings
- Framework detection
- Output directory

## License

MIT
