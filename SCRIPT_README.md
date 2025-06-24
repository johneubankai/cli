# CLI Project Initialization Script

This bash script creates a complete TypeScript Commander.js hello world project and pushes it to GitHub.

## Features

- **Complete project setup**: Creates all necessary files and configuration
- **TypeScript support**: Fully typed with strict configuration
- **Testing**: Jest with example tests
- **Linting**: ESLint configured for TypeScript
- **Git integration**: Initializes repo and pushes to GitHub
- **Idempotent**: Skips GitHub repo creation if it already exists

## Requirements

- Node.js and npm installed
- Git installed
- GitHub personal access token with repo permissions
- (Optional) GitHub CLI (`gh`) for easier authentication

## Usage

### 1. Set required environment variables:

```bash
export GITHUB_TOKEN="your-github-personal-access-token"
export GITHUB_ORGANIZATION="your-github-username"
export GITHUB_REPO_NAME="my-awesome-cli"
export LOCAL_PATH="/path/to/create/project"
```

### 2. Run the script:

```bash
./init-cli-project.sh
```

### Alternative: Run with inline variables

```bash
GITHUB_TOKEN="token" \
GITHUB_ORGANIZATION="username" \
GITHUB_REPO_NAME="repo" \
LOCAL_PATH="/path" \
./init-cli-project.sh
```

## What it creates

The script generates a complete CLI project with:

- `package.json` - Node.js project configuration
- `tsconfig.json` - TypeScript configuration with strict settings
- `.eslintrc.json` - ESLint configuration for code quality
- `jest.config.js` - Jest testing configuration
- `.gitignore` - Proper Git ignore patterns
- `src/index.ts` - Main CLI application using Commander.js
- `src/__tests__/index.test.ts` - Example test suite
- `README.md` - Project documentation

## Project Commands

After creation, your new CLI project supports:

- `npm run dev` - Run in development mode
- `npm run build` - Build TypeScript to JavaScript
- `npm run test` - Run Jest tests
- `npm run lint` - Run ESLint

## CLI Commands

The generated CLI includes example commands:

- `node dist/index.js hello` - Say hello
- `node dist/index.js hello --name John --uppercase` - Custom greeting
- `node dist/index.js goodbye --name Alice` - Say goodbye

## Notes

- The script installs the full version of Playwright as requested
- All npm scripts (build, lint, test) work offline
- If the GitHub repository already exists, it will be reused
- The script uses GitHub CLI (`gh`) if available, otherwise falls back to GitHub API
