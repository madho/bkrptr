// src/core/book-parser.ts

import * as pdfParse from 'pdf-parse';
import EPub from 'epub';
import * as fs from 'fs/promises';
import { Logger } from '../utils/logger';

export interface ParsedBook {
  content: string;
  metadata?: {
    title?: string;
    author?: string;
    pages?: number;
    wordCount?: number;
  };
}

export class BookParser {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  async parseFile(filePath: string): Promise<ParsedBook> {
    const extension = filePath.toLowerCase().split('.').pop();

    switch (extension) {
      case 'pdf':
        return await this.parsePDF(filePath);
      case 'epub':
        return await this.parseEPUB(filePath);
      case 'txt':
      case 'md':
        return await this.parseText(filePath);
      default:
        throw new Error(`Unsupported file format: ${extension}`);
    }
  }

  private async parsePDF(filePath: string): Promise<ParsedBook> {
    this.logger.info('Parsing PDF', { filePath });

    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await (pdfParse as any).default(dataBuffer);

      const wordCount = data.text.split(/\s+/).length;

      return {
        content: data.text,
        metadata: {
          title: data.info?.Title,
          author: data.info?.Author,
          pages: data.numpages,
          wordCount
        }
      };
    } catch (error: any) {
      this.logger.error('PDF parsing failed', error);
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }

  private async parseEPUB(filePath: string): Promise<ParsedBook> {
    this.logger.info('Parsing EPUB', { filePath });

    return new Promise((resolve, reject) => {
      const epub = new EPub(filePath);

      epub.on('end', async () => {
        try {
          const chapters: string[] = [];

          for (const chapter of epub.flow) {
            const content = await new Promise<string>((res, rej) => {
              epub.getChapter(chapter.id, (error, text) => {
                if (error) rej(error);
                else res(text);
              });
            });

            // Strip HTML tags (basic)
            const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            chapters.push(plainText);
          }

          const fullContent = chapters.join('\n\n');
          const wordCount = fullContent.split(/\s+/).length;

          resolve({
            content: fullContent,
            metadata: {
              title: epub.metadata.title,
              author: epub.metadata.creator,
              wordCount
            }
          });
        } catch (error: any) {
          reject(new Error(`Failed to read EPUB chapters: ${error.message}`));
        }
      });

      epub.on('error', (error) => {
        reject(new Error(`EPUB parsing error: ${error.message}`));
      });

      epub.parse();
    });
  }

  private async parseText(filePath: string): Promise<ParsedBook> {
    this.logger.info('Parsing text file', { filePath });

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const wordCount = content.split(/\s+/).length;

      return {
        content,
        metadata: {
          wordCount
        }
      };
    } catch (error: any) {
      this.logger.error('Text file parsing failed', error);
      throw new Error(`Failed to parse text file: ${error.message}`);
    }
  }

  /**
   * For very long books, chunk the content into manageable pieces
   * This helps with token limits when analyzing
   */
  chunkContent(content: string, maxChunkSize: number = 50000): string[] {
    const words = content.split(/\s+/);
    const chunks: string[] = [];
    let currentChunk: string[] = [];
    let currentSize = 0;

    for (const word of words) {
      currentChunk.push(word);
      currentSize += word.length + 1; // +1 for space

      if (currentSize >= maxChunkSize) {
        chunks.push(currentChunk.join(' '));
        currentChunk = [];
        currentSize = 0;
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
    }

    return chunks;
  }

  /**
   * Create a condensed version of the book for analysis
   * when the full content exceeds token limits
   */
  async condenseForAnalysis(content: string, maxWords: number = 30000): Promise<string> {
    const words = content.split(/\s+/);

    if (words.length <= maxWords) {
      return content;
    }

    // Simple approach: take beginning, middle, and end sections
    const sectionSize = Math.floor(maxWords / 3);

    const beginning = words.slice(0, sectionSize).join(' ');
    const middleStart = Math.floor((words.length - sectionSize) / 2);
    const middle = words.slice(middleStart, middleStart + sectionSize).join(' ');
    const end = words.slice(-sectionSize).join(' ');

    return `${beginning}\n\n[... middle sections omitted ...]\n\n${middle}\n\n[... later sections omitted ...]\n\n${end}`;
  }
}
