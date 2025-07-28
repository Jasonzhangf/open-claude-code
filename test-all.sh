#!/bin/bash
#
# Open-Claude-Code Full Test Suite Runner
# This script runs all available tests in the project.

echo "🚀 Running the full test suite for Open-Claude-Code..."

# Find and run all test files in the test/ directory
find ./test -name "test-*.js" -print -exec node {} \;

if [ $? -ne 0 ]; then
  echo "
❌ Some tests failed." >&2
  exit 1
else
  echo "
✅ All tests passed successfully!"
fi
