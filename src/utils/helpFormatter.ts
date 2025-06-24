import { Command } from 'commander';

export interface CommandCategory {
  name: string;
  commands: string[];
  description?: string;
}

export class HelpFormatter {
  private activeCommands: Set<string>;
  
  constructor() {
    // Define which commands are active (not coming soon)
    this.activeCommands = new Set(['login', 'vault', 'sb']);
  }

  formatHelp(program: Command): string {
    const commands = program.commands;
    const activeCommandsList: Command[] = [];
    const comingSoonCommandsList: Command[] = [];

    // Categorize commands
    commands.forEach(cmd => {
      const commandName = cmd.name();
      if (this.isActiveCommand(commandName)) {
        activeCommandsList.push(cmd);
      } else {
        comingSoonCommandsList.push(cmd);
      }
    });

    let helpText = '';
    
    // Header
    helpText += `\n${program.name()} ${program.version()}\n`;
    helpText += `${program.description()}\n\n`;
    
    // Usage
    helpText += 'Usage:\n';
    helpText += `  ${program.name()} [command] [options]\n\n`;
    
    // Active Commands
    if (activeCommandsList.length > 0) {
      helpText += 'Available Commands:\n';
      activeCommandsList.forEach(cmd => {
        helpText += this.formatCommand(cmd);
      });
      helpText += '\n';
    }
    
    // Coming Soon Commands
    if (comingSoonCommandsList.length > 0) {
      helpText += '🚧 Coming Soon:\n';
      comingSoonCommandsList.forEach(cmd => {
        helpText += this.formatCommand(cmd, true);
      });
      helpText += '\n';
    }
    
    // Global Options
    const options = program.options;
    if (options.length > 0) {
      helpText += 'Options:\n';
      options.forEach(option => {
        const flags = option.flags.padEnd(25);
        helpText += `  ${flags} ${option.description}\n`;
      });
      helpText += '\n';
    }
    
    // Footer
    helpText += `Run '${program.name()} [command] --help' for more information on a command.\n`;
    
    return helpText;
  }

  private formatCommand(cmd: Command, isComingSoon: boolean = false): string {
    const name = cmd.name().padEnd(20);
    const description = cmd.description() || '';
    const prefix = isComingSoon ? '  ' : '  ';
    const suffix = isComingSoon ? ' (not yet available)' : '';
    return `${prefix}${name} ${description}${suffix}\n`;
  }

  private isActiveCommand(commandName: string): boolean {
    // Check if it's an active command or a subcommand of an active command
    return Array.from(this.activeCommands).some(active => 
      commandName === active || commandName.startsWith(`${active}:`)
    );
  }
}
