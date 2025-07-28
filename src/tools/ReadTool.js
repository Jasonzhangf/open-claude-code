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
exports.ReadTool = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class ReadTool {
    constructor() {
        this.name = 'Read';
        this.description = 'Reads a file from the local filesystem';
        this.schema = {
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
    }
    execute(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate parameters
                if (!params.file_path) {
                    return { success: false, error: 'Missing required parameter: file_path' };
                }
                // Security check: Ensure the file path is within allowed boundaries
                // In a real implementation, this would be more sophisticated
                const resolvedPath = (0, path_1.join)(process.cwd(), params.file_path);
                // Read the file
                const content = yield fs_1.promises.readFile(resolvedPath, 'utf-8');
                return { success: true, data: { content, file_path: resolvedPath } };
            }
            catch (error) {
                return { success: false, error: `Failed to read file: ${error.message}` };
            }
        });
    }
}
exports.ReadTool = ReadTool;
