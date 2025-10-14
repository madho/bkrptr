#!/usr/bin/env node

// src/cli/index.ts

import { Command } from 'commander';
import { analyzeCommand } from './commands/analyze';
import { interactiveCommand } from './commands/interactive';
import { listCommand } from './commands/list';
import { viewCommand } from './commands/view';
import { openCommand } from './commands/open';
import { configCommand } from './commands/config';
import chalk from 'chalk';

const program = new Command();

program
  .name('bkrptr')
  .description('📚 Universal Book Reporter - Transform any book into actionable analysis')
  .version('1.0.0');

program
  .command('analyze <title>')
  .description('Analyze a book and generate three markdown documents')
  .option('-a, --author <name>', 'Book author (required)', '')
  .option('-g, --genre <type>', 'Book genre (auto-detected if not provided)', '')
  .option('-p, --purpose <type>', 'Analysis purpose', 'study')
  .option('--audience <description>', 'Target audience', 'general readers')
  .option('-d, --depth <level>', 'Analysis depth: quick|standard|comprehensive', 'standard')
  .option('-c, --context <text>', 'Specific application context')
  .option('-i, --input <file>', 'Book content file path')
  .option('-o, --output-dir <dir>', 'Output directory', './analyses')
  .option('--focus <areas>', 'Comma-separated focus areas')
  .option('--stream', 'Stream output to terminal', false)
  .option('--no-save', 'Don\'t save to disk')
  .option('--open', 'Open analysis after generation', false)
  .option('-v, --verbose', 'Verbose logging', false)
  .action(analyzeCommand);

program
  .command('interactive')
  .alias('i')
  .description('Launch interactive analysis mode with guided prompts')
  .action(interactiveCommand);

program
  .command('list')
  .alias('ls')
  .description('List all saved analyses')
  .option('--genre <type>', 'Filter by genre')
  .option('--author <name>', 'Filter by author')
  .option('--limit <n>', 'Number of results', '20')
  .action(listCommand);

program
  .command('view <id>')
  .description('View an analysis in the terminal')
  .option('-d, --document <type>', 'Document type: detailed|summary|reference|all', 'all')
  .option('--raw', 'Show raw markdown without formatting', false)
  .action(viewCommand);

program
  .command('open <id>')
  .description('Open an analysis in your default markdown viewer')
  .option('-d, --document <type>', 'Document type: detailed|summary|reference', 'detailed')
  .action(openCommand);

program
  .command('config')
  .description('Manage bkrptr configuration')
  .option('--set-api-key <key>', 'Set Anthropic API key')
  .option('--set-output-dir <dir>', 'Set default output directory')
  .option('--show', 'Show current configuration')
  .option('--reset', 'Reset to default configuration')
  .action(configCommand);

// Error handling
program.exitOverride();

try {
  program.parse();
} catch (err: any) {
  if (err.code !== 'commander.help' && err.code !== 'commander.version') {
    console.error(chalk.red('\n❌ Error:'), err.message);
    process.exit(1);
  }
}
