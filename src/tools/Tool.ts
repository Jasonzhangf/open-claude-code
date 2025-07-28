export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  required: boolean;
  description: string;
}

export interface ToolSchema {
  name: string;
  description: string;
  parameters: ToolParameter[];
}

export interface Tool {
  name: string;
  description: string;
  schema: ToolSchema;
  execute(params: any): Promise<ToolResult>;
}
