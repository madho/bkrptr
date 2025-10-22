#!/bin/bash

# Backup completed analyses documents before deployment wipes them
API_URL="https://api.bkrptr.com"
API_KEY="bkrptr_live_P4oqLbCWGwckyotMeXBAHI4H8TWKsO7J"
BACKUP_DIR="./backups/completed-analyses-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"

echo "📦 Backing up completed analyses to $BACKUP_DIR"

# Get all completed analysis IDs
IDS=$(curl -s -H "Authorization: Bearer $API_KEY" "$API_URL/api/v1/analyses?status=completed&limit=100" | jq -r '.data[].id')

count=0
for id in $IDS; do
  count=$((count + 1))
  echo "[$count] Downloading documents for $id..."

  mkdir -p "$BACKUP_DIR/$id"

  # Download all 4 document types
  curl -s -H "Authorization: Bearer $API_KEY" "$API_URL/api/v1/analyses/$id/documents/madho-summary" > "$BACKUP_DIR/$id/MADHO_SUMMARY.md"
  curl -s -H "Authorization: Bearer $API_KEY" "$API_URL/api/v1/analyses/$id/documents/detailed" > "$BACKUP_DIR/$id/DETAILED_ANALYSIS.md"
  curl -s -H "Authorization: Bearer $API_KEY" "$API_URL/api/v1/analyses/$id/documents/summary" > "$BACKUP_DIR/$id/SUMMARY.md"
  curl -s -H "Authorization: Bearer $API_KEY" "$API_URL/api/v1/analyses/$id/documents/reference" > "$BACKUP_DIR/$id/QUICK_REFERENCE.md"

  echo "  ✅ Saved 4 documents for $id"
done

echo ""
echo "✨ Backup complete: $count analyses saved to $BACKUP_DIR"
