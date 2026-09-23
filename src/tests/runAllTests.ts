/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { runVerificationTests } from './unitTests';

console.log('====================================================');
console.log(' PRIVATE LEGAL NAVIGATOR — VERIFICATION TEST SUITE ');
console.log('====================================================\n');

const suite = runVerificationTests();

for (const test of suite.results) {
  const icon = test.passed ? '✓ PASS' : '✗ FAIL';
  console.log(`[${icon}] [${test.category}] ${test.name}`);
  console.log(`       Expected: ${test.expected}`);
  console.log(`       Actual:   ${test.actual}`);
  if (test.details) {
    console.log(`       Details:  ${test.details}`);
  }
  console.log('');
}

console.log('----------------------------------------------------');
console.log(`SUMMARY: ${suite.passed}/${suite.total} tests passed (${Math.round((suite.passed / suite.total) * 100)}% passing rate).`);
console.log('====================================================\n');

if (suite.failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
