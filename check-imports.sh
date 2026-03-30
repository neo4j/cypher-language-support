#!/bin/bash
failed=0
for file in "$@"; do
  violations=$(grep -n "from '\\./\|from '\\.\./" "$file" | grep -v "\.js'" | grep -v "\.json'" | grep -v "\.mjs'")
  if [ -n "$violations" ]; then
    echo "❌ $file contains relative imports without file extensions:"
    echo "$violations" | while IFS= read -r line; do
      echo "   Line $line"
      echo "   Fix: Add extension (ex. '.js') to the import"
    done
    failed=1
  fi
done

if [ "$failed" -eq 0 ]; then
  echo 'All relative imports have file extensions.'
else
  exit 1
fi
