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
exports.AgentLoop = void 0;
class AgentLoop {
    constructor(messageQueue, config) {
        this.agents = new Map();
        this.tools = new Map();
        this.isRunning = false;
        this.messageQueue = messageQueue;
        this.config = config;
    }
    registerAgent(agent) {
        this.agents.set(agent.getConfig().id, agent);
    }
    unregisterAgent(agentId) {
        return this.agents.delete(agentId);
    }
    registerTool(tool) {
        this.tools.set(tool.name, tool);
    }
    unregisterTool(toolName) {
        return this.tools.delete(toolName);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isRunning) {
                throw new Error('AgentLoop is already running');
            }
            this.isRunning = true;
            console.log('AgentLoop started');
            // Main processing loop
            while (this.isRunning) {
                try {
                    const message = yield this.messageQueue.dequeue();
                    if (message) {
                        yield this.processMessage(message);
                    }
                }
                catch (error) {
                    console.error('Error in AgentLoop:', error);
                    // In a production system, we'd want more sophisticated error handling
                }
            }
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isRunning = false;
            console.log('AgentLoop stopped');
        });
    }
    processMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Processing message of type: ${message.type}`);
            // This is a simplified message processing logic
            // In a real implementation, this would be much more complex
            switch (message.type) {
                case 'tool_call':
                    yield this.handleToolCall(message);
                    break;
                case 'agent_task':
                    yield this.handleAgentTask(message);
                    break;
                default:
                    console.warn(`Unknown message type: ${message.type}`);
            }
        });
    }
    handleToolCall(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { toolName, params } = message.payload;
            const tool = this.tools.get(toolName);
            if (!tool) {
                console.error(`Tool not found: ${toolName}`);
                return;
            }
            try {
                const result = yield tool.execute(params);
                console.log(`Tool ${toolName} executed with result:`, result);
                // In a real implementation, we'd send the result back as a new message
            }
            catch (error) {
                console.error(`Error executing tool ${toolName}:`, error);
            }
        });
    }
    handleAgentTask(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { agentId, task } = message.payload;
            const agent = this.agents.get(agentId);
            if (!agent) {
                console.error(`Agent not found: ${agentId}`);
                return;
            }
            try {
                const result = yield agent.execute(task);
                console.log(`Agent ${agentId} executed task with result:`, result);
                // In a real implementation, we'd send the result back as a new message
            }
            catch (error) {
                console.error(`Error executing task for agent ${agentId}:`, error);
            }
        });
    }
}
exports.AgentLoop = AgentLoop;
