export interface Project {
  id: string;
  name: string;
  framework?: string;
  rootDirectory?: string;
  outputDirectory?: string;
  linkedAt?: Date;
}

export interface Deployment {
  id: string;
  url: string;
  createdAt: Date;
  state: 'READY' | 'ERROR' | 'BUILDING' | 'QUEUED' | 'CANCELED';
  creator: string;
  meta?: Record<string, unknown>;
}

export interface Environment {
  key: string;
  value: string;
  target: EnvironmentTarget[];
  type?: 'plain' | 'secret';
  id?: string;
  createdAt?: Date;
}

export type EnvironmentTarget = 'production' | 'preview' | 'development';

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
}

export * from './services';
export * from './config';