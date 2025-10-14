// src/types/index.ts

export interface AnalysisInput {
  // Core book info
  bookTitle: string;
  author: string;
  publicationYear?: string;

  // Genre and purpose
  genre: BookGenre;
  purpose: AnalysisPurpose;

  // Target audience
  audience: string;

  // Optional content
  bookContent?: string;

  // Analysis customization
  analysisDepth: 'quick' | 'standard' | 'comprehensive';
  focusAreas?: string[];

  // Application context
  specificContext?: string;
}

export type BookGenre =
  | 'technical'
  | 'philosophy'
  | 'fiction'
  | 'academic'
  | 'business'
  | 'self-help'
  | 'history'
  | 'science'
  | 'mathematics'
  | 'leadership'
  | 'psychology'
  | 'biography'
  | 'creative-writing';

export type AnalysisPurpose =
  | 'reference'
  | 'study'
  | 'teaching'
  | 'implementation'
  | 'research'
  | 'enjoyment'
  | 'professional-development';

export interface AnalysisOutput {
  // Four main documents (MADHO summary is primary)
  documents: {
    madhoSummary: string;  // Primary: punchy, actionable, voice-driven (REQUIRED)
    detailed: string;      // Chapter-by-chapter or concept-by-concept
    summary: string;       // Executive/conceptual summary
    reference: string;     // Quick reference guide/checklist
  };

  // Metadata
  metadata: {
    id: string;
    generatedAt: string;
    input: AnalysisInput;
    tokensUsed?: number;
    generationTime?: number;
  };

  // File paths
  files: {
    madhoSummary: string;  // Primary output file
    detailed: string;
    summary: string;
    reference: string;
    metadata: string;
  };
}

export interface BkrptrConfig {
  apiKey?: string;
  defaultOutputDir: string;
  defaultGenre?: BookGenre;
  defaultDepth: 'quick' | 'standard' | 'comprehensive';
  defaultAudience?: string;
  autoOpen: boolean;
  streamOutput: boolean;
}

export interface BatchConfig {
  books: Array<Omit<AnalysisInput, 'analysisDepth'> & {
    analysisDepth?: 'quick' | 'standard' | 'comprehensive';
  }>;
  defaults?: {
    outputDir?: string;
    analysisDepth?: 'quick' | 'standard' | 'comprehensive';
    parallel?: boolean;
  };
}

export interface GenreDetection {
  genre: BookGenre;
  confidence: number;
  reasoning: string;
}
