import { execSync } from 'child_process';
import { GitHubCommand } from '../commands/gh/base';

// Mock execSync and spawn
jest.mock('child_process', () => ({
  execSync: jest.fn(),
  spawn: jest.fn(() => ({
    on: jest.fn((event, callback) => {
      if (event === 'close') callback(0);
    }),
  })),
}));

describe('GitHub Commands', () => {
  let mockExecSync: jest.MockedFunction<typeof execSync>;

  beforeEach(() => {
    mockExecSync = require('child_process').execSync as jest.MockedFunction<typeof execSync>;
    jest.clearAllMocks();
  });

  describe('GitHubCommand Base', () => {
    class TestGitHubCommand extends GitHubCommand {
      name = 'test';
      description = 'Test command';
      
      protected configureOptions(): void {}
      
      async execute(): Promise<void> {
        await this.executeGhCommand(['test']);
      }
    }

    it('should check if gh CLI is installed', () => {
      const command = new TestGitHubCommand();
      mockExecSync.mockImplementation(() => Buffer.from('gh version 2.0.0'));
      
      expect(command['checkGhInstalled']()).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith('gh --version', { stdio: 'ignore' });
    });

    it('should return false if gh CLI is not installed', () => {
      const command = new TestGitHubCommand();
      mockExecSync.mockImplementation(() => {
        throw new Error('Command not found');
      });
      
      expect(command['checkGhInstalled']()).toBe(false);
    });

    it('should build gh arguments correctly', () => {
      const command = new TestGitHubCommand();
      const args = command['buildGhArgs']('repo', 'create', {
        public: true,
        description: 'Test repo',
        'add-readme': true,
        private: false,
      });
      
      expect(args).toEqual(['repo', 'create', '--public', '--description', 'Test repo', '--add-readme']);
    });
  });
});
