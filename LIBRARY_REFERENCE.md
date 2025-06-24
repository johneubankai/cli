# JX CLI Library Reference

A comprehensive reference for all `jx` commands available in the JX CLI.

## Overview

The JX CLI provides a suite of commands for managing projects, deployments, and integrations. All commands follow the pattern:

```bash
jx <command> [options] [arguments]
```

## Core Commands

### Authentication

#### `jx login`
Authenticate with your JX account.

**Options:**
- `--token <token>` - Use a specific authentication token
- `--no-browser` - Skip opening browser for authentication

**Example:**
```bash
jx login
jx login --token YOUR_AUTH_TOKEN
```

#### `jx logout`
Log out of your JX account and clear authentication credentials.

**Example:**
```bash
jx logout
```

### Project Management

#### `jx link`
Link a local project to your JX account.

**Options:**
- `--yes` - Skip confirmation prompts

**Example:**
```bash
jx link
jx link --yes
```

### Development

#### `jx dev`
Start a local development server.

**Options:**
- `-p, --port <port>` - Port to listen on (default: 3000)
- `--host <host>` - Host to bind to
- `--no-open` - Don't open browser automatically

**Example:**
```bash
jx dev
jx dev --port 8080
```

#### `jx build`
Build your project for production.

**Options:**
- `--output <dir>` - Output directory
- `--no-minify` - Skip minification

**Example:**
```bash
jx build
jx build --output dist
```

### Deployment

#### `jx deploy`Deploy your project to JX infrastructure.

**Options:**
- `--prod` - Deploy to production
- `--build-args <args>` - Build arguments
- `-e, --env <vars...>` - Environment variables
- `-m, --meta <data...>` - Deployment metadata
- `-f, --force` - Force a new deployment

**Example:**
```bash
jx deploy
jx deploy --prod
jx deploy --env API_KEY=value --env NODE_ENV=production
```

### Environment Variables

#### `jx env`
List all environment variables for the current project.

**Example:**
```bash
jx env
```

#### `jx add <key> <value>`
Add an environment variable.

**Example:**
```bash
jx add API_KEY your-api-key
jx add DATABASE_URL postgres://...
```

#### `jx rm <key>`Remove an environment variable.

**Example:**
```bash
jx rm API_KEY
```

#### `jx pull`
Pull environment variables to a local `.env` file.

**Options:**
- `--env <environment>` - Environment to pull from (development, preview, production)

**Example:**
```bash
jx pull
jx pull --env production
```

### Deployment Management

#### `jx ls`
List all deployments for the current project.

**Options:**
- `--limit <n>` - Number of deployments to show
- `--prod` - Show only production deployments

**Example:**
```bash
jx ls
jx ls --limit 10 --prod
```

#### `jx logs <deployment-url>`View logs for a specific deployment.

**Options:**
- `-f, --follow` - Follow log output
- `--since <time>` - Show logs since timestamp

**Example:**
```bash
jx logs https://my-app.jx.app
jx logs https://my-app.jx.app --follow
```

## Vercel Integration Commands

The JX CLI provides seamless integration with Vercel through subcommands that wrap the Vercel CLI.

### `jx vercel deploy`
Deploy your project using Vercel.

**Options:**
- `--prod` - Deploy to production
- `--build-args <args>` - Build arguments
- `-e, --env <vars...>` - Environment variables
- `-m, --meta <data...>` - Metadata for the deployment
- `-f, --force` - Force a new deployment
- `--token <token>` - Vercel authentication token
- `--scope <scope>` - Deploy to a specific team or user
- `--regions <regions>` - Regions to deploy to
- `--no-wait` - Don't wait for deployment to finish

**Example:**
```bash
jx vercel deploy
jx vercel deploy --prodjx vercel deploy --env API_KEY=value --scope my-team
```

### `jx vercel dev`
Start a local development server with Vercel.

**Options:**
- `-p, --port <port>` - Port to listen on (default: 3000)
- `-l, --listen <address>` - Address to listen on (default: localhost)
- `--debug` - Enable debug output

**Example:**
```bash
jx vercel dev
jx vercel dev --port 8080
```

### `jx vercel env`
Manage environment variables in Vercel.

**Options:**
- `--add` - Add environment variable
- `--rm` - Remove environment variable
- `--pull` - Pull environment variables
- `--ls` - List environment variables

**Arguments:**
- `[key]` - Environment variable key
- `[value]` - Environment variable value (for add)

**Example:**
```bashjx vercel env --ls
jx vercel env --add API_KEY your-key
jx vercel env --rm API_KEY
jx vercel env --pull
```

### `jx vercel domains`
Manage domains in Vercel.

**Options:**
- `--add <domain>` - Add a domain
- `--rm <domain>` - Remove a domain
- `--ls` - List domains

**Example:**
```bash
jx vercel domains --ls
jx vercel domains --add example.com
jx vercel domains --rm old-domain.com
```

## Configuration

### Global Configuration
Stored in `~/.jx/config.json`:
- Authentication tokens
- Default team settings
- User preferences

### Project Configuration
Stored in `jx.json` in your project root:
- Project ID
- Build settings
- Framework configuration
- Output directory

## Offline Capabilities

The following commands are designed to work without internet access:
- `jx build` - Build your project locally
- `jx dev` - Start local development server
- `jx env` - List cached environment variables

Note: `npm run build`, `npm run lint`, and `npm run test` are configured to work offline.

## Command Patterns

### Standard Commands
```bash
jx <command> [options] [arguments]
```

### Subcommands (Vercel Integration)
```bash
jx <parent> <subcommand> [options] [arguments]
```

### Common Options
- `--help` - Show help for any command
- `--version` - Show CLI version
- `--debug` - Enable debug output

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - Misuse of command
- `127` - Command not found

## See Also

- [README.md](./README.md) - General documentation
- [package.json](./package.json) - Project configuration
- [Vercel CLI Documentation](https://vercel.com/docs/cli) - For Vercel-specific features
