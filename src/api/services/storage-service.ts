// src/api/services/storage-service.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class StorageService {
  private supabase: SupabaseClient;
  private bucketName = 'analysis-documents';

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY/SUPABASE_ANON_KEY are required');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);

    // Initialize bucket on startup
    this.initializeBucket().catch(error => {
      console.error('Failed to initialize storage bucket:', error);
    });
  }

  private async initializeBucket(): Promise<void> {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await this.supabase.storage.listBuckets();

      if (listError) {
        console.error('Error listing buckets:', listError);
        return;
      }

      const bucketExists = buckets?.some(b => b.name === this.bucketName);

      if (!bucketExists) {
        // Create bucket with public access for easy document retrieval
        const { error: createError } = await this.supabase.storage.createBucket(this.bucketName, {
          public: true,
          fileSizeLimit: 10485760, // 10MB limit per file
        });

        if (createError) {
          console.error('Error creating bucket:', createError);
        } else {
          console.log(`✅ Created storage bucket: ${this.bucketName}`);
        }
      } else {
        console.log(`✅ Storage bucket ready: ${this.bucketName}`);
      }
    } catch (error) {
      console.error('Error initializing bucket:', error);
    }
  }

  /**
   * Upload a document to Supabase Storage
   * @param analysisId - The analysis ID
   * @param fileName - The file name (e.g., 'MADHO_SUMMARY.md')
   * @param content - The markdown content
   * @returns The public URL of the uploaded file
   */
  async uploadDocument(analysisId: string, fileName: string, content: string): Promise<string> {
    const filePath = `${analysisId}/${fileName}`;

    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filePath, content, {
        contentType: 'text/markdown',
        upsert: true, // Overwrite if exists
      });

    if (error) {
      throw new Error(`Failed to upload ${fileName}: ${error.message}`);
    }

    // Get public URL
    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Upload all analysis documents
   * @param analysisId - The analysis ID
   * @param documents - Object containing all document contents
   * @returns Object with URLs for each document
   */
  async uploadAllDocuments(
    analysisId: string,
    documents: {
      madhoSummary: string;
      detailed: string;
      summary: string;
      reference: string;
    }
  ): Promise<{
    madhoSummaryUrl: string;
    detailedUrl: string;
    summaryUrl: string;
    referenceUrl: string;
  }> {
    const [madhoSummaryUrl, detailedUrl, summaryUrl, referenceUrl] = await Promise.all([
      this.uploadDocument(analysisId, 'MADHO_SUMMARY.md', documents.madhoSummary),
      this.uploadDocument(analysisId, 'DETAILED_ANALYSIS.md', documents.detailed),
      this.uploadDocument(analysisId, 'SUMMARY.md', documents.summary),
      this.uploadDocument(analysisId, 'QUICK_REFERENCE.md', documents.reference),
    ]);

    return {
      madhoSummaryUrl,
      detailedUrl,
      summaryUrl,
      referenceUrl,
    };
  }

  /**
   * Download a document from Supabase Storage
   * @param analysisId - The analysis ID
   * @param fileName - The file name (e.g., 'MADHO_SUMMARY.md')
   * @returns The document content as string
   */
  async downloadDocument(analysisId: string, fileName: string): Promise<string> {
    const filePath = `${analysisId}/${fileName}`;

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .download(filePath);

    if (error) {
      throw new Error(`Failed to download ${fileName}: ${error.message}`);
    }

    if (!data) {
      throw new Error(`No data returned for ${fileName}`);
    }

    // Convert Blob to string
    const text = await data.text();
    return text;
  }

  /**
   * Download all analysis documents
   * @param analysisId - The analysis ID
   * @returns Object containing all document contents
   */
  async downloadAllDocuments(analysisId: string): Promise<{
    madhoSummary: string;
    detailed: string;
    summary: string;
    reference: string;
  }> {
    const [madhoSummary, detailed, summary, reference] = await Promise.all([
      this.downloadDocument(analysisId, 'MADHO_SUMMARY.md'),
      this.downloadDocument(analysisId, 'DETAILED_ANALYSIS.md'),
      this.downloadDocument(analysisId, 'SUMMARY.md'),
      this.downloadDocument(analysisId, 'QUICK_REFERENCE.md'),
    ]);

    return {
      madhoSummary,
      detailed,
      summary,
      reference,
    };
  }

  /**
   * Get public URL for a document
   * @param analysisId - The analysis ID
   * @param fileName - The file name
   * @returns The public URL
   */
  getPublicUrl(analysisId: string, fileName: string): string {
    const filePath = `${analysisId}/${fileName}`;
    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Delete all documents for an analysis
   * @param analysisId - The analysis ID
   */
  async deleteDocuments(analysisId: string): Promise<void> {
    const files = [
      'MADHO_SUMMARY.md',
      'DETAILED_ANALYSIS.md',
      'SUMMARY.md',
      'QUICK_REFERENCE.md',
    ];

    const filePaths = files.map(f => `${analysisId}/${f}`);

    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .remove(filePaths);

    if (error) {
      throw new Error(`Failed to delete documents: ${error.message}`);
    }
  }
}
