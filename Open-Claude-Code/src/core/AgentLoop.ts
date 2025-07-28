import { Agent } from './Agent';
import { Message, MessageQueue } from './MessageQueue';
import { Tool } from '../tools/Tool';

export interface AgentLoopConfig {
  maxConcurrentTasks: number;
  taskTimeout: number; // in milliseconds
}

export class AgentLoop {
  private agents: Map<string, Agent> = new Map();
  private tools: Map<string, Tool> = new Map();
  private messageQueue: MessageQueue;
  private outputQueue: MessageQueue;
  private config: AgentLoopConfig;
  private isRunning: boolean = false;

  constructor(messageQueue: MessageQueue, outputQueue: MessageQueue, config: AgentLoopConfig) {
    this.messageQueue = messageQueue;
    this.outputQueue = outputQueue;
    this.config = config;
  }

  registerAgent(agent: Agent): void {
    this.agents.set(agent.getConfig().id, agent);
  }

  unregisterAgent(agentId: string): boolean {
    return this.agents.delete(agentId);
  }

  registerTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  unregisterTool(toolName: string): boolean {
    return this.tools.delete(toolName);
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('AgentLoop is already running');
    }
    
    this.isRunning = true;
    console.log('AgentLoop started');
    
    // Main processing loop
    while (this.isRunning) {
      try {
        const message = await this.messageQueue.dequeue();
        if (message) {
          await this.processMessage(message);
        }
      } catch (error) {
        console.error('Error in AgentLoop:', error);
        // In a production system, we'd want more sophisticated error handling
      }
    }
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    console.log('AgentLoop stopped');
  }

  private async processMessage(message: Message): Promise<void> {
    this.outputQueue.enqueue({
      id: message.id,
      type: 'status_update',
      payload: { status: `Processing message of type: ${message.type}` },
      timestamp: Date.now()
    });
    
    // This is a simplified message processing logic
    // In a real implementation, this would be much more complex
    switch (message.type) {
      case 'tool_call':
        await this.handleToolCall(message);
        break;
      case 'agent_task':
        await this.handleAgentTask(message);
        break;
      default:
        console.warn(`Unknown message type: ${message.type}`);
    }
  }

  private async handleToolCall(message: Message): Promise<void> {
    const { toolName, params } = message.payload;
    const tool = this.tools.get(toolName);
    
    this.outputQueue.enqueue({
      id: message.id,
      type: 'status_update',
      payload: { status: `Using tool: ${toolName}` },
      timestamp: Date.now()
    });

    if (!tool) {
      this.outputQueue.enqueue({
        id: message.id,
        type: 'tool_result',
        payload: { success: false, error: `Tool not found: ${toolName}` },
        timestamp: Date.now()
      });
      return;
    }
    
    try {
      const result = await tool.execute(params);
      this.outputQueue.enqueue({
        id: message.id,
        type: 'tool_result',
        payload: result,
        timestamp: Date.now()
      });
    } catch (error: any) {
      this.outputQueue.enqueue({
        id: message.id,
        type: 'tool_result',
        payload: { success: false, error: `Error executing tool ${toolName}: ${error.message}` },
        timestamp: Date.now()
      });
    }
  }

  private async handleAgentTask(message: Message): Promise<void> {
    const { agentId, task } = message.payload;
    const agent = this.agents.get(agentId);
    
    if (!agent) {
      console.error(`Agent not found: ${agentId}`);
      return;
    }
    
    try {
      const result = await agent.execute(task);
      console.log(`Agent ${agentId} executed task with result:`, result);
      // In a real implementation, we'd send the result back as a new message
    } catch (error) {
      console.error(`Error executing task for agent ${agentId}:`, error);
    }
  }
}
