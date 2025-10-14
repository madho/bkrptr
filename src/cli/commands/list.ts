// src/cli/commands/list.ts

import { FileStorage } from '../../storage/file-storage';
import { Logger } from '../../utils/logger';
import chalk from 'chalk';

interface ListOptions {
  genre?: string;
  author?: string;
  limit: string;
}

export async function listCommand(options: ListOptions) {
  const logger = new Logger();
  const storage = new FileStorage();

  try {
    console.log(chalk.bold.blue('\n📚 Saved Analyses\n'));

    let analyses = await storage.listAnalyses('./analyses');

    // Apply filters
    if (options.genre) {
      analyses = analyses.filter(a =>
        a.genre.toLowerCase() === options.genre!.toLowerCase()
      );
    }

    if (options.author) {
      analyses = analyses.filter(a =>
        a.author.toLowerCase().includes(options.author!.toLowerCase())
      );
    }

    // Apply limit
    const limit = parseInt(options.limit);
    analyses = analyses.slice(0, limit);

    if (analyses.length === 0) {
      console.log(chalk.yellow('No analyses found.'));
      console.log(chalk.gray('\n💡 Tip: Use'), chalk.cyan('bkrptr interactive'), chalk.gray('to create your first analysis\n'));
      return;
    }

    // Display table
    console.log(chalk.gray(`Found ${analyses.length} analysis${analyses.length > 1 ? 'es' : ''}:\n`));

    for (const analysis of analyses) {
      const date = new Date(analysis.generatedAt).toLocaleDateString();

      console.log(chalk.bold(analysis.title));
      console.log(chalk.gray(`  Author: ${analysis.author}`));
      console.log(chalk.gray(`  Genre: ${analysis.genre}`));
      console.log(chalk.gray(`  Date: ${date}`));
      console.log(chalk.cyan(`  ID: ${analysis.id}`));
      console.log('');
    }

    console.log(chalk.gray(`\n💡 Use ${chalk.cyan('bkrptr view <id>')} to view an analysis`));
    console.log(chalk.gray(`💡 Use ${chalk.cyan('bkrptr open <id>')} to open in your markdown viewer\n`));

  } catch (error: any) {
    logger.error('List command failed', error);
    console.error(chalk.red('\n❌ Error:'), error.message);
    process.exit(1);
  }
}
