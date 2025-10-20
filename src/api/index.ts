// src/api/index.ts
import { createServer } from './server';
import * as fs from 'fs';
import * as path from 'path';

const PORT = parseInt(process.env.PORT || '3000', 10);

// Ensure data directories exist
const dataDir = path.join(process.cwd(), 'data');
const analysesDir = path.join(dataDir, 'analyses');

[dataDir, analysesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create and start server
const app = createServer();

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
┌─────────────────────────────────────────┐
│                                         │
│   bkrptr API Server                     │
│                                         │
│   Status: Running ✓                     │
│   Port: ${PORT}                          │
│   Host: 0.0.0.0                         │
│   Environment: ${process.env.NODE_ENV || 'development'}           │
│                                         │
│   Endpoints:                            │
│   - GET  /                              │
│   - GET  /api/v1/health                 │
│   - POST /api/v1/analyses               │
│   - GET  /api/v1/analyses               │
│   - GET  /api/v1/analyses/:id           │
│   - GET  /api/v1/analyses/:id/documents │
│                                         │
└─────────────────────────────────────────┘
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
