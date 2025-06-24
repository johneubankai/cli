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
      .option('-n, --name <name>', 'name to greet', 'World')
      .option('-u, --uppercase', 'convert greeting to uppercase', false)
      .option('-e, --exclamation', 'add exclamation marks', false)
      .action((options: GreetOptions & { name: string }) => {
        this.greet(options.name, options);
      });

    // Goodbye command
    this.program
      .command('goodbye')
      .description('Say goodbye')
      .option('-n, --name <name>', 'name to say goodbye to', 'World')
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
    let greeting = `Hello, ${name}!`;
    
    if (options.uppercase === true) {
      greeting = greeting.toUpperCase();
    }
    
    if (options.exclamation === true) {
      greeting = greeting.replace('!', '!!!');
    }
    
    console.log(greeting);
  }

  private sayGoodbye(name: string): void {
    console.log(`Goodbye, ${name}! See you soon.`);
  }

  public run(): void {
    this.program.parse(process.argv);
  }
}

// Create and run the CLI
const cli = new CLI();
cli.run();
