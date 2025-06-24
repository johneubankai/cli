import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { icons } from '../assets/icons';

export class Logger {
  static success(message: string): void {
    console.log(chalk.green(icons.success), message);
  }

  static error(message: string): void {
    console.error(chalk.red(icons.error), message);
  }

  static warn(message: string): void {
    console.warn(chalk.yellow(icons.warning), message);
  }

  static info(message: string): void {
    console.log(chalk.blue(icons.info), message);
  }

  static log(message: string): void {
    console.log(message);
  }

  static spinner(text: string): Ora {
    return ora(text).start();
  }

  static table(data: Record<string, unknown>[]): void {
    console.table(data);
  }
}
