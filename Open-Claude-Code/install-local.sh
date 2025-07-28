#!/bin/bash

# Claude Code Local Installation Script
# This script builds, packs, and installs the project globally

echo "Starting Claude Code local installation..."

# Build the project
echo "Building project..."
npm run build

if [ $? -ne 0 ]; then
  echo "Build failed. Aborting installation."
  exit 1
fi

# Pack the project
echo "Packing project..."
npm pack

if [ $? -ne 0 ]; then
  echo "Pack failed. Aborting installation."
  exit 1
fi

# Find the generated tarball
TARBALL=$(ls open-claude-code-*.tgz 2>/dev/null | head -n 1)

if [ -z "$TARBALL" ]; then
  echo "No tarball found. Aborting installation."
  exit 1
fi

# Install globally
echo "Installing $TARBALL globally..."
npm install -g "$TARBALL"

if [ $? -ne 0 ]; then
  echo "Global installation failed."
  exit 1
fi

# Clean up
echo "Cleaning up..."
rm -f "$TARBALL"

# Verify installation
echo "Verifying installation..."
which open-claude-code

if [ $? -eq 0 ]; then
  echo "Claude Code successfully installed globally!"
else
  echo "Installation verification failed."
  exit 1
fi
