// api/index.ts - Vercel Serverless Function Entry Point
import { createServer } from '../src/api/server';

// Create Express app instance
const app = createServer();

// Export for Vercel serverless
export default app;
