import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { GlobalConfig, JxConfig } from '../types/config';
import { ServiceAuth, ServicesAuthConfig } from '../types/services';

export class ConfigManager {
  private static readonly GLOBAL_CONFIG_DIR = path.join(os.homedir(), '.jx');
  private static readonly GLOBAL_CONFIG_FILE = 'config.json';
  private static readonly LOCAL_CONFIG_FILE = 'jx.json';

  static async ensureConfigDir(): Promise<void> {
    try {
      await fs.access(this.GLOBAL_CONFIG_DIR);
    } catch {
      await fs.mkdir(this.GLOBAL_CONFIG_DIR, { recursive: true });
    }
  }

  static async getGlobalConfig(): Promise<GlobalConfig> {
    await this.ensureConfigDir();
    const configPath = path.join(this.GLOBAL_CONFIG_DIR, this.GLOBAL_CONFIG_FILE);
    
    try {
      const data = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(data) as GlobalConfig;
    } catch {
      return {};
    }
  }

  static async setGlobalConfig(config: GlobalConfig): Promise<void> {    await this.ensureConfigDir();
    const configPath = path.join(this.GLOBAL_CONFIG_DIR, this.GLOBAL_CONFIG_FILE);
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  }

  static async getLocalConfig(projectPath?: string): Promise<JxConfig | null> {
    const configPath = path.join(projectPath || process.cwd(), this.LOCAL_CONFIG_FILE);
    
    try {
      const data = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(data) as JxConfig;
    } catch {
      return null;
    }
  }

  static async setLocalConfig(config: JxConfig, projectPath?: string): Promise<void> {
    const configPath = path.join(projectPath || process.cwd(), this.LOCAL_CONFIG_FILE);
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  }

  static async getAuthToken(): Promise<string | undefined> {
    const config = await this.getGlobalConfig();
    return config.auth?.token;
  }

  static async setAuthToken(token: string): Promise<void> {
    const config = await this.getGlobalConfig();
    config.auth = { ...config.auth, token };    await this.setGlobalConfig(config);
  }

  static async clearAuth(): Promise<void> {
    const config = await this.getGlobalConfig();
    delete config.auth;
    await this.setGlobalConfig(config);
  }

  static async getServiceAuth(serviceName: string): Promise<ServiceAuth | undefined> {
    const config = await this.getGlobalConfig();
    return config.services?.[serviceName];
  }

  static async setServiceAuth(serviceName: string, auth: ServiceAuth): Promise<void> {
    const config = await this.getGlobalConfig();
    if (!config.services) {
      config.services = {};
    }
    config.services[serviceName] = auth;
    await this.setGlobalConfig(config);
  }

  static async clearServiceAuth(serviceName: string): Promise<void> {
    const config = await this.getGlobalConfig();
    if (config.services) {
      delete config.services[serviceName];
      await this.setGlobalConfig(config);
    }
  }

  static async getAllServiceAuths(): Promise<ServicesAuthConfig> {
    const config = await this.getGlobalConfig();
    return config.services || {};
  }

  static async clearAllServiceAuths(): Promise<void> {
    const config = await this.getGlobalConfig();
    delete config.services;
    await this.setGlobalConfig(config);
  }

  static async getSupabaseConfig(): Promise<{ projectUrl?: string; anonKey?: string; projectRef?: string }> {
    const config = await this.getGlobalConfig();
    const supabaseAuth = config.services?.supabase;
    
    // Check environment variables first
    const projectRef = process.env.SUPABASE_PROJECT_REF || process.env.SUPABASE_REF || supabaseAuth?.projectRef;
    const anonKey = process.env.SUPABASE_ANON_KEY || supabaseAuth?.anonKey;
    const projectUrl = process.env.SUPABASE_URL || supabaseAuth?.projectUrl || 
      (projectRef ? `https://${projectRef}.supabase.co` : undefined);
    
    return { projectUrl, anonKey, projectRef };
  }

  static async setSupabaseConfig(projectUrl: string, anonKey: string, projectRef?: string): Promise<void> {
    const config = await this.getGlobalConfig();
    if (!config.services) {
      config.services = {};
    }
    config.services.supabase = {
      ...config.services.supabase,
      projectUrl,
      anonKey,
      projectRef
    };
    await this.setGlobalConfig(config);
  }
}
