import { execSync } from 'child_process';
import { join } from 'path';

describe('CLI', () => {
  const cliPath = join(__dirname, '../../dist/index.js');
  
  beforeAll(() => {
    // Build the project before running tests
    execSync('npm run build', { cwd: join(__dirname, '../..') });
  });

  describe('hello command', () => {
    it('should greet the world by default', () => {
      const output = execSync(`node ${cliPath} hello`).toString();
      expect(output.trim()).toBe('Hello, World!');
    });

    it('should greet with a custom name', () => {
      const output = execSync(`node ${cliPath} hello --name John`).toString();
      expect(output.trim()).toBe('Hello, John!');
    });

    it('should convert to uppercase when flag is set', () => {
      const output = execSync(`node ${cliPath} hello --uppercase`).toString();
      expect(output.trim()).toBe('HELLO, WORLD!');
    });

    it('should add exclamation marks when flag is set', () => {
      const output = execSync(`node ${cliPath} hello --exclamation`).toString();
      expect(output.trim()).toBe('Hello, World!!!');
    });
  });

  describe('goodbye command', () => {
    it('should say goodbye to the world by default', () => {
      const output = execSync(`node ${cliPath} goodbye`).toString();
      expect(output.trim()).toBe('Goodbye, World! See you soon.');
    });

    it('should say goodbye with a custom name', () => {
      const output = execSync(`node ${cliPath} goodbye --name Alice`).toString();
      expect(output.trim()).toBe('Goodbye, Alice! See you soon.');
    });
  });

  describe('default action', () => {
    it('should show welcome message when no command is given', () => {
      const output = execSync(`node ${cliPath}`).toString();
      expect(output.trim()).toBe('Welcome to the CLI! Use --help to see available commands.');
    });
  });

  describe('help', () => {
    it('should display help information', () => {
      const output = execSync(`node ${cliPath} --help`).toString();
      expect(output).toContain('Usage:');
      expect(output).toContain('Commands:');
      expect(output).toContain('hello');
      expect(output).toContain('goodbye');
    });
  });
});
