// src/cli/commands/view.ts

import { FileStorage } from '../../storage/file-storage';
import { Logger } from '../../utils/logger';
import { MarkdownFormatter } from '../../utils/markdown-formatter';
import chalk from 'chalk';

interface ViewOptions {
  document: 'detailed' | 'summary' | 'reference' | 'all';
  raw: boolean;
}

export async function viewCommand(id: string, options: ViewOptions) {
  const logger = new Logger();
  const storage = new FileStorage();

  try {
    const analysis = await storage.loadAnalysis(id, './analyses');

    if (!analysis) {
      console.error(chalk.red(`\n❌ Analysis not found: ${id}\n`));
      console.log(chalk.gray('💡 Use'), chalk.cyan('bkrptr list'), chalk.gray('to see available analyses\n'));
      process.exit(1);
    }

    console.log(chalk.bold.blue('\n📖 Analysis View\n'));
    console.log(chalk.gray('Book:'), chalk.white(analysis.metadata.input.bookTitle));
    console.log(chalk.gray('Author:'), chalk.white(analysis.metadata.input.author));
    console.log(chalk.gray('Genre:'), chalk.white(analysis.metadata.input.genre));
    console.log('');

    const displayDocument = (title: string, content: string) => {
      console.log(chalk.bold.cyan(`\n${title}\n`));
      console.log(chalk.gray('='.repeat(60)));

      if (options.raw) {
        console.log(content);
      } else {
        console.log(MarkdownFormatter.formatForTerminal(content));
      }

      console.log(chalk.gray('\n' + '='.repeat(60)));
    };

    if (options.document === 'all') {
      displayDocument('📖 Detailed Analysis', analysis.documents.detailed);
      displayDocument('📋 Executive Summary', analysis.documents.summary);
      displayDocument('📌 Quick Reference', analysis.documents.reference);
    } else if (options.document === 'detailed') {
      displayDocument('📖 Detailed Analysis', analysis.documents.detailed);
    } else if (options.document === 'summary') {
      displayDocument('📋 Executive Summary', analysis.documents.summary);
    } else if (options.document === 'reference') {
      displayDocument('📌 Quick Reference', analysis.documents.reference);
    }

    console.log(chalk.gray(`\n💡 Use ${chalk.cyan('bkrptr open ' + id)} to open in your markdown viewer\n`));

  } catch (error: any) {
    logger.error('View command failed', error);
    console.error(chalk.red('\n❌ Error:'), error.message);
    process.exit(1);
  }
}
