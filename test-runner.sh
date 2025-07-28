#!/bin/bash

# Claude Code Test Runner
# This script provides a unified interface for running tests

# Default values
CATEGORY=""
SEARCH_TERM=""
TEST_FILE=""
LIST_TESTS=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --list)
      LIST_TESTS=true
      shift
      ;;
    --category)
      CATEGORY="$2"
      shift 2
      ;;
    --search)
      SEARCH_TERM="$2"
      shift 2
      ;;
    *)
      TEST_FILE="$1"
      shift
      ;;
  esac
done

# Function to list all tests
list_tests() {
  echo "Available tests:"
  find test -name "test-*.js" -o -name "debug-*.js" | sort
}

# Function to search tests
search_tests() {
  echo "Tests matching '$SEARCH_TERM':"
  find test -name "*${SEARCH_TERM}*.js" | sort
}

# Function to run tests by category
run_category() {
  echo "Running tests in category: $CATEGORY"
  if [ -d "test/$CATEGORY" ]; then
    find "test/$CATEGORY" -name "test-*.js" -exec node {} \;
  else
    echo "Category $CATEGORY not found"
    exit 1
  fi
}

# Function to run a single test
run_single_test() {
  if [ -f "$TEST_FILE" ]; then
    echo "Running test: $TEST_FILE"
    node "$TEST_FILE"
  else
    echo "Test file $TEST_FILE not found"
    exit 1
  fi
}

# Main logic
if [ "$LIST_TESTS" = true ]; then
  list_tests
elif [ -n "$SEARCH_TERM" ]; then
  search_tests
elif [ -n "$CATEGORY" ]; then
  run_category
elif [ -n "$TEST_FILE" ]; then
  run_single_test
else
  echo "Claude Code Test Runner"
  echo "Usage:"
  echo "  ./test-runner.sh --list              # List all tests"
  echo "  ./test-runner.sh --search <term>     # Search for tests"
  echo "  ./test-runner.sh --category <cat>    # Run tests by category"
  echo "  ./test-runner.sh <test-file>         # Run a single test"
  exit 1
fi
