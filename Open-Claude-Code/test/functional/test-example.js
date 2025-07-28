// Test file for Claude Code
// This is a simple example test

console.log('Running example test...');

// Simple test function
function testExample() {
  const result = 1 + 1;
  if (result === 2) {
    console.log('Test passed!');
    return true;
  } else {
    console.log('Test failed!');
    return false;
  }
}

// Run the test
const passed = testExample();

// Exit with appropriate code
process.exit(passed ? 0 : 1);
