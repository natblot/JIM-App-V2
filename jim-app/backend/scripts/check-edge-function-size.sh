#!/bin/bash
# Vérifie que les Edge Functions Supabase ne dépassent pas 2 MB
# Usage: ./scripts/check-edge-function-size.sh

MAX_SIZE=$((2 * 1024 * 1024))  # 2 MB en bytes

if [ ! -d "backend/supabase/functions" ]; then
  echo "✓ Aucune Edge Function trouvée"
  exit 0
fi

FAILED=0
for dir in backend/supabase/functions/*/; do
  if [ -d "$dir" ]; then
    size=$(du -sb "$dir" 2>/dev/null | cut -f1)
    name=$(basename "$dir")
    if [ "$size" -gt "$MAX_SIZE" ]; then
      echo "❌ $name: ${size} bytes > 2MB limite"
      FAILED=1
    else
      echo "✓ $name: ${size} bytes"
    fi
  fi
done

if [ "$FAILED" -eq 1 ]; then
  echo ""
  echo "⚠️  Certaines Edge Functions dépassent la limite de 2MB"
  exit 1
fi
