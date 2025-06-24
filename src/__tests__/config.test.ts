import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { ConfigManager } from '../utils/config';

jest.mock('fs/promises');
jest.mock('os');

describe('ConfigManager', () => {
  const mockHomedir = '/home/user';
  const mockConfigDir = path.join(mockHomedir, '.jx');
  const mockConfigFile = path.join(mockConfigDir, 'config.json');

  beforeEach(() => {
    jest.clearAllMocks();
    (os.homedir as jest.Mock).mockReturnValue(mockHomedir);
  });

  describe('ensureConfigDir', () => {
    it('should create config directory if it does not exist', async () => {
      (fs.access as jest.Mock).mockRejectedValue(new Error('Not found'));
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);

      await ConfigManager.ensureConfigDir();

      expect(fs.access).toHaveBeenCalledWith(mockConfigDir);
      expect(fs.mkdir).toHaveBeenCalledWith(mockConfigDir, { recursive: true });
    });

    it('should not create directory if it already exists', async () => {      (fs.access as jest.Mock).mockResolvedValue(undefined);

      await ConfigManager.ensureConfigDir();

      expect(fs.access).toHaveBeenCalledWith(mockConfigDir);
      expect(fs.mkdir).not.toHaveBeenCalled();
    });
  });

  describe('getGlobalConfig', () => {
    it('should return empty config if file does not exist', async () => {
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('Not found'));

      const config = await ConfigManager.getGlobalConfig();

      expect(config).toEqual({});
    });

    it('should return parsed config if file exists', async () => {
      const mockConfig = { auth: { token: 'test-token' } };
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockConfig));

      const config = await ConfigManager.getGlobalConfig();

      expect(config).toEqual(mockConfig);
    });
  });
});
