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
exports.AsyncMessageQueue = void 0;
class AsyncMessageQueue {
    constructor() {
        this.queue = [];
        this.resolvers = [];
    }
    enqueue(message) {
        return __awaiter(this, void 0, void 0, function* () {
            // If there's a waiting dequeue operation, resolve it immediately
            if (this.resolvers.length > 0) {
                const resolve = this.resolvers.shift();
                if (resolve) {
                    resolve(message);
                    return;
                }
            }
            // Otherwise, add to queue
            this.queue.push(message);
        });
    }
    dequeue() {
        return __awaiter(this, void 0, void 0, function* () {
            // If queue has items, return one immediately
            if (this.queue.length > 0) {
                return this.queue.shift();
            }
            // Otherwise, return a promise that resolves when an item is enqueued
            return new Promise((resolve) => {
                this.resolvers.push(resolve);
            });
        });
    }
    peek() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.queue[0];
        });
    }
    size() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.queue.length;
        });
    }
    isEmpty() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.queue.length === 0;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this.queue = [];
            // Resolve any pending dequeue promises with undefined
            while (this.resolvers.length > 0) {
                const resolve = this.resolvers.shift();
                if (resolve) {
                    resolve(undefined);
                }
            }
        });
    }
}
exports.AsyncMessageQueue = AsyncMessageQueue;
