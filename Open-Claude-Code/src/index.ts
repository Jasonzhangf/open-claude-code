import { AsyncMessageQueue } from './core/MessageQueue';
import { AgentLoop } from './core/AgentLoop';
import { ReadTool } from './tools/ReadTool';
import { SimpleMemoryManager } from './memory/MemoryManager';
import { SimplePermissionManager } from './security/PermissionManager';

async function main() {
  console.log('Starting Claude Code replica...');
  
  // Initialize core components
  const messageQueue = new AsyncMessageQueue();
  const outputQueue = new AsyncMessageQueue();
  const agentLoop = new AgentLoop(messageQueue, outputQueue, {
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
  
  // Start a simple CLI for user input
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function askQuestion() {
    readline.question('Enter a command: ', (command: string) => {
      // For now, let's just simulate a tool call based on the command
      messageQueue.enqueue({
        id: Date.now().toString(),
        type: 'tool_call',
        payload: {
          toolName: 'Read',
          params: { file_path: command }
        },
        timestamp: Date.now()
      }).catch(console.error);

      askQuestion(); // Ask for the next command
    });
  }

  askQuestion();

  async function handleOutput() {
    while (true) {
      const output = await outputQueue.dequeue();
      if (output) {
        if (output.type === 'status_update') {
          console.log(`\n[STATUS] ${output.payload.status}`);
        } else if (output.type === 'tool_result') {
          console.log('\n--- Agent Output ---');
          console.log(JSON.stringify(output.payload, null, 2));
          console.log('--------------------');
        }
        process.stdout.write('\nEnter a command: ');
      }
    }
  }

  handleOutput().catch(console.error);
}

main().catch(console.error);
