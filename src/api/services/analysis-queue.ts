// src/api/services/analysis-queue.ts
// Concurrency-controlled queue for book analysis processing

export interface QueueItem {
  id: string;
  priority: 'expedited' | 'batch';
  retryCount: number;
  execute: () => Promise<void>;
}

export class AnalysisQueue {
  private queue: QueueItem[] = [];
  private processing: Set<string> = new Set();
  private maxConcurrent: number;
  private processingInterval: NodeJS.Timeout | null = null;
  private rateLimitBackoff: number = 0;
  private readonly MAX_RETRIES = 3;
  private readonly RATE_LIMIT_COOLDOWN_MS = 60000; // 1 minute

  constructor(maxConcurrent: number = 3) {
    this.maxConcurrent = maxConcurrent;
    this.startProcessing();
  }

  /**
   * Add an analysis to the queue
   */
  enqueue(item: QueueItem): void {
    // Check if already in queue or processing
    if (this.isQueued(item.id) || this.processing.has(item.id)) {
      console.log(`Analysis ${item.id} already queued or processing, skipping`);
      return;
    }

    // Expedited analyses go to front, batch to back
    if (item.priority === 'expedited') {
      this.queue.unshift(item);
    } else {
      this.queue.push(item);
    }

    console.log(`📝 Queued ${item.id} (${item.priority}). Queue size: ${this.queue.length}, Processing: ${this.processing.size}`);
  }

  /**
   * Check if an item is in the queue
   */
  private isQueued(id: string): boolean {
    return this.queue.some(item => item.id === id);
  }

  /**
   * Start the queue processor
   */
  private startProcessing(): void {
    this.processingInterval = setInterval(() => {
      this.processNext();
    }, 1000); // Check every second
  }

  /**
   * Process the next item in the queue
   */
  private async processNext(): Promise<void> {
    // Check rate limit backoff
    if (this.rateLimitBackoff > Date.now()) {
      const waitTime = Math.ceil((this.rateLimitBackoff - Date.now()) / 1000);
      console.log(`⏳ Rate limit cooldown: ${waitTime}s remaining`);
      return;
    }

    // Check if we have capacity and items in queue
    if (this.processing.size >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();
    if (!item) return;

    this.processing.add(item.id);
    console.log(`🚀 Starting ${item.id}. Processing: ${this.processing.size}/${this.maxConcurrent}`);

    try {
      await item.execute();
      console.log(`✅ Completed ${item.id}`);
    } catch (error) {
      await this.handleError(error, item);
    } finally {
      this.processing.delete(item.id);
    }
  }

  /**
   * Handle errors with exponential backoff for rate limits
   */
  private async handleError(error: any, item: QueueItem): Promise<void> {
    const errorMessage = error?.message || String(error);

    // Check for rate limit error
    if (errorMessage.includes('rate_limit_error') || errorMessage.includes('429')) {
      console.error(`⚠️ Rate limit hit for ${item.id}. Activating cooldown...`);

      // Set cooldown period
      this.rateLimitBackoff = Date.now() + this.RATE_LIMIT_COOLDOWN_MS;

      // Requeue with higher retry count
      if (item.retryCount < this.MAX_RETRIES) {
        item.retryCount++;
        this.queue.unshift(item); // Add to front for retry
        console.log(`🔄 Requeued ${item.id} (retry ${item.retryCount}/${this.MAX_RETRIES})`);
      } else {
        console.error(`❌ ${item.id} exceeded max retries`);
      }
    }
    // Check for credit balance error
    else if (errorMessage.includes('credit balance')) {
      console.error(`💳 Credit balance too low! Pausing queue processing.`);
      this.pause();
    }
    // Check for API overload
    else if (errorMessage.includes('Overloaded') || errorMessage.includes('500')) {
      console.error(`⚠️ API overloaded for ${item.id}. Waiting 30s...`);

      // Short cooldown for overload errors
      this.rateLimitBackoff = Date.now() + 30000; // 30 seconds

      // Requeue if under retry limit
      if (item.retryCount < this.MAX_RETRIES) {
        item.retryCount++;
        this.queue.push(item); // Add to back of queue
        console.log(`🔄 Requeued ${item.id} (retry ${item.retryCount}/${this.MAX_RETRIES})`);
      } else {
        console.error(`❌ ${item.id} exceeded max retries`);
      }
    }
    // Other errors - don't retry
    else {
      console.error(`❌ ${item.id} failed:`, errorMessage);
    }
  }

  /**
   * Pause queue processing (for critical errors like no credits)
   */
  pause(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
      console.log('⏸️  Queue processing paused');
    }
  }

  /**
   * Resume queue processing
   */
  resume(): void {
    if (!this.processingInterval) {
      this.startProcessing();
      console.log('▶️  Queue processing resumed');
    }
  }

  /**
   * Get queue status
   */
  getStatus(): { queueSize: number; processing: number; maxConcurrent: number } {
    return {
      queueSize: this.queue.length,
      processing: this.processing.size,
      maxConcurrent: this.maxConcurrent,
    };
  }

  /**
   * Update max concurrent limit
   */
  setMaxConcurrent(max: number): void {
    this.maxConcurrent = max;
    console.log(`🔧 Max concurrent analyses set to ${max}`);
  }

  /**
   * Cleanup on shutdown
   */
  shutdown(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
    console.log('🛑 Queue shutdown');
  }
}
