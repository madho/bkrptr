// src/cli/commands/batch.ts

import { BookAnalyzer } from '../../core/analyzer';
import { GenreDetector } from '../../core/genre-detector';
import { AnalysisInput, BookGenre } from '../../types';
import { Logger } from '../../utils/logger';
import { Validator } from '../../utils/validator';
import chalk from 'chalk';
import * as fs from 'fs/promises';
import * as path from 'path';

interface BatchBookInput {
  title: string;
  author: string;
  genre?: BookGenre;
}

interface BatchOptions {
  input: string;
  outputDir: string;
  depth: 'quick' | 'standard' | 'comprehensive';
  parallel: boolean;
  verbose: boolean;
}

export async function batchCommand(options: BatchOptions) {
  const logger = new Logger();

  try {
    console.log(chalk.bold.blue('\n📚 bkrptr - Batch Analysis\n'));

    // Read batch input file
    const inputPath = path.resolve(options.input);
    const fileContent = await fs.readFile(inputPath, 'utf-8');

    let books: BatchBookInput[];

    // Parse input file (support JSON or CSV)
    if (inputPath.endsWith('.json')) {
      books = JSON.parse(fileContent);
    } else if (inputPath.endsWith('.csv')) {
      // Simple CSV parsing (title,author,genre)
      const lines = fileContent.split('\n').filter(l => l.trim());
      const header = lines[0].toLowerCase().split(',');

      books = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const book: BatchBookInput = {
          title: '',
          author: ''
        };

        header.forEach((col, idx) => {
          if (col === 'title') book.title = values[idx];
          if (col === 'author') book.author = values[idx];
          if (col === 'genre') book.genre = values[idx] as BookGenre;
        });

        return book;
      }).filter(book => book.title && book.author);
    } else {
      throw new Error('Input file must be .json or .csv format');
    }

    console.log(chalk.gray(`Found ${books.length} books to analyze\n`));

    const analyzer = new BookAnalyzer();
    const genreDetector = new GenreDetector();
    const results: Array<{ book: BatchBookInput; success: boolean; error?: string; cost?: number }> = [];

    if (options.parallel) {
      // Parallel processing
      console.log(chalk.blue('🚀 Processing books in parallel...\n'));

      const analyses = books.map(async (book) => {
        try {
          console.log(chalk.gray(`Starting: ${book.title} by ${book.author}`));

          // Auto-detect genre if not provided
          const genre = book.genre || (await genreDetector.detectGenre(book.title, book.author)).genre;

          const input: AnalysisInput = {
            bookTitle: book.title,
            author: book.author,
            genre,
            purpose: 'study',
            audience: 'senior executives',
            analysisDepth: options.depth,
          };

          const result = await analyzer.analyze(input, {
            stream: false,
            save: true,
            outputDir: options.outputDir,
            verbose: options.verbose,
          });

          console.log(chalk.green(`✓ Completed: ${book.title} ($${result.metadata.usage?.estimatedCost.toFixed(3) || '?'})`));

          return {
            book,
            success: true,
            cost: result.metadata.usage?.estimatedCost
          };
        } catch (error: any) {
          console.log(chalk.red(`✗ Failed: ${book.title} - ${error.message}`));
          return { book, success: false, error: error.message };
        }
      });

      const settled = await Promise.allSettled(analyses);
      settled.forEach(result => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        }
      });

    } else {
      // Sequential processing
      console.log(chalk.blue('⏳ Processing books sequentially...\n'));

      for (const book of books) {
        try {
          console.log(chalk.cyan(`\n📖 Analyzing: ${book.title} by ${book.author}\n`));

          // Auto-detect genre if not provided
          const genre = book.genre || (await genreDetector.detectGenre(book.title, book.author)).genre;

          const input: AnalysisInput = {
            bookTitle: book.title,
            author: book.author,
            genre,
            purpose: 'study',
            audience: 'senior executives',
            analysisDepth: options.depth,
          };

          const result = await analyzer.analyze(input, {
            stream: false,
            save: true,
            outputDir: options.outputDir,
            verbose: options.verbose,
          });

          console.log(chalk.green(`\n✓ Completed: ${book.title}\n`));

          results.push({
            book,
            success: true,
            cost: result.metadata.usage?.estimatedCost
          });

        } catch (error: any) {
          console.log(chalk.red(`\n✗ Failed: ${book.title} - ${error.message}\n`));
          results.push({ book, success: false, error: error.message });
        }
      }
    }

    // Summary
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    const totalCost = successful.reduce((sum, r) => sum + (r.cost || 0), 0);

    console.log(chalk.bold.green('\n📊 Batch Analysis Complete\n'));
    console.log(chalk.gray(`Successful: ${successful.length}/${books.length}`));
    if (failed.length > 0) {
      console.log(chalk.red(`Failed: ${failed.length}/${books.length}`));
      failed.forEach(f => {
        console.log(chalk.red(`  - ${f.book.title}: ${f.error}`));
      });
    }
    console.log(chalk.green(`\nTotal cost: $${totalCost.toFixed(3)}`));
    console.log(chalk.gray(`Average cost per book: $${(totalCost / successful.length).toFixed(3)}\n`));

  } catch (error: any) {
    logger.error('Batch command failed', error);
    console.error(chalk.red('\n❌ Error:'), error.message);
    process.exit(1);
  }
}
