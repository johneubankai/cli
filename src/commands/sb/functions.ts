import { Command } from 'commander';
import { SubCommand } from '../subcommand';
import { SbFunctionsListCommand } from './functions-list';
import { SbFunctionsDeployCommand } from './functions-deploy';

export class SbFunctionsCommand extends SubCommand {
  parentCommand = 'sb';
  name = 'functions';
  description = 'Manage Supabase edge functions';

  register(program: Command): void {
    // Find parent command
    const parent = program.commands.find(cmd => cmd.name() === this.parentCommand);
    
    if (!parent) {
      throw new Error(`Parent command "${this.parentCommand}" not found`);
    }
    
    const cmd = parent
      .command(this.name)
      .description(this.description);
    
    this.configureOptions(cmd);
    
    // Register the list subcommand
    const listCmd = new SbFunctionsListCommand();
    cmd
      .command('list')
      .alias('ls')
      .description(listCmd.description)
      .option('--project-ref <ref>', 'Override project reference')
      .action(async (options) => {
        try {
          await listCmd.execute(options);
        } catch (error) {
          this.logger.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          process.exit(1);
        }
      });
    
    // Register the deploy subcommand
    const deployCmd = new SbFunctionsDeployCommand();
    cmd
      .command('deploy')
      .argument('[function]', 'Function name to deploy')
      .description(deployCmd.description)
      .option('--project-ref <ref>', 'Override project reference')
      .option('--all', 'Deploy all functions')
      .action(async (functionName, options) => {
        try {
          // Create a mock command object with args
          const mockCommand = { args: [functionName] } as any;
          await deployCmd.execute(options, mockCommand);
        } catch (error) {
          this.logger.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          process.exit(1);
        }
      });
    
    cmd.action(async () => {
      try {
        await this.execute();
      } catch (error) {
        this.logger.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    });
  }

  protected configureOptions(_command: Command): void {
    // This is a parent command that groups subcommands
  }

  async execute(): Promise<void> {
    // This will be handled by commander.js to show help
    this.logger.info('Available commands:');
    this.logger.info('  jx sb functions list     - List all functions');
    this.logger.info('  jx sb functions deploy   - Deploy a function');
  }
}
