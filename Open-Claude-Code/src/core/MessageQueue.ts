export interface Message {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  priority?: number;
}

export interface MessageQueue<T extends Message = Message> {
  enqueue(message: T): Promise<void>;
  dequeue(): Promise<T | undefined>;
  peek(): Promise<T | undefined>;
  size(): Promise<number>;
  isEmpty(): Promise<boolean>;
  clear(): Promise<void>;
}

export class AsyncMessageQueue<T extends Message = Message> implements MessageQueue<T> {
  private queue: T[] = [];
  private resolvers: ((value: T | undefined) => void)[] = [];

  async enqueue(message: T): Promise<void> {
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
  }

  async dequeue(): Promise<T | undefined> {
    // If queue has items, return one immediately
    if (this.queue.length > 0) {
      return this.queue.shift();
    }
    
    // Otherwise, return a promise that resolves when an item is enqueued
    return new Promise((resolve) => {
      this.resolvers.push(resolve);
    });
  }

  async peek(): Promise<T | undefined> {
    return this.queue[0];
  }

  async size(): Promise<number> {
    return this.queue.length;
  }

  async isEmpty(): Promise<boolean> {
    return this.queue.length === 0;
  }

  async clear(): Promise<void> {
    this.queue = [];
    // Resolve any pending dequeue promises with undefined
    while (this.resolvers.length > 0) {
      const resolve = this.resolvers.shift();
      if (resolve) {
        resolve(undefined);
      }
    }
  }
}
