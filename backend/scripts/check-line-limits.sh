#!/usr/bin/env bash
# Fails if any backend .cc/.h file exceeds 80 lines or 80 columns.
set -euo pipefail
cd "$(dirname "$0")/.."

status=0

while IFS= read -r -d '' file; do
    lines=$(wc -l < "$file")
    if [ "$lines" -gt 80 ]; then
        echo "$file: $lines lines (limit 80)"
        status=1
    fi

    long_line=$(awk '{ if (length($0) > 80) { print NR; exit } }' "$file")
    if [ -n "$long_line" ]; then
        echo "$file:$long_line: line exceeds 80 columns"
        status=1
    fi
done < <(find controllers engine repositories db tests \
    -type f \( -name "*.cc" -o -name "*.h" \) -print0)

exit $status
