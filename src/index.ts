#!/usr/bin/env node

import { Command } from 'commander';
import execa = require('execa');
import process from 'node:process';
import { version, description } from '../package.json';
import https from 'node:https';

// Define interfaces for better type safety
interface CheckFunctionsOptions {
  projectRef?: string;
  pat?: string;
}

interface VaultOptions {
  projectRef?: string;
  anonKey?: string;
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

    // Setup vault command with subcommands
    const vaultCommand = this.program
      .command('vault')
      .description('Manage Supabase vault secrets');

    // Add list subcommand to vault
    vaultCommand
      .command('list')
      .description('List all available keys in the Supabase vault')
      .option('-p, --project-ref <id>', 'Project reference (overrides $SUPABASE_PROJECT_REF)')
      .option('-a, --anon-key <key>', 'Anon key (overrides $SUPABASE_ANON_KEY)')
      .action(async (options: VaultOptions) => {
        await this.listVaultKeys(options);
      });

    // Add get subcommand to vault
    vaultCommand
      .command('get <key>')
      .description('Get a specific secret value from the Supabase vault')
      .option('-p, --project-ref <id>', 'Project reference (overrides $SUPABASE_PROJECT_REF)')
      .option('-a, --anon-key <key>', 'Anon key (overrides $SUPABASE_ANON_KEY)')
      .option('-s, --show', 'Show the full value instead of masking it')
      .action(async (key: string, options: VaultOptions & { show?: boolean }) => {
        await this.getVaultSecret(key, options);
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

  private async makeEdgeFunctionRequest(
    projectRef: string, 
    anonKey: string, 
    action: string, 
    key?: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `https://${projectRef}.supabase.co/functions/v1/vault-secrets-reader`;
      const body = JSON.stringify({ action, key });

      const options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      };

      const req = https.request(url, options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode === 200) {
              resolve(parsed);
            } else {
              reject(new Error(parsed.error || `HTTP ${res.statusCode}`));
            }
          } catch (e) {
            reject(new Error(`Failed to parse response: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }

  private async listVaultKeys(options: VaultOptions): Promise<void> {
    const projectRef = 
      options.projectRef || process.env.SUPABASE_PROJECT_REF || process.env.SUPABASE_REF;
    const anonKey = 
      options.anonKey || process.env.SUPABASE_ANON_KEY;

    if (!projectRef) {
      console.error('Error: project ref missing (set $SUPABASE_PROJECT_REF or pass --project-ref)');
      process.exit(1);
    }
    if (!anonKey) {
      console.error('Error: anon key missing (set $SUPABASE_ANON_KEY or pass --anon-key)');
      process.exit(1);
    }

    try {
      console.log('🔐 Fetching vault keys...\n');
      
      const response = await this.makeEdgeFunctionRequest(projectRef, anonKey, 'list');
      
      if (response.availableSecrets && Array.isArray(response.availableSecrets)) {
        if (response.availableSecrets.length === 0) {
          console.log('No keys found in vault.');
        } else {
          console.log('Available vault keys:');
          console.log('-------------------');
          response.availableSecrets.forEach((key: string) => {
            console.log(`  • ${key}`);
          });
        }
      } else if (response.keys && Array.isArray(response.keys)) {
        // Fallback for different response format
        if (response.keys.length === 0) {
          console.log('No keys found in vault.');
        } else {
          console.log('Available vault keys:');
          console.log('-------------------');
          response.keys.forEach((key: string) => {
            console.log(`  • ${key}`);
          });
        }
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (err) {
      const error = err as Error;
      console.error('❌ Failed to list vault keys:', error.message);
      process.exit(1);
    }
  }

  private async getVaultSecret(key: string, options: VaultOptions & { show?: boolean }): Promise<void> {
    const projectRef = 
      options.projectRef || process.env.SUPABASE_PROJECT_REF || process.env.SUPABASE_REF;
    const anonKey = 
      options.anonKey || process.env.SUPABASE_ANON_KEY;

    if (!projectRef) {
      console.error('Error: project ref missing (set $SUPABASE_PROJECT_REF or pass --project-ref)');
      process.exit(1);
    }
    if (!anonKey) {
      console.error('Error: anon key missing (set $SUPABASE_ANON_KEY or pass --anon-key)');
      process.exit(1);
    }

    try {
      console.log(`🔐 Fetching secret for key: ${key}\n`);
      
      const response = await this.makeEdgeFunctionRequest(projectRef, anonKey, 'get', key);
      
      // Handle different response formats
      const value = response.value !== undefined ? response.value : response.secretValue;
      
      if (value !== undefined) {
        // Protected output - mask the value by default
        console.log(`Key: ${key}`);
        
        if (options.show) {
          console.log(`Value: ${value}`);
        } else {
          const maskedValue = value.length > 4 
            ? value.substring(0, 2) + '*'.repeat(Math.min(value.length - 4, 20)) + value.substring(value.length - 2)
            : '*'.repeat(value.length);
          
          console.log(`Value (masked): ${maskedValue}`);
          console.log('\n💡 Tip: Use --show flag to display the full value');
          
          // Try to copy to clipboard if available
          try {
            await execa('pbcopy', { input: value });
            console.log('✅ Value copied to clipboard!');
          } catch {
            // If clipboard fails, silently continue
          }
        }
      } else if (response.error) {
        console.error(`Error: ${response.error}`);
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (err) {
      const error = err as Error;
      console.error('❌ Failed to get vault secret:', error.message);
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
