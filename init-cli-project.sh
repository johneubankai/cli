#!/bin/bash

# CLI Project Initialization Script
# Creates a TypeScript Commander.js hello world project

set -e

# Required environment variables
: ${GITHUB_TOKEN:?Error: GITHUB_TOKEN is required}
: ${GITHUB_ORGANIZATION:?Error: GITHUB_ORGANIZATION is required}
: ${GITHUB_REPO_NAME:?Error: GITHUB_REPO_NAME is required}
: ${LOCAL_PATH:?Error: LOCAL_PATH is required}

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting CLI Project Initialization${NC}"
echo -e "${BLUE}Organization: ${GITHUB_ORGANIZATION}${NC}"
echo -e "${BLUE}Repository: ${GITHUB_REPO_NAME}${NC}"
echo -e "${BLUE}Local Path: ${LOCAL_PATH}${NC}"

# Create directory
mkdir -p "$LOCAL_PATH"
cd "$LOCAL_PATH"

echo -e "${GREEN}✓ Created directory${NC}"

# Initialize git repository
git init
echo -e "${GREEN}✓ Initialized git repository${NC}"

# Create package.json
cat > package.json << 'EOF'
{
  "name": "cli",
  "version": "1.0.0",
  "description": "A hello world CLI built with Commander.js and TypeScript",
  "main": "dist/index.js",
  "bin": {
    "cli": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "ts-node src/index.ts",
    "start": "node dist/index.js",
    "lint": "eslint . --ext .ts,.tsx",
    "test": "jest",
    "prepare": "npm run build"
  },
  "keywords": ["cli", "commander"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "commander": "^12.1.0"
  },
  "devDependencies": {
    "@types/jest": "^29.5.12",
    "@types/node": "^20.14.9",
    "@typescript-eslint/eslint-plugin": "^7.14.1",
    "@typescript-eslint/parser": "^7.14.1",
    "eslint": "^8.57.0",
    "jest": "^29.7.0",
    "playwright": "^1.45.0",
    "ts-jest": "^29.1.5",
    "ts-node": "^10.9.2",
    "typescript": "^5.5.3"
  }
}
EOF
echo -e "${GREEN}✓ Created package.json${NC}"

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
EOF
echo -e "${GREEN}✓ Created tsconfig.json${NC}"

# Create .eslintrc.json
cat > .eslintrc.json << 'EOF'
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "extends": [    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/strict-boolean-expressions": "error"
  },
  "ignorePatterns": ["dist/", "node_modules/", "jest.config.js", "**/*.test.ts", "**/__tests__/**"]
}
EOF
echo -e "${GREEN}✓ Created .eslintrc.json${NC}"

# Create jest.config.js
cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
EOF
echo -e "${GREEN}✓ Created jest.config.js${NC}"

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Build output
dist/
*.js
*.d.ts
*.map

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/

# Environment
.env
.env.local
.env.*.local

# Temporary files
*.tmp
*.temp
EOF
echo -e "${GREEN}✓ Created .gitignore${NC}"

# Create src directory
mkdir -p src/__tests__
echo -e "${GREEN}✓ Created src directory structure${NC}"

# Create src/index.ts
cat > src/index.ts << 'EOF'
#!/usr/bin/env node

import { Command } from 'commander';
import { version, description } from '../package.json';
// Define interfaces for better type safety
interface GreetOptions {
  uppercase?: boolean;
  exclamation?: boolean;
}

class CLI {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .name('cli')
      .description(description)
      .version(version);

    // Hello command
    this.program
      .command('hello')
      .description('Say hello to the world')
      .option('-n, --name <n>', 'name to greet', 'World')
      .option('-u, --uppercase', 'convert greeting to uppercase', false)
      .option('-e, --exclamation', 'add exclamation marks', false)
      .action((options: GreetOptions & { name: string }) => {
        this.greet(options.name, options);
      });
    // Goodbye command
    this.program
      .command('goodbye')
      .description('Say goodbye')
      .option('-n, --name <n>', 'name to say goodbye to', 'World')
      .action((options: { name: string }) => {
        this.sayGoodbye(options.name);
      });

    // Default action
    this.program
      .action(() => {
        console.log('Welcome to the CLI! Use --help to see available commands.');
      });
  }

  private greet(name: string, options: GreetOptions): void {
    let greeting = \`Hello, \${name}!\`;
    
    if (options.uppercase === true) {
      greeting = greeting.toUpperCase();
    }
    
    if (options.exclamation === true) {
      greeting = greeting.replace('!', '!!!');
    }
    
    console.log(greeting);
  }
  private sayGoodbye(name: string): void {
    console.log(\`Goodbye, \${name}! See you soon.\`);
  }

  public run(): void {
    this.program.parse(process.argv);
  }
}

// Create and run the CLI
const cli = new CLI();
cli.run();
EOF
echo -e "${GREEN}✓ Created src/index.ts${NC}"

# Create test file
cat > src/__tests__/index.test.ts << 'EOF'
import { execSync } from 'child_process';
import { join } from 'path';

describe('CLI', () => {
  const cliPath = join(__dirname, '../../dist/index.js');
  
  beforeAll(() => {
    // Build the project before running tests
    execSync('npm run build', { cwd: join(__dirname, '../..') });
  });

  describe('hello command', () => {    it('should greet the world by default', () => {
      const output = execSync(\`node \${cliPath} hello\`).toString();
      expect(output.trim()).toBe('Hello, World!');
    });

    it('should greet with a custom name', () => {
      const output = execSync(\`node \${cliPath} hello --name John\`).toString();
      expect(output.trim()).toBe('Hello, John!');
    });

    it('should convert to uppercase when flag is set', () => {
      const output = execSync(\`node \${cliPath} hello --uppercase\`).toString();
      expect(output.trim()).toBe('HELLO, WORLD!');
    });

    it('should add exclamation marks when flag is set', () => {
      const output = execSync(\`node \${cliPath} hello --exclamation\`).toString();
      expect(output.trim()).toBe('Hello, World!!!');
    });
  });

  describe('goodbye command', () => {
    it('should say goodbye to the world by default', () => {
      const output = execSync(\`node \${cliPath} goodbye\`).toString();
      expect(output.trim()).toBe('Goodbye, World! See you soon.');
    });

    it('should say goodbye with a custom name', () => {
      const output = execSync(\`node \${cliPath} goodbye --name Alice\`).toString();
      expect(output.trim()).toBe('Goodbye, Alice! See you soon.');
    });
  });
  describe('default action', () => {
    it('should show welcome message when no command is given', () => {
      const output = execSync(\`node \${cliPath}\`).toString();
      expect(output.trim()).toBe('Welcome to the CLI! Use --help to see available commands.');
    });
  });

  describe('help', () => {
    it('should display help information', () => {
      const output = execSync(\`node \${cliPath} --help\`).toString();
      expect(output).toContain('Usage:');
      expect(output).toContain('Commands:');
      expect(output).toContain('hello');
      expect(output).toContain('goodbye');
    });
  });
});
EOF
echo -e "${GREEN}✓ Created src/__tests__/index.test.ts${NC}"

# Create README.md
cat > README.md << 'EOF'
# CLI Hello World

A TypeScript-based CLI application built with Commander.js as a starting point for command-line tools.

## Features

- Built with TypeScript for type safety- Uses Commander.js for command parsing
- Includes ESLint for code quality
- Jest for testing
- Clean, typed class structure

## Installation

\`\`\`bash
npm install
\`\`\`

## Development

\`\`\`bash
# Run in development mode
npm run dev

# Build the project
npm run build

# Run tests
npm run test

# Lint the code
npm run lint
\`\`\`

## Usage

After building, you can run the CLI with:

\`\`\`bash# Show help
node dist/index.js --help

# Say hello
node dist/index.js hello
node dist/index.js hello --name John
node dist/index.js hello --uppercase
node dist/index.js hello --exclamation

# Say goodbye
node dist/index.js goodbye
node dist/index.js goodbye --name Alice
\`\`\`

## Project Structure

\`\`\`
cli/
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
\`\`\`
EOF
echo -e "${GREEN}✓ Created README.md${NC}"
# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI (gh) not found. Attempting to use git with token...${NC}"
    USE_GIT_DIRECT=true
else
    USE_GIT_DIRECT=false
fi

# Add all files and commit
git add .
git commit -m "Initial commit: Hello world Commander.js CLI with TypeScript"
echo -e "${GREEN}✓ Created initial commit${NC}"

# Check if repository exists on GitHub
REPO_EXISTS=false
if [ "$USE_GIT_DIRECT" = false ]; then
    if gh repo view "${GITHUB_ORGANIZATION}/${GITHUB_REPO_NAME}" &> /dev/null; then
        REPO_EXISTS=true
        echo -e "${YELLOW}⚠️  Repository already exists on GitHub${NC}"
    fi
else
    # Check using curl API
    if curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
         "https://api.github.com/repos/${GITHUB_ORGANIZATION}/${GITHUB_REPO_NAME}" | grep -q '"id"'; then
        REPO_EXISTS=true
        echo -e "${YELLOW}⚠️  Repository already exists on GitHub${NC}"
    fi
fi
# Create repository on GitHub if it doesn't exist
if [ "$REPO_EXISTS" = false ]; then
    echo -e "${BLUE}📤 Creating GitHub repository...${NC}"
    
    if [ "$USE_GIT_DIRECT" = false ]; then
        # Use gh CLI
        gh repo create "${GITHUB_ORGANIZATION}/${GITHUB_REPO_NAME}" --public --source=. --remote=origin
    else
        # Use GitHub API directly
        curl -X POST -H "Authorization: token ${GITHUB_TOKEN}" \
             -H "Accept: application/vnd.github.v3+json" \
             https://api.github.com/user/repos \
             -d "{\"name\":\"${GITHUB_REPO_NAME}\",\"public\":true}"
        
        # Add remote
        git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_ORGANIZATION}/${GITHUB_REPO_NAME}.git"
    fi
    echo -e "${GREEN}✓ Created GitHub repository${NC}"
else
    # Add remote if not exists
    if ! git remote | grep -q "origin"; then
        git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_ORGANIZATION}/${GITHUB_REPO_NAME}.git"
    fi
fi

# Push to GitHub
echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
git push -u origin main || {
    echo -e "${YELLOW}⚠️  Push failed. Trying with force...${NC}"
    git push -u origin main --force
}echo -e "${GREEN}✓ Pushed to GitHub${NC}"

# Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
npm test

# Run linting
echo -e "${BLUE}🔍 Running linter...${NC}"
npm run lint

# Test the CLI
echo -e "${BLUE}🚀 Testing CLI commands...${NC}"
node dist/index.js hello --name "GitHub User" --uppercase --exclamation

echo -e "${GREEN}✅ Project successfully created!${NC}"
echo -e "${GREEN}Repository: https://github.com/${GITHUB_ORGANIZATION}/${GITHUB_REPO_NAME}${NC}"
echo -e "${GREEN}Local path: ${LOCAL_PATH}${NC}"

echo -e "\n${BLUE}Available commands:${NC}"
echo "  npm run dev       # Run in development mode"
echo "  npm run build     # Build TypeScript to JavaScript"
echo "  npm run test      # Run Jest tests"
echo "  npm run lint      # Run ESLint"
echo ""
echo "CLI usage (after building):"
echo "  node dist/index.js hello                          # Say hello"
echo "  node dist/index.js hello --name John --uppercase  # Custom greeting"
echo "  node dist/index.js goodbye --name Alice           # Say goodbye"