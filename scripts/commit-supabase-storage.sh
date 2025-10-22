#!/bin/bash

git add src/api/services/storage-service.ts src/api/services/analysis-service.ts src/api/server.ts src/api/routes/analyses.ts package.json package-lock.json

git commit -m "Add Supabase Storage for persistent document storage

- Install @supabase/supabase-js client library
- Create StorageService for uploading/downloading analysis documents
- Modify AnalysisService to upload documents to Supabase after generation
- Update document retrieval routes with Supabase fallback to filesystem
- Configure Railway with SUPABASE_URL and SUPABASE_ANON_KEY

This ensures analysis documents persist across Railway deployments.
Documents are uploaded to Supabase Storage bucket on completion,
with graceful fallback to local filesystem for backwards compatibility.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push
