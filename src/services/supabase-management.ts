import * as fs from 'fs/promises';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

interface SupabaseManagementConfig {
  accessToken: string;
  projectRef?: string;
}

export class SupabaseManagementService {
  private config: SupabaseManagementConfig;
  private baseUrl = 'https://api.supabase.com';

  constructor(config: SupabaseManagementConfig) {
    this.config = config;
  }

  /**
   * Deploy an edge function
   */
  async deployFunction(functionName: string, functionPath: string): Promise<void> {
    const projectRef = this.config.projectRef || process.env.SUPABASE_PROJECT_REF;
    if (!projectRef) {
      throw new Error('Project reference is required');
    }

    // Read the function code
    const functionCode = await fs.readFile(path.join(functionPath, 'index.ts'), 'utf-8');

    const response = await fetch(
      `${this.baseUrl}/v1/projects/${projectRef}/functions/${functionName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: functionName,
          slug: functionName,
          body: functionCode,
          verify_jwt: true,
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to deploy function: ${error}`);
    }
  }

  /**
   * Run database migrations
   */
  async runMigrations(migrationsPath: string): Promise<void> {
    const projectRef = this.config.projectRef || process.env.SUPABASE_PROJECT_REF;
    if (!projectRef) {
      throw new Error('Project reference is required');
    }

    // Get all SQL files in migrations directory
    const files = await fs.readdir(migrationsPath);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

    for (const file of sqlFiles) {
      const sql = await fs.readFile(path.join(migrationsPath, file), 'utf-8');
      
      const response = await fetch(
        `${this.baseUrl}/v1/projects/${projectRef}/database/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: sql })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to run migration ${file}: ${error}`);
      }
    }
  }

  /**
   * Link project (save configuration)
   */
  async linkProject(projectRef: string): Promise<void> {
    // Verify the project exists
    const response = await fetch(
      `${this.baseUrl}/v1/projects/${projectRef}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
        }
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to link project: ${error}`);
    }

    // Project exists, configuration will be saved by the command
  }

  /**
   * List all edge functions in a project
   */
  async listFunctions(): Promise<any[]> {
    const projectRef = this.config.projectRef || process.env.SUPABASE_PROJECT_REF;
    if (!projectRef) {
      throw new Error('Project reference is required');
    }

    const response = await fetch(
      `${this.baseUrl}/v1/projects/${projectRef}/functions`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
        }
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to list functions: ${error}`);
    }

    const data = await response.json() as { functions: any[] };
    return data.functions || [];
  }
}
