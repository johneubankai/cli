import { execSync } from 'child_process';
import { join } from 'path';

describe('JX CLI', () => {
  const cliPath = join(__dirname, '../../dist/index.js');
  
  beforeAll(() => {
    // Build the project before running tests
    execSync('npm run build', { cwd: join(__dirname, '../..') });
  });

  describe('check functions command', () => {
    it('should error when PAT is missing', () => {
      expect(() => {
        execSync(`node ${cliPath} check functions`, {
          env: { ...process.env, SUPABASE_PAT: '', SUPABASE_ACCESS_TOKEN: '' }
        });
      }).toThrow();
    });

    it('should error when project ref is missing', () => {
      expect(() => {
        execSync(`node ${cliPath} check functions --pat test-token`, {
          env: { ...process.env, SUPABASE_PROJECT_REF: '', SUPABASE_REF: '' }
        });
      }).toThrow();
    });

    it('should accept PAT via flag', () => {
      expect(() => {
        execSync(`node ${cliPath} check functions --pat test-token --project-ref test-ref`);
      }).toThrow(/supabase/i); // Will fail because supabase CLI not installed in test env
    });
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

  describe('help', () => {
    it('should display help information', () => {
      const output = execSync(`node ${cliPath} --help`).toString();
      expect(output).toContain('Usage:');
      expect(output).toContain('Commands:');
      expect(output).toContain('check');
      expect(output).toContain('vault');
      expect(output).toContain('hello');
      expect(output).toContain('goodbye');
    });

    it('should display check command help', () => {
      const output = execSync(`node ${cliPath} check --help`).toString();
      expect(output).toContain('Commands:');
      expect(output).toContain('functions');
    });
  });

  describe('vault commands', () => {
    it('should error when anon key is missing for vault list', () => {
      expect(() => {
        execSync(`node ${cliPath} vault list`, {
          env: { ...process.env, SUPABASE_ANON_KEY: '' }
        });
      }).toThrow();
    });

    it('should error when project ref is missing for vault list', () => {
      expect(() => {
        execSync(`node ${cliPath} vault list --anon-key test-key`, {
          env: { ...process.env, SUPABASE_PROJECT_REF: '', SUPABASE_REF: '' }
        });
      }).toThrow();
    });

    it('should accept anon key via flag for vault get', () => {
      expect(() => {
        execSync(`node ${cliPath} vault get TEST_KEY --anon-key test-key --project-ref test-ref`);
      }).toThrow(/Failed to get vault secret/i); // Will fail due to invalid credentials
    });
  });
});
