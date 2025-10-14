// src/core/knowledge-graph.ts

import { AnalysisOutput } from '../types';
import { Logger } from '../utils/logger';
import { ClaudeClient } from './claude-client';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface Concept {
  id: string;
  name: string;
  description: string;
  sourceBooks: string[]; // analysis IDs
  embedding?: number[];
}

export interface BookNode {
  id: string; // analysis ID
  title: string;
  author: string;
  concepts: string[]; // concept IDs
  relatedBooks: string[]; // other analysis IDs
}

export interface ConceptRelation {
  concept1: string;
  concept2: string;
  relationType: 'reinforces' | 'contradicts' | 'extends' | 'similar';
  strength: number; // 0-1
}

export class KnowledgeGraph {
  private logger: Logger;
  private claudeClient: ClaudeClient;
  private graphPath: string;

  private books: Map<string, BookNode> = new Map();
  private concepts: Map<string, Concept> = new Map();
  private relations: ConceptRelation[] = [];

  constructor(graphPath: string = './analyses/.knowledge-graph.json') {
    this.logger = new Logger();
    this.claudeClient = new ClaudeClient();
    this.graphPath = graphPath;
  }

  async loadGraph(): Promise<void> {
    try {
      const data = await fs.readFile(this.graphPath, 'utf-8');
      const graph = JSON.parse(data);

      this.books = new Map(Object.entries(graph.books || {}));
      this.concepts = new Map(Object.entries(graph.concepts || {}));
      this.relations = graph.relations || [];

      this.logger.info('Knowledge graph loaded', {
        books: this.books.size,
        concepts: this.concepts.size,
        relations: this.relations.length
      });
    } catch (error) {
      // Graph doesn't exist yet, start fresh
      this.logger.info('Starting new knowledge graph');
    }
  }

  async saveGraph(): Promise<void> {
    const graph = {
      books: Object.fromEntries(this.books),
      concepts: Object.fromEntries(this.concepts),
      relations: this.relations,
      lastUpdated: new Date().toISOString()
    };

    await fs.writeFile(this.graphPath, JSON.stringify(graph, null, 2));
    this.logger.info('Knowledge graph saved');
  }

  /**
   * Add a new book analysis to the knowledge graph
   * Extracts concepts and builds relationships
   */
  async addAnalysis(analysis: AnalysisOutput): Promise<void> {
    this.logger.info('Adding analysis to knowledge graph', { id: analysis.metadata.id });

    // Extract concepts from the analysis
    const concepts = await this.extractConcepts(analysis);

    // Create book node
    const bookNode: BookNode = {
      id: analysis.metadata.id,
      title: analysis.metadata.input.bookTitle,
      author: analysis.metadata.input.author,
      concepts: concepts.map(c => c.id),
      relatedBooks: []
    };

    // Add concepts to graph
    for (const concept of concepts) {
      if (this.concepts.has(concept.id)) {
        // Concept exists, add this book as a source
        const existing = this.concepts.get(concept.id)!;
        existing.sourceBooks.push(analysis.metadata.id);
      } else {
        // New concept
        this.concepts.set(concept.id, concept);
      }
    }

    // Find related books based on shared concepts
    for (const [bookId, book] of this.books) {
      const sharedConcepts = book.concepts.filter(c => bookNode.concepts.includes(c));
      if (sharedConcepts.length > 0) {
        bookNode.relatedBooks.push(bookId);
        book.relatedBooks.push(bookNode.id);
      }
    }

    this.books.set(bookNode.id, bookNode);

    // Build relationships between concepts
    await this.buildConceptRelations(concepts, analysis);

    await this.saveGraph();
  }

  /**
   * Extract key concepts from an analysis using Claude
   */
  private async extractConcepts(analysis: AnalysisOutput): Promise<Concept[]> {
    const prompt = `Extract the 5-10 most important concepts, frameworks, or ideas from this book analysis.

<book_analysis>
  <title>${analysis.metadata.input.bookTitle}</title>
  <author>${analysis.metadata.input.author}</author>
  <detailed_analysis>
${analysis.documents.detailed.substring(0, 10000)}
  </detailed_analysis>
</book_analysis>

For each concept, provide:
1. A unique ID (lowercase-with-dashes)
2. A clear name (2-5 words)
3. A precise description (1-2 sentences)

Respond with ONLY a JSON array in this format:
[
  {
    "id": "responsibility-ladder",
    "name": "Responsibility Ladder",
    "description": "A diagnostic tool showing the spectrum from under-responsibility (victim) to over-responsibility (hero), with partnership in the middle."
  }
]`;

    const result = await this.claudeClient.generate(prompt);
    const jsonMatch = result.content.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error('Failed to parse concept extraction response');
    }

    const extractedConcepts = JSON.parse(jsonMatch[0]);

    return extractedConcepts.map((c: any) => ({
      ...c,
      sourceBooks: [analysis.metadata.id]
    }));
  }

  /**
   * Build relationships between concepts
   */
  private async buildConceptRelations(concepts: Concept[], analysis: AnalysisOutput): Promise<void> {
    // For now, mark concepts from the same book as related
    for (let i = 0; i < concepts.length; i++) {
      for (let j = i + 1; j < concepts.length; j++) {
        this.relations.push({
          concept1: concepts[i].id,
          concept2: concepts[j].id,
          relationType: 'extends', // Could be refined with more analysis
          strength: 0.5
        });
      }
    }
  }

  /**
   * Find books related to a given analysis
   */
  getRelatedBooks(analysisId: string): BookNode[] {
    const book = this.books.get(analysisId);
    if (!book) return [];

    return book.relatedBooks
      .map(id => this.books.get(id))
      .filter(b => b !== undefined) as BookNode[];
  }

  /**
   * Search for concepts by name or description
   */
  searchConcepts(query: string): Concept[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.concepts.values()).filter(concept =>
      concept.name.toLowerCase().includes(lowerQuery) ||
      concept.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get all books that discuss a particular concept
   */
  getBooksForConcept(conceptId: string): BookNode[] {
    const concept = this.concepts.get(conceptId);
    if (!concept) return [];

    return concept.sourceBooks
      .map(id => this.books.get(id))
      .filter(b => b !== undefined) as BookNode[];
  }

  /**
   * Generate a summary of the knowledge graph
   */
  getSummary(): {
    totalBooks: number;
    totalConcepts: number;
    totalRelations: number;
    mostCommonConcepts: Array<{ name: string; bookCount: number }>;
  } {
    const conceptCounts = Array.from(this.concepts.values())
      .map(c => ({ name: c.name, bookCount: c.sourceBooks.length }))
      .sort((a, b) => b.bookCount - a.bookCount)
      .slice(0, 10);

    return {
      totalBooks: this.books.size,
      totalConcepts: this.concepts.size,
      totalRelations: this.relations.length,
      mostCommonConcepts: conceptCounts
    };
  }
}
