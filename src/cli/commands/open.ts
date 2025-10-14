// src/cli/commands/open.ts

import { FileStorage } from '../../storage/file-storage';
import { Logger } from '../../utils/logger';
import { openInViewer } from '../../utils/file-opener';
import chalk from 'chalk';

interface OpenOptions {
  document: 'detailed' | 'summary' | 'reference';
}

export async function openCommand(id: string, options: OpenOptions) {
  const logger = new Logger();
  const storage = new FileStorage();

  try {
    const analysis = await storage.loadAnalysis(id, './analyses');

    if (!analysis) {
      console.error(chalk.red(`\n❌ Analysis not found: ${id}\n`));
      console.log(chalk.gray('💡 Use'), chalk.cyan('bkrptr list'), chalk.gray('to see available analyses\n'));
      process.exit(1);
    }

    let filePath: string;
    if (options.document === 'detailed') {
      filePath = analysis.files.detailed;
    } else if (options.document === 'summary') {
      filePath = analysis.files.summary;
    } else {
      filePath = analysis.files.reference;
    }

    console.log(chalk.blue(`\n📖 Opening ${options.document} analysis...\n`));
    await openInViewer(filePath);

    console.log(chalk.green('✓ Opened successfully\n'));

  } catch (error: any) {
    logger.error('Open command failed', error);
    console.error(chalk.red('\n❌ Error:'), error.message);
    console.log(chalk.yellow('\n⚠️  Could not open file automatically.'));
    console.log(chalk.gray('You can open it manually from the analyses directory.\n'));
    process.exit(1);
  }
}
