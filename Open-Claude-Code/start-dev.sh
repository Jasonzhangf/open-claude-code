#!/bin/bash

# Claude Code Development Start Script
# This script starts the development server with logging

# Define log file
LOG_FILE="/tmp/ccr-dev.log"

# Create/update log file
touch "$LOG_FILE"

# Start the development server in the background with logging
echo "Starting Claude Code development server..."
echo "Logging to $LOG_FILE"

# Build first
./build.sh

if [ $? -ne 0 ]; then
  echo "Build failed. Aborting start."
  exit 1
fi

# Start server with logging
node dist/index.js > "$LOG_FILE" 2>&1 &

# Capture the process ID
echo $! > /tmp/ccr-dev.pid

echo "Development server started with PID $(cat /tmp/ccr-dev.pid)"
echo "Use 'tail -f $LOG_FILE' to monitor logs"
