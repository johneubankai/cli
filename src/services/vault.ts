interface VaultConfig {
  projectUrl: string;
  anonKey: string;
  projectRef?: string;
}

interface VaultSecret {
  name: string;
  value?: string;
}

export class VaultService {
  private config: VaultConfig;

  constructor(config: VaultConfig) {
    this.config = config;
  }

  /**
   * List all secrets in the vault
   */
  async listSecrets(): Promise<VaultSecret[]> {
    const response = await fetch(
      `${this.config.projectUrl}/functions/v1/vault-list`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.anonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectRef: this.config.projectRef
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to list secrets: ${error}`);
    }

    const data = await response.json() as { secrets?: VaultSecret[] };
    return data.secrets || [];
  }

  /**
   * Get a specific secret from the vault
   */
  async getSecret(key: string, reveal: boolean = false): Promise<VaultSecret> {
    const response = await fetch(
      `${this.config.projectUrl}/functions/v1/vault-get`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.anonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          reveal,
          projectRef: this.config.projectRef
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get secret: ${error}`);
    }

    const data = await response.json() as VaultSecret;
    return data;
  }

  /**
   * Add or update a secret in the vault
   */
  async setSecret(key: string, value: string): Promise<void> {
    const response = await fetch(
      `${this.config.projectUrl}/functions/v1/vault-set`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.anonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value,
          projectRef: this.config.projectRef
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to set secret: ${error}`);
    }
  }

  /**
   * Remove a secret from the vault
   */
  async removeSecret(key: string): Promise<void> {
    const response = await fetch(
      `${this.config.projectUrl}/functions/v1/vault-remove`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.anonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          projectRef: this.config.projectRef
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to remove secret: ${error}`);
    }
  }
}
