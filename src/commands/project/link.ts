import { Command } from 'commander';
import inquirer from 'inquirer';
import * as path from 'path';
import { BaseCommand } from '../base';
import { JxConfig } from '../../types/config';

interface LinkOptions {
  yes?: boolean;
}

export class LinkCommand extends BaseCommand {
  name = 'link';
  description = 'Link a project to your JX account';

  protected configureOptions(command: Command): void {
    command
      .option('-y, --yes', 'Skip confirmation');
  }

  async execute(options: LinkOptions): Promise<void> {
    const spinner = this.logger.spinner('Linking project...');

    try {
      const token = await this.config.getAuthToken();
      if (!token) {
        spinner.fail('Not authenticated');
        this.logger.error('Please run "jx login" first');
        process.exit(1);
      }

      spinner.stop();

      const projectName = path.basename(process.cwd());
      
      if (!options.yes) {        const confirm = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'proceed',
            message: `Link "${projectName}" to your JX account?`,
            default: true,
          },
        ]);

        if (!confirm.proceed) {
          this.logger.info('Linking cancelled');
          return;
        }
      }

      spinner.start('Detecting framework...');

      // Detect framework (simplified)
      const framework = await this.detectFramework();
      
      const config: JxConfig = {
        projectId: 'prj_' + Math.random().toString(36).substr(2, 9),
        settings: {
          framework,
          buildCommand: 'npm run build',
          devCommand: 'npm run dev',
          outputDirectory: 'dist',
        },
      };

      await this.config.setLocalConfig(config);

      spinner.succeed('Project linked successfully!');
      this.logger.info(`Project ID: ${config.projectId}`);      this.logger.info(`Framework: ${framework || 'None detected'}`);
    } catch (error) {
      spinner.fail('Failed to link project');
      throw error;
    }
  }

  private async detectFramework(): Promise<string | undefined> {
    // Simple framework detection
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const { default: fs } = await import('fs/promises');
      const content = await fs.readFile(packageJsonPath, 'utf-8');
      const pkg = JSON.parse(content);
      
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      if (deps.next) return 'nextjs';
      if (deps.react) return 'react';
      if (deps.vue) return 'vue';
      if (deps.svelte) return 'svelte';
      if (deps.angular) return 'angular';
      
      return undefined;
    } catch {
      return undefined;
    }
  }
}
