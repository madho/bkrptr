// src/core/analyzer.ts

import { ClaudeClient } from './claude-client';
import { PromptBuilder } from './prompt-builder';
import { DocumentGenerator } from './document-generator';
import { FileStorage } from '../storage/file-storage';
import { Logger } from '../utils/logger';
import { Validator } from '../utils/validator';
import { AnalysisInput, AnalysisOutput } from '../types';
import ora from 'ora';
import chalk from 'chalk';

export interface AnalyzerOptions {
  stream?: boolean;
  save?: boolean;
  verbose?: boolean;
  outputDir?: string;
}

export class BookAnalyzer {
  private claudeClient: ClaudeClient;
  private promptBuilder: PromptBuilder;
  private documentGenerator: DocumentGenerator;
  private storage: FileStorage;
  private logger: Logger;
  private modelId: string;

  constructor(modelId: string = 'claude-sonnet-4-5-20250929') {
    this.modelId = modelId;
    this.claudeClient = new ClaudeClient(modelId);
    this.promptBuilder = new PromptBuilder();
    this.documentGenerator = new DocumentGenerator(this.claudeClient);
    this.storage = new FileStorage();
    this.logger = new Logger();
  }

  async analyze(
    input: AnalysisInput,
    options: AnalyzerOptions = {}
  ): Promise<AnalysisOutput> {
    const startTime = Date.now();

    this.logger.info('Starting analysis', {
      bookTitle: input.bookTitle,
      genre: input.genre,
      depth: input.analysisDepth
    });

    // Validate input
    const errors = Validator.validateAnalysisInput(input);
    if (errors.length > 0) {
      throw new Error(`Validation failed:\n${errors.join('\n')}`);
    }

    // Generate analysis ID
    const analysisId = this.generateAnalysisId(input);

    // Create spinners for progress
    const spinner = options.stream ? null : ora();

    try {
      // Track usage across all documents
      let totalInputTokens = 0;
      let totalOutputTokens = 0;

      // Generate MADHO SUMMARY first (PRIMARY OUTPUT)
      if (spinner) spinner.start('Generating MADHO summary...');
      if (!spinner) console.log(chalk.blue('\n✨ Generating MADHO summary (primary)...\n'));

      const madhoPrompt = this.promptBuilder.buildMadhoSummaryPrompt(input);
      const madhoResult = await this.documentGenerator.generate(
        madhoPrompt,
        options.stream
      );
      if (madhoResult.usage) {
        totalInputTokens += madhoResult.usage.inputTokens;
        totalOutputTokens += madhoResult.usage.outputTokens;
      }

      if (spinner) spinner.succeed('MADHO summary complete');
      if (!spinner) console.log(chalk.green('\n✓ MADHO summary complete\n'));

      // Generate detailed analysis
      if (spinner) spinner.start('Generating detailed analysis...');
      if (!spinner) console.log(chalk.blue('\n📖 Generating detailed analysis...\n'));

      const detailedPrompt = this.promptBuilder.buildDetailedAnalysisPrompt(input);
      const detailedResult = await this.documentGenerator.generate(
        detailedPrompt,
        options.stream
      );
      if (detailedResult.usage) {
        totalInputTokens += detailedResult.usage.inputTokens;
        totalOutputTokens += detailedResult.usage.outputTokens;
      }

      if (spinner) spinner.succeed('Detailed analysis complete');
      if (!spinner) console.log(chalk.green('\n✓ Detailed analysis complete\n'));

      // Generate summary
      if (spinner) spinner.start('Generating executive summary...');
      if (!spinner) console.log(chalk.blue('📋 Generating executive summary...\n'));

      const summaryPrompt = this.promptBuilder.buildSummaryPrompt(input);
      const summaryResult = await this.documentGenerator.generate(
        summaryPrompt,
        options.stream
      );
      if (summaryResult.usage) {
        totalInputTokens += summaryResult.usage.inputTokens;
        totalOutputTokens += summaryResult.usage.outputTokens;
      }

      if (spinner) spinner.succeed('Executive summary complete');
      if (!spinner) console.log(chalk.green('\n✓ Executive summary complete\n'));

      // Generate reference guide
      if (spinner) spinner.start('Generating quick reference...');
      if (!spinner) console.log(chalk.blue('📌 Generating quick reference...\n'));

      const referencePrompt = this.promptBuilder.buildReferencePrompt(input);
      const referenceResult = await this.documentGenerator.generate(
        referencePrompt,
        options.stream
      );
      if (referenceResult.usage) {
        totalInputTokens += referenceResult.usage.inputTokens;
        totalOutputTokens += referenceResult.usage.outputTokens;
      }

      if (spinner) spinner.succeed('Quick reference complete');
      if (!spinner) console.log(chalk.green('\n✓ Quick reference complete\n'));

      const generationTime = Date.now() - startTime;

      // Calculate costs based on model
      const modelPricing: Record<string, { input: number; output: number }> = {
        'claude-sonnet-4-5-20250929': { input: 3.00, output: 15.00 },
        'claude-sonnet-4-20250514': { input: 3.00, output: 15.00 },
        'claude-3-5-haiku-20241022': { input: 1.00, output: 5.00 }
      };

      const pricing = modelPricing[this.modelId] || { input: 3.00, output: 15.00 };
      const INPUT_COST_PER_MILLION = pricing.input;
      const OUTPUT_COST_PER_MILLION = pricing.output;
      const totalTokens = totalInputTokens + totalOutputTokens;
      const estimatedCost =
        (totalInputTokens / 1_000_000) * INPUT_COST_PER_MILLION +
        (totalOutputTokens / 1_000_000) * OUTPUT_COST_PER_MILLION;

      // Build output
      const output: AnalysisOutput = {
        documents: {
          madhoSummary: madhoResult.content,
          detailed: detailedResult.content,
          summary: summaryResult.content,
          reference: referenceResult.content,
        },
        metadata: {
          id: analysisId,
          generatedAt: new Date().toISOString(),
          input,
          generationTime,
          usage: {
            inputTokens: totalInputTokens,
            outputTokens: totalOutputTokens,
            totalTokens,
            estimatedCost
          }
        },
        files: {
          madhoSummary: '',
          detailed: '',
          summary: '',
          reference: '',
          metadata: '',
        },
      };

      // Save to disk if requested
      if (options.save !== false) {
        const outputDir = options.outputDir || './analyses';
        const files = await this.storage.saveAnalysis(output, outputDir);
        output.files = files;

        this.logger.info('Analysis saved', {
          id: analysisId,
          directory: outputDir
        });
      }

      this.logger.info('Analysis complete', {
        id: analysisId,
        timeMs: generationTime
      });

      return output;

    } catch (error) {
      if (spinner) spinner.fail('Analysis failed');
      this.logger.error('Analysis failed', error);
      throw error;
    }
  }

  private generateAnalysisId(input: AnalysisInput): string {
    const slug = Validator.sanitizeFilename(input.bookTitle);
    const date = new Date().toISOString().split('T')[0];

    // Extract short model name for the ID
    const modelShortName = this.modelId.includes('haiku-4.5') || this.modelId.includes('3-5-haiku') ? 'haiku-4.5' :
                           this.modelId.includes('sonnet-4-5') ? 'sonnet-4.5' :
                           this.modelId.includes('sonnet-4') ? 'sonnet-4' :
                           'unknown';

    return `${slug}-${modelShortName}-${date}`;
  }
}

export default BookAnalyzer;
