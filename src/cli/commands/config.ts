// src/cli/commands/config.ts

import { ConfigLoader } from '../../utils/config-loader';
import { Logger } from '../../utils/logger';
import chalk from 'chalk';

interface ConfigOptions {
  setApiKey?: string;
  setOutputDir?: string;
  show?: boolean;
  reset?: boolean;
}

export async function configCommand(options: ConfigOptions) {
  const logger = new Logger();
  const configLoader = new ConfigLoader();

  try {
    if (options.setApiKey) {
      configLoader.set('apiKey', options.setApiKey);
      console.log(chalk.green('\n✓ API key saved successfully\n'));
      console.log(chalk.gray('The API key is stored in .bkrptr/config.json\n'));
      return;
    }

    if (options.setOutputDir) {
      configLoader.set('defaultOutputDir', options.setOutputDir);
      console.log(chalk.green(`\n✓ Default output directory set to: ${options.setOutputDir}\n`));
      return;
    }

    if (options.reset) {
      configLoader.reset();
      console.log(chalk.green('\n✓ Configuration reset to defaults\n'));
      return;
    }

    if (options.show) {
      const config = configLoader.load();

      console.log(chalk.bold.blue('\n⚙️  bkrptr Configuration\n'));

      console.log(chalk.gray('API Key:'), config.apiKey ? chalk.green('✓ Set') : chalk.yellow('Not set'));
      console.log(chalk.gray('Default Output Dir:'), chalk.white(config.defaultOutputDir));
      console.log(chalk.gray('Default Depth:'), chalk.white(config.defaultDepth));
      console.log(chalk.gray('Default Genre:'), config.defaultGenre ? chalk.white(config.defaultGenre) : chalk.gray('None'));
      console.log(chalk.gray('Default Audience:'), config.defaultAudience ? chalk.white(config.defaultAudience) : chalk.gray('None'));
      console.log(chalk.gray('Auto Open:'), config.autoOpen ? chalk.green('Yes') : chalk.gray('No'));
      console.log(chalk.gray('Stream Output:'), config.streamOutput ? chalk.green('Yes') : chalk.gray('No'));

      console.log(chalk.gray('\n💡 Configuration file: .bkrptr/config.json'));
      console.log(chalk.gray('💡 Environment variable: ANTHROPIC_API_KEY\n'));

      return;
    }

    // If no options provided, show help
    console.log(chalk.bold.blue('\n⚙️  bkrptr Configuration\n'));
    console.log(chalk.white('Available options:'));
    console.log(chalk.gray('  --set-api-key <key>    Set Anthropic API key'));
    console.log(chalk.gray('  --set-output-dir <dir> Set default output directory'));
    console.log(chalk.gray('  --show                 Show current configuration'));
    console.log(chalk.gray('  --reset                Reset to default configuration'));
    console.log(chalk.gray('\nExample:'));
    console.log(chalk.cyan('  bkrptr config --set-api-key sk-ant-...\n'));

  } catch (error: any) {
    logger.error('Config command failed', error);
    console.error(chalk.red('\n❌ Error:'), error.message);
    process.exit(1);
  }
}
