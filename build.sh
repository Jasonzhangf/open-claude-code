#!/bin/bash

# Claude Code Build Script
# This script cleans and builds the project

echo "Cleaning build directory..."
rm -rf dist

# Create dist directory
mkdir -p dist

echo "Building project..."
npm run build

if [ $? -ne 0 ]; then
  echo "Build failed."
  exit 1
fi

echo "Build completed successfully!"
