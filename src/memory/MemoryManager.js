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
exports.SimpleMemoryManager = void 0;
class SimpleMemoryManager {
    constructor() {
        this.memory = [];
        this.maxTokens = 8000; // Default token limit
    }
    add(item) {
        this.memory.push(item);
    }
    getRecent(count) {
        return this.memory.slice(-count);
    }
    getContext() {
        // In a real implementation, this would calculate actual token count
        const tokens = this.memory.reduce((acc, item) => acc + item.content.length, 0);
        return { messages: this.memory, tokens };
    }
    clear() {
        this.memory = [];
    }
    compress() {
        return __awaiter(this, void 0, void 0, function* () {
            // Placeholder for compression logic
            console.log('Compressing memory...');
        });
    }
}
exports.SimpleMemoryManager = SimpleMemoryManager;
