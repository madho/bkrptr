// src/utils/validator.ts

import { AnalysisInput, BookGenre, AnalysisPurpose } from '../types';

export class Validator {
  static validateAnalysisInput(input: Partial<AnalysisInput>): string[] {
    const errors: string[] = [];

    if (!input.bookTitle?.trim()) {
      errors.push('Book title is required');
    }

    if (!input.author?.trim()) {
      errors.push('Author name is required');
    }

    if (input.genre && !this.isValidGenre(input.genre)) {
      errors.push(`Invalid genre: ${input.genre}`);
    }

    if (input.purpose && !this.isValidPurpose(input.purpose)) {
      errors.push(`Invalid purpose: ${input.purpose}`);
    }

    if (input.analysisDepth && !['quick', 'standard', 'comprehensive'].includes(input.analysisDepth)) {
      errors.push(`Invalid analysis depth: ${input.analysisDepth}`);
    }

    return errors;
  }

  static isValidGenre(genre: string): genre is BookGenre {
    const validGenres: BookGenre[] = [
      'technical',
      'philosophy',
      'fiction',
      'academic',
      'business',
      'self-help',
      'history',
      'science',
      'mathematics',
      'leadership',
      'psychology',
      'biography',
      'creative-writing',
    ];
    return validGenres.includes(genre as BookGenre);
  }

  static isValidPurpose(purpose: string): purpose is AnalysisPurpose {
    const validPurposes: AnalysisPurpose[] = [
      'reference',
      'study',
      'teaching',
      'implementation',
      'research',
      'enjoyment',
      'professional-development',
    ];
    return validPurposes.includes(purpose as AnalysisPurpose);
  }

  static sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 100);
  }
}
