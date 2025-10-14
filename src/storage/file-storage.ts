// src/storage/file-storage.ts

import * as fs from 'fs/promises';
import * as path from 'path';
import { AnalysisOutput } from '../types';
import { Logger } from '../utils/logger';

export class FileStorage {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  async saveAnalysis(
    analysis: AnalysisOutput,
    baseDir: string
  ): Promise<{ detailed: string; summary: string; reference: string; metadata: string }> {
    const analysisDir = path.join(baseDir, analysis.metadata.id);

    // Create directory
    await fs.mkdir(analysisDir, { recursive: true });

    // Save each document
    const detailedPath = path.join(analysisDir, 'detailed-analysis.md');
    const summaryPath = path.join(analysisDir, 'executive-summary.md');
    const referencePath = path.join(analysisDir, 'quick-reference.md');
    const metadataPath = path.join(analysisDir, 'metadata.json');

    await Promise.all([
      fs.writeFile(detailedPath, analysis.documents.detailed, 'utf-8'),
      fs.writeFile(summaryPath, analysis.documents.summary, 'utf-8'),
      fs.writeFile(referencePath, analysis.documents.reference, 'utf-8'),
      fs.writeFile(
        metadataPath,
        JSON.stringify(analysis.metadata, null, 2),
        'utf-8'
      ),
    ]);

    this.logger.info('Analysis saved to disk', { directory: analysisDir });

    return {
      detailed: detailedPath,
      summary: summaryPath,
      reference: referencePath,
      metadata: metadataPath,
    };
  }

  async loadAnalysis(analysisId: string, baseDir: string = './analyses'): Promise<AnalysisOutput | null> {
    const analysisDir = path.join(baseDir, analysisId);

    try {
      const [detailed, summary, reference, metadataStr] = await Promise.all([
        fs.readFile(path.join(analysisDir, 'detailed-analysis.md'), 'utf-8'),
        fs.readFile(path.join(analysisDir, 'executive-summary.md'), 'utf-8'),
        fs.readFile(path.join(analysisDir, 'quick-reference.md'), 'utf-8'),
        fs.readFile(path.join(analysisDir, 'metadata.json'), 'utf-8'),
      ]);

      const metadata = JSON.parse(metadataStr);

      return {
        documents: { detailed, summary, reference },
        metadata,
        files: {
          detailed: path.join(analysisDir, 'detailed-analysis.md'),
          summary: path.join(analysisDir, 'executive-summary.md'),
          reference: path.join(analysisDir, 'quick-reference.md'),
          metadata: path.join(analysisDir, 'metadata.json'),
        },
      };
    } catch (error) {
      this.logger.error('Failed to load analysis', error);
      return null;
    }
  }

  async listAnalyses(baseDir: string = './analyses'): Promise<Array<{
    id: string;
    title: string;
    author: string;
    genre: string;
    generatedAt: string;
  }>> {
    try {
      const entries = await fs.readdir(baseDir, { withFileTypes: true });
      const analyses = [];

      for (const entry of entries) {
        if (entry.isDirectory()) {
          try {
            const metadataPath = path.join(baseDir, entry.name, 'metadata.json');
            const metadataStr = await fs.readFile(metadataPath, 'utf-8');
            const metadata = JSON.parse(metadataStr);

            analyses.push({
              id: metadata.id,
              title: metadata.input.bookTitle,
              author: metadata.input.author,
              genre: metadata.input.genre,
              generatedAt: metadata.generatedAt,
            });
          } catch (error) {
            // Skip invalid directories
            continue;
          }
        }
      }

      return analyses.sort((a, b) =>
        new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
      );
    } catch (error) {
      this.logger.error('Failed to list analyses', error);
      return [];
    }
  }
}
