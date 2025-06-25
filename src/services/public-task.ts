interface PublicTaskConfig {
  projectUrl: string;
  anonKey: string;
  projectRef?: string;
}

interface NewTaskResponse {
  success: boolean;
  message: string;
  task?: {
    id: number;
    content: string;
    status: string;
    created_at: string;
    metadata: Record<string, unknown>;
  };
}

export class PublicTaskService {
  private config: PublicTaskConfig;

  constructor(config: PublicTaskConfig) {
    this.config = config;
  }

  /**
   * Add a new task to the public tasks queue
   */
  async addTask(taskContent: string, metadata?: Record<string, unknown>): Promise<NewTaskResponse> {
    const response = await fetch(
      `${this.config.projectUrl}/functions/v1/new-public-task`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.anonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: taskContent,
          metadata: metadata || {},
          projectRef: this.config.projectRef
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to add task: ${error}`);
    }

    const data = await response.json() as NewTaskResponse;
    return data;
  }
}