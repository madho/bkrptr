// src/utils/markdown-formatter.ts

import { marked } from 'marked';
import chalk from 'chalk';

export class MarkdownFormatter {
  static formatForTerminal(markdown: string): string {
    // Simple terminal formatting without full markdown parsing
    let formatted = markdown;

    // Headers
    formatted = formatted.replace(/^# (.+)$/gm, chalk.bold.blue('\n$1'));
    formatted = formatted.replace(/^## (.+)$/gm, chalk.bold.cyan('\n$1'));
    formatted = formatted.replace(/^### (.+)$/gm, chalk.bold.yellow('\n$1'));

    // Bold
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, chalk.bold('$1'));

    // Italic
    formatted = formatted.replace(/\*(.+?)\*/g, chalk.italic('$1'));

    // Code blocks
    formatted = formatted.replace(/`([^`]+)`/g, chalk.gray('$1'));

    // Lists
    formatted = formatted.replace(/^[\-\*] (.+)$/gm, chalk.green('  • ') + '$1');

    return formatted;
  }

  static stripMarkdown(markdown: string): string {
    return markdown
      .replace(/^#+\s+/gm, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  }

  static truncate(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  }
}
