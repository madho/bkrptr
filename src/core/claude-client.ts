// src/core/claude-client.ts

import Anthropic from '@anthropic-ai/sdk';
import { Logger } from '../utils/logger';
import { ConfigLoader } from '../utils/config-loader';

export class ClaudeClient {
  private client: Anthropic;
  private logger: Logger;
  private modelId: string;

  constructor(modelId: string = 'claude-sonnet-4-5-20250929') {
    const configLoader = new ConfigLoader();
    const apiKey = configLoader.getApiKey();

    if (!apiKey) {
      throw new Error(
        'ANTHROPIC_API_KEY not found.\n' +
        'Run: bkrptr config --set-api-key YOUR_KEY\n' +
        'Or set ANTHROPIC_API_KEY environment variable'
      );
    }

    this.client = new Anthropic({ apiKey });
    this.logger = new Logger();
    this.modelId = modelId;
  }

  async generateWithStreaming(
    prompt: string,
    onChunk?: (text: string) => void
  ): Promise<{ content: string; usage?: { input_tokens: number; output_tokens: number } }> {
    this.logger.debug('Starting streaming generation');

    let fullResponse = '';
    let usage: { input_tokens: number; output_tokens: number } | undefined;

    // Set max_tokens based on model capabilities
    const maxTokens = this.modelId.includes('haiku') ? 8192 : 16000;

    try {
      const stream = await this.client.messages.stream({
        model: this.modelId,
        max_tokens: maxTokens,
        temperature: 1,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta') {
          const text = chunk.delta.text;
          fullResponse += text;
          if (onChunk) {
            onChunk(text);
          }
        }
      }

      // Get final message with usage stats
      const finalMessage = await stream.finalMessage();
      if (finalMessage.usage) {
        usage = {
          input_tokens: finalMessage.usage.input_tokens,
          output_tokens: finalMessage.usage.output_tokens
        };
      }

      return {
        content: fullResponse,
        usage
      };

    } catch (error: any) {
      this.logger.error('Streaming generation failed', error);
      throw new Error(`Claude API error: ${error.message}`);
    }
  }

  async generate(prompt: string): Promise<{ content: string; usage?: { input_tokens: number; output_tokens: number } }> {
    this.logger.debug('Starting generation');

    // Set max_tokens based on model capabilities
    const maxTokens = this.modelId.includes('haiku') ? 8192 : 16000;

    try {
      const response = await this.client.messages.create({
        model: this.modelId,
        max_tokens: maxTokens,
        temperature: 1,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const textContent = response.content.find(c => c.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text content in response');
      }

      return {
        content: textContent.text,
        usage: response.usage
      };

    } catch (error: any) {
      this.logger.error('Generation failed', error);
      throw new Error(`Claude API error: ${error.message}`);
    }
  }
}
