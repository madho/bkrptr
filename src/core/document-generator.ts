// src/core/document-generator.ts

import { ClaudeClient } from './claude-client';
import chalk from 'chalk';

export class DocumentGenerator {
  constructor(private claudeClient: ClaudeClient) {}

  async generate(prompt: string, stream: boolean = false): Promise<string> {
    if (stream) {
      return await this.claudeClient.generateWithStreaming(
        prompt,
        (chunk) => {
          // Stream output to terminal
          process.stdout.write(chalk.gray(chunk));
        }
      );
    } else {
      return await this.claudeClient.generate(prompt);
    }
  }
}
