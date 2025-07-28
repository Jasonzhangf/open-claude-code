"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
class Agent {
    constructor(config) {
        this.config = config;
        this.state = { status: 'idle' };
    }
    getStatus() {
        return this.state;
    }
    getConfig() {
        return this.config;
    }
}
exports.Agent = Agent;
