#!/bin/bash
#
# Open-Claude-Code Local Installation Script
# This script builds, packs, and installs the project globally.

echo "🚀 Starting Open-Claude-Code local installation..."

# Step 1: Build the project
echo "
Building project..."
./build.sh

if [ $? -ne 0 ]; then
  echo "
❌ Build failed. Aborting installation." >&2
  exit 1
fi

# Step 2: Pack the project into a tarball
echo "
Packing project..."
npm pack

if [ $? -ne 0 ]; then
  echo "
❌ npm pack failed. Aborting installation." >&2
  exit 1
fi

# Find the generated tarball
TARBALL=$(ls open-claude-code-*.tgz 2>/dev/null | head -n 1)

if [ -z "$TARBALL" ]; then
  echo "
❌ No tarball found. Aborting installation." >&2
  exit 1
fi

# Step 3: Install the package globally
echo "
Installing $TARBALL globally..."
npm install -g "$TARBALL"

if [ $? -ne 0 ]; then
  echo "
❌ Global installation failed." >&2
  rm -f "$TARBALL" # Clean up
  exit 1
fi

# Step 4: Clean up the tarball
echo "
Cleaning up..."
rm -f "$TARBALL"

echo "
✅ Open-Claude-Code successfully installed globally!"
echo "You can now run it from anywhere by typing: open-claude-code"
