import { AsyncMessageQueue } from './core/MessageQueue';
import { AgentLoop } from './core/AgentLoop';
import { ReadTool } from './tools/ReadTool';
import { SimpleMemoryManager } from './memory/MemoryManager';
import { SimplePermissionManager } from './security/PermissionManager';

async function main() {
  console.log('Starting Claude Code replica...');
  
  // Initialize core components
  const messageQueue = new AsyncMessageQueue();
  const agentLoop = new AgentLoop(messageQueue, {
    maxConcurrentTasks: 10,
    taskTimeout: 30000
  });
  
  const memoryManager = new SimpleMemoryManager();
  const permissionManager = new SimplePermissionManager();
  
  // Register tools
  const readTool = new ReadTool();
  agentLoop.registerTool(readTool);
  
  // Add a simple permission rule
  permissionManager.addRule(async (request) => {
    // In a real implementation, this would check against actual user permissions
    console.log(`Permission check for ${request.userId} on ${request.resource}`);
    return { granted: true };
  });
  
  // Start the agent loop
  console.log('Starting agent loop...');
  agentLoop.start().catch(console.error);
  
  // Simulate sending a message after a short delay
  setTimeout(() => {
    messageQueue.enqueue({
      id: '1',
      type: 'tool_call',
      payload: {
        toolName: 'Read',
        params: {
          file_path: 'package.json'
        }
      },
      timestamp: Date.now()
    }).catch(console.error);
  }, 1000);
}

main().catch(console.error);
