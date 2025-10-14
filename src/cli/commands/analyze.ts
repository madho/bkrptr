// src/cli/commands/analyze.ts

import { BookAnalyzer } from '../../core/analyzer';
import { AnalysisInput, BookGenre } from '../../types';
import { Logger } from '../../utils/logger';
import { Validator } from '../../utils/validator';
import { openInViewer } from '../../utils/file-opener';
import chalk from 'chalk';
import * as fs from 'fs/promises';

interface AnalyzeOptions {
  author: string;
  genre: string;
  purpose: string;
  audience: string;
  depth: 'quick' | 'standard' | 'comprehensive';
  context?: string;
  input?: string;
  outputDir: string;
  focus?: string;
  stream: boolean;
  save: boolean;
  open: boolean;
  verbose: boolean;
}

export async function analyzeCommand(title: string, options: AnalyzeOptions) {
  const logger = new Logger();

  try {
    // Validate required fields
    if (!options.author) {
      throw new Error('Author name is required. Use -a or --author flag.');
    }

    if (!options.genre) {
      throw new Error('Genre is required. Use -g or --genre flag.');
    }

    // Validate genre
    if (!Validator.isValidGenre(options.genre)) {
      throw new Error(
        `Invalid genre: ${options.genre}\n` +
        'Valid genres: technical, philosophy, fiction, academic, business, ' +
        'self-help, history, science, mathematics, leadership, psychology, biography'
      );
    }

    // Read book content if provided
    let bookContent: string | undefined;
    if (options.input) {
      try {
        bookContent = await fs.readFile(options.input, 'utf-8');
        console.log(chalk.gray(`📄 Loaded book content from ${options.input}\n`));
      } catch (error) {
        throw new Error(`Failed to read input file: ${options.input}`);
      }
    }

    // Parse focus areas
    const focusAreas = options.focus
      ? options.focus.split(',').map(f => f.trim())
      : undefined;

    // Build analysis input
    const input: AnalysisInput = {
      bookTitle: title,
      author: options.author,
      genre: options.genre as BookGenre,
      purpose: options.purpose as any,
      audience: options.audience,
      analysisDepth: options.depth,
      specificContext: options.context,
      focusAreas,
      bookContent,
    };

    console.log(chalk.bold.blue('\n📚 bkrptr - Book Analysis\n'));
    console.log(chalk.gray('Book:'), chalk.white(title));
    console.log(chalk.gray('Author:'), chalk.white(options.author));
    console.log(chalk.gray('Genre:'), chalk.white(options.genre));
    console.log(chalk.gray('Depth:'), chalk.white(options.depth));
    console.log(chalk.gray('Purpose:'), chalk.white(options.purpose));
    console.log('');

    // Run analysis
    const analyzer = new BookAnalyzer();
    const result = await analyzer.analyze(input, {
      stream: options.stream,
      save: options.save,
      outputDir: options.outputDir,
      verbose: options.verbose,
    });

    // Display results
    console.log(chalk.green.bold('\n✅ Analysis complete!\n'));

    if (options.save) {
      console.log(chalk.bold('📁 Files saved:'));
      console.log(chalk.gray(`   Detailed: ${result.files.detailed}`));
      console.log(chalk.gray(`   Summary:  ${result.files.summary}`));
      console.log(chalk.gray(`   Reference: ${result.files.reference}`));
      console.log('');
    }

    console.log(chalk.gray(`⏱️  Generation time: ${(result.metadata.generationTime! / 1000).toFixed(1)}s`));
    console.log(chalk.gray(`🆔 Analysis ID: ${result.metadata.id}`));

    // Open if requested
    if (options.open && options.save) {
      console.log(chalk.blue('\n📖 Opening analysis...\n'));
      await openInViewer(result.files.detailed);
    }

    if (options.save) {
      console.log(chalk.gray(`\n💡 Tip: Use ${chalk.cyan(`bkrptr view ${result.metadata.id}`)} to view in terminal`));
    }

  } catch (error: any) {
    logger.error('Analysis command failed', error);
    console.error(chalk.red('\n❌ Error:'), error.message);
    process.exit(1);
  }
}
