// src/cli/commands/interactive.ts

import inquirer from 'inquirer';
import { BookAnalyzer } from '../../core/analyzer';
import { AnalysisInput } from '../../types';
import { Logger } from '../../utils/logger';
import { openInViewer } from '../../utils/file-opener';
import chalk from 'chalk';

export async function interactiveCommand() {
  const logger = new Logger();

  console.log(chalk.bold.blue('\n📚 bkrptr - Universal Book Reporter\n'));
  console.log(chalk.gray('Transform any book into actionable analysis documents\n'));

  try {
    // Basic book info
    const bookInfo = await inquirer.prompt([
      {
        type: 'input',
        name: 'bookTitle',
        message: 'Book title:',
        validate: (input) => input.trim().length > 0 || 'Title is required'
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author name:',
        validate: (input) => input.trim().length > 0 || 'Author is required'
      },
    ]);

    // Genre and analysis settings
    const analysisSettings = await inquirer.prompt([
      {
        type: 'list',
        name: 'genre',
        message: 'Select book genre:',
        choices: [
          { name: '💻 Technical (Programming, Engineering)', value: 'technical' },
          { name: '🧠 Philosophy (Ethics, Logic, Thought)', value: 'philosophy' },
          { name: '📖 Fiction (Novels, Stories)', value: 'fiction' },
          { name: '🎓 Academic (Research, Textbooks)', value: 'academic' },
          { name: '💼 Business (Strategy, Management)', value: 'business' },
          { name: '🌱 Self-Help (Personal Development)', value: 'self-help' },
          { name: '📜 History (Historical Analysis)', value: 'history' },
          { name: '🔬 Science (Scientific Texts)', value: 'science' },
          { name: '📐 Mathematics (Math Theory, Proofs)', value: 'mathematics' },
          { name: '👥 Leadership (Management, Teams)', value: 'leadership' },
          { name: '🧬 Psychology (Behavioral Science)', value: 'psychology' },
          { name: '📝 Biography/Memoir', value: 'biography' },
        ],
      },
      {
        type: 'list',
        name: 'purpose',
        message: 'Primary purpose:',
        choices: [
          { name: '📋 Reference - Quick lookup guide', value: 'reference' },
          { name: '📚 Study - Deep learning', value: 'study' },
          { name: '👨‍🏫 Teaching - Prepare to teach', value: 'teaching' },
          { name: '🛠️  Implementation - Apply in practice', value: 'implementation' },
          { name: '🔬 Research - Academic/professional', value: 'research' },
          { name: '💡 Professional Development', value: 'professional-development' },
          { name: '🎭 Enjoyment - Deeper appreciation', value: 'enjoyment' },
        ],
        default: 'study',
      },
      {
        type: 'list',
        name: 'analysisDepth',
        message: 'Analysis depth:',
        choices: [
          { name: '⚡ Quick - Key insights (fastest)', value: 'quick' },
          { name: '📊 Standard - Balanced detail', value: 'standard' },
          { name: '🔍 Comprehensive - Exhaustive (slowest)', value: 'comprehensive' },
        ],
        default: 'standard',
      },
      {
        type: 'input',
        name: 'audience',
        message: 'Target audience:',
        default: 'general readers',
      },
      {
        type: 'input',
        name: 'context',
        message: 'Specific context or focus (optional):',
      },
      {
        type: 'confirm',
        name: 'stream',
        message: 'Stream output to terminal?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'openAfter',
        message: 'Open analysis in viewer after completion?',
        default: false,
      },
    ]);

    console.log(chalk.blue('\n🚀 Starting analysis...\n'));

    const analyzer = new BookAnalyzer();

    const input: AnalysisInput = {
      bookTitle: bookInfo.bookTitle,
      author: bookInfo.author,
      genre: analysisSettings.genre,
      purpose: analysisSettings.purpose,
      audience: analysisSettings.audience,
      analysisDepth: analysisSettings.analysisDepth,
      specificContext: analysisSettings.context || undefined,
    };

    const result = await analyzer.analyze(input, {
      stream: analysisSettings.stream,
      save: true,
      outputDir: './analyses',
    });

    console.log(chalk.green.bold('\n✅ Analysis complete!\n'));
    console.log(chalk.bold('📁 Files saved:'));
    console.log(chalk.gray(`   ${result.files.detailed}`));
    console.log(chalk.gray(`   ${result.files.summary}`));
    console.log(chalk.gray(`   ${result.files.reference}`));

    if (analysisSettings.openAfter) {
      console.log(chalk.blue('\n📖 Opening analysis...\n'));
      await openInViewer(result.files.detailed);
    }

    console.log(chalk.gray(`\n💡 Tip: Use ${chalk.cyan(`bkrptr view ${result.metadata.id}`)} to view in terminal`));

  } catch (error: any) {
    logger.error('Interactive command failed', error);
    console.error(chalk.red('\n❌ Error:'), error.message);
    process.exit(1);
  }
}
