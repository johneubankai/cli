import { Logger } from '../utils/logger';

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log success messages', () => {
    Logger.success('Test success');
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('should log error messages', () => {
    Logger.error('Test error');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should log warning messages', () => {
    Logger.warn('Test warning');
    expect(consoleWarnSpy).toHaveBeenCalled();
  });
});
