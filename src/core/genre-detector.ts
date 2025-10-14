// src/core/genre-detector.ts

import { ClaudeClient } from './claude-client';
import { BookGenre, GenreDetection } from '../types';
import { Logger } from '../utils/logger';

export class GenreDetector {
  private claudeClient: ClaudeClient;
  private logger: Logger;

  constructor() {
    this.claudeClient = new ClaudeClient();
    this.logger = new Logger();
  }

  async detectGenre(bookTitle: string, author: string): Promise<GenreDetection> {
    this.logger.debug('Detecting genre', { bookTitle, author });

    const prompt = `You are a book classification expert. Given a book title and author, determine the most appropriate genre.

<book>
  <title>${bookTitle}</title>
  <author>${author}</author>
</book>

<available_genres>
- technical: Programming, engineering, system design, software development
- philosophy: Ethics, logic, metaphysics, epistemology, philosophical thought
- fiction: Novels, short stories, literary fiction, narrative works
- academic: Textbooks, scholarly research, academic studies
- business: Strategy, management, entrepreneurship, corporate leadership
- self-help: Personal development, productivity, self-improvement
- history: Historical analysis, historical events, historiography
- science: Scientific texts, popular science, scientific research
- mathematics: Mathematical theory, proofs, mathematical texts
- leadership: Team management, organizational leadership, military leadership
- psychology: Behavioral science, cognitive psychology, psychological research
- biography: Life stories, memoirs, autobiographies
- creative-writing: Writing craft, storytelling techniques
</available_genres>

Respond with a JSON object in this exact format:
{
  "genre": "one of the available genres above",
  "confidence": 0.95,
  "reasoning": "Brief explanation of why this genre fits"
}

Be decisive and choose the single best-fitting genre. Consider:
- The book's primary subject matter
- The author's background and known works
- Common classification of this book
- The book's intended audience and purpose

Respond with ONLY the JSON object, no other text.`;

    try {
      const response = await this.claudeClient.generate(prompt);

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse genre detection response');
      }

      const detection = JSON.parse(jsonMatch[0]) as GenreDetection;

      // Validate genre
      const validGenres: BookGenre[] = [
        'technical', 'philosophy', 'fiction', 'academic', 'business',
        'self-help', 'history', 'science', 'mathematics', 'leadership',
        'psychology', 'biography', 'creative-writing'
      ];

      if (!validGenres.includes(detection.genre)) {
        throw new Error(`Invalid genre detected: ${detection.genre}`);
      }

      this.logger.info('Genre detected', {
        bookTitle,
        author,
        genre: detection.genre,
        confidence: detection.confidence
      });

      return detection;

    } catch (error: any) {
      this.logger.error('Genre detection failed', error);

      // Fallback to a reasonable default
      return {
        genre: 'academic',
        confidence: 0.5,
        reasoning: 'Unable to detect genre automatically, defaulting to academic'
      };
    }
  }
}
