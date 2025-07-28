export interface MemoryItem {
  id: string;
  content: string;
  type: 'user' | 'assistant' | 'system' | 'tool';
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface Context {
  messages: MemoryItem[];
  tokens: number;
}

export interface MemoryManager {
  add(item: MemoryItem): void;
  getRecent(count: number): MemoryItem[];
  getContext(): Context;
  clear(): void;
  compress(): Promise<void>;
}

export class SimpleMemoryManager implements MemoryManager {
  private memory: MemoryItem[] = [];
  private maxTokens: number = 8000; // Default token limit

  add(item: MemoryItem): void {
    this.memory.push(item);
  }

  getRecent(count: number): MemoryItem[] {
    return this.memory.slice(-count);
  }

  getContext(): Context {
    // In a real implementation, this would calculate actual token count
    const tokens = this.memory.reduce((acc, item) => acc + item.content.length, 0);
    return { messages: this.memory, tokens };
  }

  clear(): void {
    this.memory = [];
  }

  async compress(): Promise<void> {
    // Placeholder for compression logic
    console.log('Compressing memory...');
  }
}
