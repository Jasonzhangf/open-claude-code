#!/bin/bash
#
# Open-Claude-Code Development Start Script
# This script builds the project and starts the interactive CLI.

echo "🚀 Starting Open-Claude-Code in development mode..."

# Step 1: Build the project
echo "
Building project..."
./build.sh

if [ $? -ne 0 ]; then
  echo "
❌ Build failed. Aborting start." >&2
  exit 1
fi

echo "
✅ Build successful!"

# Step 2: Start the application
echo "
Launching CLI... (Press Ctrl+C to exit)"
node dist/index.js
