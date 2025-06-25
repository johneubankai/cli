import { Command } from 'commander';
import { NewSubCommand } from './base';
import { PublicTaskService } from '../../services/public-task';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface NewTaskOptions {
  metadata?: string;
}

export class NewTaskCommand extends NewSubCommand {
  parentCommand = 'new';
  name = 'task';
  description = 'Add a new task to the public tasks queue';
  aliases = ['t'];

  protected configureOptions(command: Command): void {
    command
      .argument('<content...>', 'Task content')
      .option('-m, --metadata <json>', 'Task metadata as JSON string');
  }

  async execute(options: NewTaskOptions, command?: Command): Promise<void> {
    try {
      const taskContent = command?.args?.join(' ');
      
      if (!taskContent || taskContent.trim().length === 0) {
        this.logger.error('Task content is required');
        this.logger.info('Usage: jx new task <content>');
        process.exit(1);
      }

      let metadata: Record<string, unknown> = {};
      if (options.metadata) {
        try {
          metadata = JSON.parse(options.metadata);
        } catch {
          this.logger.error('Invalid metadata JSON format');
          process.exit(1);
        }
      }

      const spinner = this.logger.spinner('Adding task to queue...');

      try {
        // Get Supabase configuration
        const supabaseConfig = await this.config.getSupabaseConfig();
        
        if (!supabaseConfig.projectUrl || !supabaseConfig.anonKey) {
          spinner.fail('Supabase configuration missing');
          this.logger.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
          this.logger.info('Or configure using: jx sb link');
          process.exit(1);
        }

        // Create task service instance
        const taskService = new PublicTaskService({
          projectUrl: supabaseConfig.projectUrl,
          anonKey: supabaseConfig.anonKey,
          projectRef: supabaseConfig.projectRef
        });

        // Add the task
        const result = await taskService.addTask(taskContent, metadata);
        
        if (result.success && result.task) {
          spinner.succeed(result.message);
          this.logger.info(`\nTask Details:`);
          this.logger.info(`  ID: ${result.task.id}`);
          this.logger.info(`  Content: ${result.task.content}`);
          this.logger.info(`  Status: ${result.task.status}`);
          this.logger.info(`  Created: ${new Date(result.task.created_at).toLocaleString()}`);
          if (Object.keys(result.task.metadata).length > 0) {
            this.logger.info(`  Metadata: ${JSON.stringify(result.task.metadata)}`);
          }
        } else {
          spinner.succeed(result.message);
        }

      } catch (error) {
        spinner.fail('Failed to add task');
        throw error;
      }

    } catch (error: unknown) {
      this.logger.error(`Failed to add task: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }
}