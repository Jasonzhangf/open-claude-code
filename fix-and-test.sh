#!/bin/bash

# Claude Code Fix and Test Script
# This script provides a complete development workflow

echo "Starting Claude Code fix and test workflow..."

# Build the project
echo "Building project..."
./build.sh

if [ $? -ne 0 ]; then
  echo "Build failed. Aborting workflow."
  exit 1
fi

# Run tests
echo "Running tests..."
./test-runner.sh --list

# Run a sample test
echo "Running example test..."
./test-runner.sh test/functional/test-example.js

if [ $? -ne 0 ]; then
  echo "Tests failed. Aborting workflow."
  exit 1
fi

echo "Fix and test workflow completed successfully!"
