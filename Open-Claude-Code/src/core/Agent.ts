export interface AgentState {
  status: 'idle' | 'processing' | 'error';
  currentTask?: string;
  error?: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
}

export abstract class Agent {
  protected state: AgentState;
  protected config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    this.state = { status: 'idle' };
  }

  abstract execute(task: string): Promise<any>;

  getStatus(): AgentState {
    return this.state;
  }

  getConfig(): AgentConfig {
    return this.config;
  }
}
