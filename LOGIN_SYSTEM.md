# JX CLI - Universal Login System

The JX CLI provides a unified authentication system for multiple services, allowing you to manage all your service logins from one place.

## Quick Start

```bash
# Interactive login
jx login

# Login to all services at once
jx login --all

# Login to a specific service
jx login slack
# or
jx login -s vercel

# Check authentication status
jx status
```

## Supported Services

The following services are supported:

| Service | Command | Auth Type |
|---------|---------|-----------|
| Slack | `jx slack login` | OAuth |
| Vercel | `jx vercel login` | CLI |
| Supabase | `jx supabase login` | CLI |
| GitHub | `jx gh login` | CLI |
| MermaidChart | `jx mermaidchart login` | API Key |
| Fly.io | `jx flyio login` | CLI |
| Claude Code | `jx claude login` | CLI |
| OpenAI Codex | `jx codex login` | API Key |
| Linear | `jx linear login` | CLI |

## Authentication Types

### CLI Authentication
For services like Vercel, GitHub, and Supabase, the JX CLI will execute the native CLI login command. Make sure you have these CLI tools installed.

### API Key Authentication
For services like MermaidChart and OpenAI Codex, you'll be prompted to enter your API key, which will be securely stored.

### OAuth Authentication
For services like Slack, you'll be directed to complete OAuth authentication in your browser and then paste the resulting token.

## Commands

### `jx login`
Interactive login interface that shows the authentication status of all services and allows you to authenticate with any service.

### `jx login --all`
Guides you through logging into all supported services sequentially.

### `jx login [service]`
Login to a specific service directly.

### `jx status`
Shows the current authentication status for all services.

### `jx status -s [service]`
Shows the authentication status for a specific service.

### Individual Service Commands
Each service also has its own login command:
- `jx slack login`
- `jx vercel login`
- `jx supabase login`
- `jx gh login`
- `jx mermaidchart login`
- `jx flyio login`
- `jx claude login`
- `jx codex login`
- `jx linear login`

## Configuration

Authentication tokens and credentials are stored in `~/.jx/config.json`. This file contains:
- Service authentication tokens
- Token expiration dates
- Other service-specific configuration

## Development

The login system is built with:
- TypeScript for type safety
- Commander.js for CLI parsing
- Inquirer.js for interactive prompts
- Chalk for colorful output

## Security

- All tokens are stored locally in your home directory
- API keys and tokens are never logged or displayed
- Tokens include expiration dates for automatic invalidation
- Use `jx logout` to clear all authentication data
