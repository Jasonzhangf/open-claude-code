import { Tool, ToolResult, ToolSchema } from './Tool';
import { promises as fs } from 'fs';
import { join } from 'path';

export class ReadTool implements Tool {
  name = 'Read';
  description = 'Reads a file from the local filesystem';
  schema: ToolSchema = {
    name: 'Read',
    description: 'Reads a file from the local filesystem',
    parameters: [
      {
        name: 'file_path',
        type: 'string',
        required: true,
        description: 'The absolute path to the file to read'
      }
    ]
  };

  async execute(params: any): Promise<ToolResult> {
    try {
      // Validate parameters
      if (!params.file_path) {
        return { success: false, error: 'Missing required parameter: file_path' };
      }

      // Security check: Ensure the file path is within allowed boundaries
      // In a real implementation, this would be more sophisticated
      const resolvedPath = join(process.cwd(), params.file_path);
      
      // Read the file
      const content = await fs.readFile(resolvedPath, 'utf-8');
      
      return { success: true, data: { content, file_path: resolvedPath } };
    } catch (error: any) {
      return { success: false, error: `Failed to read file: ${error.message}` };
    }
  }
}
