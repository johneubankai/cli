# JX CLI

A TypeScript-based CLI tool with super-charged helpers for development projects, including Supabase Edge Functions management.

## Features

- **Supabase Vault Integration**: Securely list and retrieve secrets from Supabase Vault
- **Supabase Functions Management**: Check and list deployed Edge Functions
- **Security First**: Vault secrets are masked by default and copied to clipboard
- **TypeScript**: Fully typed with strict configuration
- **Commander.js**: Elegant command parsing with nested sub-commands
- **ESLint**: Code quality enforcement
- **Jest**: Comprehensive testing
- **Global Installation**: Use `jx` command from anywhere

## Installation

### For Development

```bash
npm install
npm run build
```

### Global Installation

```bash
# From the project directory
npm install -g .

# Or via npm package (when published)
npm install -g @johneubankai/jx-cli
```

## Commands

### Supabase Vault Management

List all available keys in your Supabase vault:

```bash
# Using environment variables
export SUPABASE_ANON_KEY="your-anon-key"
export SUPABASE_PROJECT_REF="your-project-ref"
jx vault list

# Using command flags
jx vault list --anon-key "your-key" --project-ref "your-ref"
```

Get a specific secret value (masked by default for security):

```bash
# Get masked value (copied to clipboard automatically)
jx vault get API_KEY

# Show full value (use with caution!)
jx vault get API_KEY --show
```

### Supabase Functions

Check deployed Edge Functions:

```bash
# Using environment variables
export SUPABASE_PAT="your-personal-access-token"
export SUPABASE_PROJECT_REF="your-project-ref"
jx check functions

# Using command flags
jx check functions --pat "your-token" --project-ref "your-ref"
```

### Other Commands

```bash
# Say hello
jx hello
jx hello --name John
jx hello --uppercase
jx hello --exclamation

# Say goodbye
jx goodbye
jx goodbye --name Alice

# Show help
jx --help
jx check --help
```

## Environment Variables

For Supabase integration:

- `SUPABASE_PAT` or `SUPABASE_ACCESS_TOKEN`: Your Supabase personal access token (for CLI operations)
- `SUPABASE_PROJECT_REF` or `SUPABASE_REF`: Your Supabase project reference
- `SUPABASE_ANON_KEY`: Your Supabase anon key (for vault operations)

## Development

```bash
# Run in development mode
npm run dev

# Build the project
npm run build

# Run tests
npm run test

# Lint the code
npm run lint
```

## Project Structure

```
jx-cli/
├── src/
│   ├── index.ts          # Main CLI entry point
│   └── __tests__/        # Test files
│       └── index.test.ts
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json         # TypeScript configuration
├── .eslintrc.json        # ESLint configuration
├── jest.config.js        # Jest configuration
└── README.md
```

## Publishing

To publish this package:

```bash
npm run build
npm publish --access public
```

## Security Notes

- Never commit your Supabase PAT to version control
- Use environment variables or secure secret management for credentials
- In CI/CD, store tokens as encrypted secrets

## Requirements

- Node.js 18+
- Supabase CLI installed globally (`npm install -g supabase`)
- Valid Supabase project and personal access token
