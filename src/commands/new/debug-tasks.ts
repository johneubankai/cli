import { Command } from 'commander';
import { SubCommand } from '../subcommand';

interface DebugResponse {
  debug: {
    tableExists: boolean;
    tableInfo: any;
    columns: Array<{
      column_name: string;
      data_type: string;
      is_nullable: string;
      column_default: string;
    }>;
    rowCount: number | null;
    countError: string | null;
    lastTasks: Array<{
      id: number;
      task_content: string;
      status: string;
      created_at: string;
    }> | null;
    tasksError: string | null;
    timestamp: string;
  };
}

export class DebugTasksCommand extends SubCommand {
  parentCommand = 'new';
  name = 'debug-tasks';
  description = 'Debug the public tasks table status';

  protected configureOptions(_command: Command): void {
    // No options needed
  }

  async execute(): Promise<void> {
    try {
      const spinner = this.logger.spinner('Checking database status...');

      try {
        // Get Supabase configuration
        const supabaseConfig = await this.config.getSupabaseConfig();
        
        if (!supabaseConfig.projectUrl || !supabaseConfig.anonKey) {
          spinner.fail('Supabase configuration missing');
          this.logger.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
          process.exit(1);
        }

        // Call the debug function
        const response = await fetch(
          `${supabaseConfig.projectUrl}/functions/v1/debug-public-tasks`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseConfig.anonKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
          }
        );

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Debug function failed: ${error}`);
        }

        const data = await response.json() as DebugResponse;
        spinner.succeed('Database status retrieved');
        
        this.logger.info('\n=== Database Debug Information ===\n');
        this.logger.info(`Table exists: ${data.debug.tableExists}`);
        
        if (data.debug.columns && data.debug.columns.length > 0) {
          this.logger.info('\nTable columns:');
          data.debug.columns.forEach((col) => {
            this.logger.info(`  - ${col.column_name} (${col.data_type})`);
          });
        } else {
          this.logger.warn('\nNo columns found or table does not exist');
        }
        
        this.logger.info(`\nRow count: ${data.debug.rowCount ?? 'Unable to count'}`);
        
        if (data.debug.countError) {
          this.logger.error(`Count error: ${data.debug.countError}`);
        }
        
        if (data.debug.lastTasks && data.debug.lastTasks.length > 0) {
          this.logger.info('\nLast tasks:');
          data.debug.lastTasks.forEach((task) => {
            this.logger.info(`  - [${task.id}] ${task.task_content} (${task.status})`);
          });
        }
        
        this.logger.info(`\nDebug timestamp: ${data.debug.timestamp}`);

      } catch (error) {
        spinner.fail('Failed to check database status');
        throw error;
      }

    } catch (error: unknown) {
      this.logger.error(`Failed to debug: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }
}