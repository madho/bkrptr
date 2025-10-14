// src/core/document-generator.ts

import { ClaudeClient } from './claude-client';
import chalk from 'chalk';

export interface GenerationResult {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export class DocumentGenerator {
  constructor(private claudeClient: ClaudeClient) {}

  async generate(prompt: string, stream: boolean = false): Promise<GenerationResult> {
    if (stream) {
      const content = await this.claudeClient.generateWithStreaming(
        prompt,
        (chunk) => {
          // Stream output to terminal
          process.stdout.write(chalk.gray(chunk));
        }
      );
      return { content };
    } else {
      const result = await this.claudeClient.generate(prompt);
      return {
        content: result.content,
        usage: result.usage ? {
          inputTokens: result.usage.input_tokens,
          outputTokens: result.usage.output_tokens
        } : undefined
      };
    }
  }
}
