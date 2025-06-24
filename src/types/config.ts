import { ServicesAuthConfig } from './services';

export interface AuthConfig {
  token?: string;
  email?: string;
  teamId?: string;
}

export interface JxConfig {
  projectId?: string;
  orgId?: string;
  settings?: {
    buildCommand?: string;
    devCommand?: string;
    outputDirectory?: string;
    framework?: string;
  };
}

export interface GlobalConfig {
  auth?: AuthConfig;
  defaultTeam?: string;
  analytics?: boolean;
  services?: ServicesAuthConfig;
}
