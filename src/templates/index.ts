// src/templates/index.ts

import { baseTemplate, GenreTemplate } from './base';
import { technicalTemplate } from './genres/technical';
import { leadershipTemplate } from './genres/leadership';
import { philosophyTemplate } from './genres/philosophy';
import { businessTemplate } from './genres/business';
import { BookGenre } from '../types';

const genreTemplates: Record<BookGenre, GenreTemplate> = {
  'technical': technicalTemplate,
  'leadership': leadershipTemplate,
  'philosophy': philosophyTemplate,
  'business': businessTemplate,
  // Use base template for genres without specific templates
  'fiction': baseTemplate,
  'academic': baseTemplate,
  'self-help': leadershipTemplate, // Similar to leadership
  'history': baseTemplate,
  'science': technicalTemplate, // Similar to technical
  'mathematics': technicalTemplate,
  'psychology': baseTemplate,
  'biography': baseTemplate,
  'creative-writing': baseTemplate,
};

export function getGenreTemplate(
  genre: BookGenre,
  documentType: 'madhoSummary' | 'detailed' | 'summary' | 'reference'
): string {
  const template = genreTemplates[genre] || baseTemplate;
  return template[documentType];
}

export function listAvailableGenres(): Array<{ genre: BookGenre; hasCustomTemplate: boolean }> {
  return Object.keys(genreTemplates).map(genre => ({
    genre: genre as BookGenre,
    hasCustomTemplate: genreTemplates[genre as BookGenre] !== baseTemplate,
  }));
}

export { GenreTemplate };
