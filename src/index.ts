#!/usr/bin/env node

import { Command } from 'commander';
import execa = require('execa');
import process from 'node:process';
import { version, description } from '../package.json';

// Define interfaces for better type safety
interface CheckFunctionsOptions {
  projectRef?: string;
  pat?: string;
}

class JXCli {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .name('jx')
      .description(description)
      .version(version);

    // Setup check command with subcommands
    const checkCommand = this.program
      .command('check')
      .description('Check various services and configurations');

    // Add functions subcommand to check
    checkCommand
      .command('functions')
      .description('List deployed Edge Functions for the linked Supabase project')
      .option('-p, --project-ref <id>', 'Project reference (overrides $SUPABASE_PROJECT_REF)')
      .option('--pat <token>', 'Personal access token (overrides $SUPABASE_PAT)')
      .action(async (options: CheckFunctionsOptions) => {
        await this.checkSupabaseFunctions(options);
      });

    // Add other commands for backwards compatibility
    this.program
      .command('hello')
      .description('Say hello to the world')
      .option('-n, --name <name>', 'name to greet', 'World')
      .option('-u, --uppercase', 'convert greeting to uppercase', false)
      .option('-e, --exclamation', 'add exclamation marks', false)
      .action((options) => {
        this.greet(options.name, {
          uppercase: options.uppercase,
          exclamation: options.exclamation
        });
      });

    this.program
      .command('goodbye')
      .description('Say goodbye')
      .option('-n, --name <name>', 'name to say goodbye to', 'World')
      .action((options) => {
        this.sayGoodbye(options.name);
      });
  }
  private async checkSupabaseFunctions(options: CheckFunctionsOptions): Promise<void> {
    const accessToken = 
      options.pat || process.env.SUPABASE_PAT || process.env.SUPABASE_ACCESS_TOKEN;
    const ref = 
      options.projectRef || process.env.SUPABASE_PROJECT_REF || process.env.SUPABASE_REF;

    if (!accessToken) {
      console.error('Error: Supabase PAT missing (set $SUPABASE_PAT or pass --pat)');
      process.exit(1);
    }
    if (!ref) {
      console.error('Error: project ref missing (set $SUPABASE_PROJECT_REF or pass --project-ref)');
      process.exit(1);
    }

    try {
      console.log('🔍 Checking Supabase Edge Functions...\n');
      
      // Supabase CLI consumes SUPABASE_ACCESS_TOKEN
      const { stdout } = await execa(
        'supabase',
        ['functions', 'list', '--project-ref', ref],
        { env: { ...process.env, SUPABASE_ACCESS_TOKEN: accessToken } }
      );
      console.log(stdout);
    } catch (err) {
      const error = err as Error & { stderr?: string };
      console.error('❌ Supabase CLI failed:', error.message);
      if (error.stderr) {
        console.error('Details:', error.stderr);
      }
      process.exit(1);
    }
  }
  private greet(name: string, options: { uppercase?: boolean; exclamation?: boolean }): void {
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

  public async run(): Promise<void> {
    await this.program.parseAsync(process.argv);
  }
}

// Create and run the CLI
const cli = new JXCli();
cli.run().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
