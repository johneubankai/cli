import { Command } from 'commander';
import { BaseCommand } from './base';
import { execSync, exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface MermaidOptions {
  output?: string;
  theme?: 'default' | 'forest' | 'dark' | 'neutral';
  backgroundColor?: string;
  configFile?: string;
  cssFile?: string;
  puppeteerConfig?: string;
  width?: number;
  height?: number;
  scale?: number;
  quiet?: boolean;
}

export class MermaidCommand extends BaseCommand {
  name = 'mermaid';
  description = 'Generate Mermaid diagrams (CLI) - convert Mermaid definition files to SVG/PNG (requires Node & headless browser)';

  protected configureOptions(command: Command): void {
    command
      .argument('<input>', 'Input mermaid file (.mmd or .md)')
      .option('-o, --output <output>', 'Output file path')
      .option('-t, --theme <theme>', 'Theme: default, forest, dark, or neutral', 'default')
      .option('-b, --backgroundColor <color>', 'Background color (e.g., transparent, white, #F0F0F0)', 'white')
      .option('-c, --configFile <file>', 'JSON configuration file for mermaid')
      .option('-C, --cssFile <file>', 'CSS file for styling')
      .option('-p, --puppeteerConfig <file>', 'JSON configuration file for puppeteer')
      .option('-w, --width <width>', 'Width of the output', '800')
      .option('-H, --height <height>', 'Height of the output', '600')
      .option('-s, --scale <scale>', 'Scale factor', '1')
      .option('-q, --quiet', 'Suppress output');
  }

  async execute(options: MermaidOptions, command?: Command): Promise<void> {
    const inputFile = command?.args[0];
    if (!inputFile) {
      this.logger.error('Input file is required');
      return;
    }

    const spinner = this.logger.spinner('Checking Mermaid CLI installation...');

    try {
      // Check if mmdc is installed
      try {
        execSync('which mmdc', { stdio: 'ignore' });
        spinner.succeed('Mermaid CLI is installed');
      } catch {
        spinner.text = 'Installing Mermaid CLI...';
        try {
          execSync('npm install -g @mermaid-js/mermaid-cli', { stdio: 'pipe' });
          spinner.succeed('Mermaid CLI installed successfully');
        } catch (error) {
          spinner.fail('Failed to install Mermaid CLI');
          this.logger.error('Please install it manually: npm install -g @mermaid-js/mermaid-cli');
          throw error;
        }
      }

      spinner.text = 'Generating diagram...';

      // Build mmdc command
      let mmdcCommand = `mmdc -i "${inputFile}"`;
      
      if (options.output) {
        mmdcCommand += ` -o "${options.output}"`;
      }
      
      if (options.theme) {
        mmdcCommand += ` -t ${options.theme}`;
      }
      
      if (options.backgroundColor) {
        mmdcCommand += ` -b "${options.backgroundColor}"`;
      }
      
      if (options.configFile) {
        mmdcCommand += ` -c "${options.configFile}"`;
      }
      
      if (options.cssFile) {
        mmdcCommand += ` -C "${options.cssFile}"`;
      }
      
      if (options.puppeteerConfig) {
        mmdcCommand += ` -p "${options.puppeteerConfig}"`;
      }
      
      if (options.width) {
        mmdcCommand += ` -w ${options.width}`;
      }
      
      if (options.height) {
        mmdcCommand += ` -H ${options.height}`;
      }
      
      if (options.scale) {
        mmdcCommand += ` -s ${options.scale}`;
      }
      
      if (options.quiet) {
        mmdcCommand += ' -q';
      }

      // Execute mmdc command
      const { stdout, stderr } = await execAsync(mmdcCommand);
      
      spinner.succeed('Diagram generated successfully!');
      
      if (!options.quiet) {
        if (stdout) this.logger.info(stdout);
        if (stderr) this.logger.warn(stderr);
      }
      
    } catch (error) {
      spinner.fail('Failed to generate diagram');
      if (error instanceof Error && 'stderr' in error) {
        this.logger.error((error as any).stderr);
      }
      throw error;
    }
  }
}
