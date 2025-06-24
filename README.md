# CLI Hello World

A TypeScript-based CLI application built with Commander.js as a starting point for command-line tools.

## Features

- Built with TypeScript for type safety
- Uses Commander.js for command parsing
- Includes ESLint for code quality
- Jest for testing
- Clean, typed class structure

## Installation

```bash
npm install
```

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

## Usage

After building, you can run the CLI with:

```bash
# Show help
node dist/index.js --help

# Say hello
node dist/index.js hello
node dist/index.js hello --name John
node dist/index.js hello --uppercase
node dist/index.js hello --exclamation

# Say goodbye
node dist/index.js goodbye
node dist/index.js goodbye --name Alice
```

## Project Structure

```
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
```
