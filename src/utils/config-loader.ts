// src/utils/config-loader.ts

import { cosmiconfigSync } from 'cosmiconfig';
import * as fs from 'fs';
import * as path from 'path';
import { BkrptrConfig } from '../types';

const DEFAULT_CONFIG: BkrptrConfig = {
  defaultOutputDir: './analyses',
  defaultDepth: 'standard',
  autoOpen: false,
  streamOutput: true,
};

export class ConfigLoader {
  private configPath: string;
  private explorer: ReturnType<typeof cosmiconfigSync>;

  constructor() {
    this.configPath = path.join(process.cwd(), '.bkrptr', 'config.json');
    this.explorer = cosmiconfigSync('bkrptr');
  }

  load(): BkrptrConfig {
    // Try to load from .bkrptr/config.json first
    if (fs.existsSync(this.configPath)) {
      try {
        const content = fs.readFileSync(this.configPath, 'utf-8');
        const config = JSON.parse(content);
        return { ...DEFAULT_CONFIG, ...config };
      } catch (error) {
        console.warn('Failed to load config from .bkrptr/config.json');
      }
    }

    // Try cosmiconfig search
    const result = this.explorer.search();
    if (result?.config) {
      return { ...DEFAULT_CONFIG, ...result.config };
    }

    // Return defaults
    return DEFAULT_CONFIG;
  }

  save(config: Partial<BkrptrConfig>): void {
    const current = this.load();
    const updated = { ...current, ...config };

    // Ensure .bkrptr directory exists
    const dir = path.dirname(this.configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      this.configPath,
      JSON.stringify(updated, null, 2),
      'utf-8'
    );
  }

  get(key: keyof BkrptrConfig): any {
    const config = this.load();
    return config[key];
  }

  set(key: keyof BkrptrConfig, value: any): void {
    this.save({ [key]: value });
  }

  reset(): void {
    if (fs.existsSync(this.configPath)) {
      fs.unlinkSync(this.configPath);
    }
  }

  getApiKey(): string | undefined {
    const config = this.load();
    return config.apiKey || process.env.ANTHROPIC_API_KEY;
  }
}
