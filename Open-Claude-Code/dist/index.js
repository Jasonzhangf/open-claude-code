"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessageQueue_1 = require("./core/MessageQueue");
const AgentLoop_1 = require("./core/AgentLoop");
const ReadTool_1 = require("./tools/ReadTool");
const MemoryManager_1 = require("./memory/MemoryManager");
const PermissionManager_1 = require("./security/PermissionManager");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting Claude Code replica...');
        // Initialize core components
        const messageQueue = new MessageQueue_1.AsyncMessageQueue();
        const outputQueue = new MessageQueue_1.AsyncMessageQueue();
        const agentLoop = new AgentLoop_1.AgentLoop(messageQueue, outputQueue, {
            maxConcurrentTasks: 10,
            taskTimeout: 30000
        });
        const memoryManager = new MemoryManager_1.SimpleMemoryManager();
        const permissionManager = new PermissionManager_1.SimplePermissionManager();
        // Register tools
        const readTool = new ReadTool_1.ReadTool();
        agentLoop.registerTool(readTool);
        // Add a simple permission rule
        permissionManager.addRule((request) => __awaiter(this, void 0, void 0, function* () {
            // In a real implementation, this would check against actual user permissions
            console.log(`Permission check for ${request.userId} on ${request.resource}`);
            return { granted: true };
        }));
        // Start the agent loop
        console.log('Starting agent loop...');
        agentLoop.start().catch(console.error);
        // Start a simple CLI for user input
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        function askQuestion() {
            readline.question('Enter a command: ', (command) => {
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
        function handleOutput() {
            return __awaiter(this, void 0, void 0, function* () {
                while (true) {
                    const output = yield outputQueue.dequeue();
                    if (output) {
                        if (output.type === 'status_update') {
                            console.log(`\n[STATUS] ${output.payload.status}`);
                        }
                        else if (output.type === 'tool_result') {
                            console.log('\n--- Agent Output ---');
                            console.log(JSON.stringify(output.payload, null, 2));
                            console.log('--------------------');
                        }
                        process.stdout.write('\nEnter a command: ');
                    }
                }
            });
        }
        handleOutput().catch(console.error);
    });
}
main().catch(console.error);
