import { Command } from 'commander';
import { spawn } from 'child_process';
import { BaseCommand } from '../base';

interface BuildOptions {
  output?: string;
}

export class BuildCommand extends BaseCommand {
  name = 'build';
  description = 'Build your project';

  protected configureOptions(command: Command): void {
    command
      .option('-o, --output <dir>', 'Output directory');
  }

  async execute(options: BuildOptions): Promise<void> {
    const spinner = this.logger.spinner('Building project...');

    try {
      const localConfig = await this.config.getLocalConfig();
      const buildCommand = localConfig?.settings?.buildCommand || 'npm run build';
      const outputDir = options.output || localConfig?.settings?.outputDirectory || 'dist';
      
      spinner.text = `Running: ${buildCommand}`;
      
      const [cmd, ...args] = buildCommand.split(' ');
      const child = spawn(cmd, args, {
        stdio: 'inherit',
        env: {
          ...process.env,
          OUTPUT_DIR: outputDir,        },
      });

      await new Promise<void>((resolve, reject) => {
        child.on('error', (error) => {
          reject(new Error(`Build failed: ${error.message}`));
        });

        child.on('exit', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Build process exited with code ${code}`));
          }
        });
      });

      spinner.succeed('Build completed successfully!');
      this.logger.info(`Output directory: ${outputDir}`);
    } catch (error) {
      spinner.fail('Build failed');
      throw error;
    }
  }
}
