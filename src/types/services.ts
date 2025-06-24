export interface ServiceAuth {
  token?: string;
  email?: string;
  userId?: string;
  expiresAt?: string;
  refreshToken?: string;
}

export interface ServiceConfig {
  name: string;
  displayName: string;
  authCommand: string;
  authUrl?: string;
  configKey: string;
  required: boolean;
  authType: 'token' | 'oauth' | 'cli' | 'api-key';
}

export interface ServicesAuthConfig {
  [serviceName: string]: ServiceAuth;
}

export const SUPPORTED_SERVICES: ServiceConfig[] = [
  {
    name: 'slack',
    displayName: 'Slack',
    authCommand: 'slack login',
    configKey: 'slack',
    required: false,
    authType: 'oauth'
  },
  {
    name: 'vercel',
    displayName: 'Vercel',
    authCommand: 'vercel login',
    configKey: 'vercel',
    required: false,
    authType: 'cli'
  },
  {
    name: 'supabase',
    displayName: 'Supabase',
    authCommand: 'supabase login',
    configKey: 'supabase',
    required: false,
    authType: 'cli'
  },
  {
    name: 'gh',
    displayName: 'GitHub',
    authCommand: 'gh auth login',
    configKey: 'github',
    required: false,
    authType: 'cli'
  },
  {
    name: 'mermaidchart',
    displayName: 'MermaidChart',
    authCommand: 'mermaidchart login',
    configKey: 'mermaidchart',
    required: false,
    authType: 'api-key'
  },
  {
    name: 'flyio',
    displayName: 'Fly.io',
    authCommand: 'fly auth login',
    configKey: 'flyio',
    required: false,
    authType: 'cli'
  },
  {
    name: 'claude',
    displayName: 'Claude Code',
    authCommand: 'claude login',
    configKey: 'claude',
    required: false,
    authType: 'cli'
  },
  {
    name: 'codex',
    displayName: 'OpenAI Codex',
    authCommand: 'codex login',
    configKey: 'codex',
    required: false,
    authType: 'api-key'
  },
  {
    name: 'linear',
    displayName: 'Linear',
    authCommand: 'linear login',
    configKey: 'linear',
    required: false,
    authType: 'cli'
  }
];
