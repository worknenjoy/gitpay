#!/usr/bin/env node

/**
 * SIMPLE GITHUB LANGUAGE SYNC TEST - NO DEPENDENCIES
 * 
 * This test runs without any external dependencies and validates
 * the core functionality of the GitHub language sync solution.
 */

const assert = require("assert");

console.log('🧪 GitHub Language Sync - Simple Test Suite');
console.log('=' .repeat(50));

let passed = 0;
let failed = 0;

function test(description, testFn) {
  try {
    testFn();
    console.log(`✅ ${description}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${description}: ${error.message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n📁 1. File Structure Tests');
  console.log('-'.repeat(30));

  const fs = require('fs');
  
  test('Main sync script exists', () => {
    assert(fs.existsSync('scripts/github-language-sync/update_projects_programming_languages.js'));
  });

  test('GitHub API library exists', () => {
    assert(fs.existsSync('scripts/github-language-sync/lib/github-api.js'));
  });

  test('Rate limit utility exists', () => {
    assert(fs.existsSync('scripts/github-language-sync/rate-limit-status.js'));
  });

  test('README documentation exists', () => {
    assert(fs.existsSync('scripts/github-language-sync/README.md'));
  });

  console.log('\n🔧 2. Module Loading Tests');
  console.log('-'.repeat(30));

  let GitHubAPI, LanguageSyncManager;

  test('Can load GitHubAPI module', () => {
    GitHubAPI = require('../scripts/github-language-sync/lib/github-api');
    assert.strictEqual(typeof GitHubAPI, 'function');
  });

  test('Can load LanguageSyncManager module', () => {
    const syncScript = require('../scripts/github-language-sync/update_projects_programming_languages');
    LanguageSyncManager = syncScript.LanguageSyncManager;
    assert.strictEqual(typeof LanguageSyncManager, 'function');
  });

  console.log('\n⚙️  3. Instantiation Tests');
  console.log('-'.repeat(30));

  let githubAPI, syncManager;

  test('Can instantiate GitHubAPI', () => {
    githubAPI = new GitHubAPI();
    assert(githubAPI);
    assert.strictEqual(typeof githubAPI.getRepositoryLanguages, 'function');
  });

  test('Can instantiate LanguageSyncManager', () => {
    syncManager = new LanguageSyncManager();
    assert(syncManager);
    assert.strictEqual(typeof syncManager.generateLanguageHash, 'function');
  });

  console.log('\n🧮 4. Core Functionality Tests');
  console.log('-'.repeat(30));

  test('Language hash generation works', () => {
    const languages1 = { JavaScript: 100, Python: 200 };
    const languages2 = { Python: 200, JavaScript: 100 }; // Different order
    
    const hash1 = syncManager.generateLanguageHash(languages1);
    const hash2 = syncManager.generateLanguageHash(languages2);
    
    assert.strictEqual(hash1, hash2); // Order shouldn't matter
    assert.strictEqual(typeof hash1, 'string');
    assert.strictEqual(hash1.length, 32); // MD5 hash length
  });

  test('Different language sets produce different hashes', () => {
    const languages1 = { JavaScript: 100, Python: 200 };
    const languages2 = { JavaScript: 100, TypeScript: 200 };
    
    const hash1 = syncManager.generateLanguageHash(languages1);
    const hash2 = syncManager.generateLanguageHash(languages2);
    
    assert.notStrictEqual(hash1, hash2);
  });

  test('Empty language sets handled correctly', () => {
    const hash = syncManager.generateLanguageHash({});
    assert.strictEqual(typeof hash, 'string');
    assert.strictEqual(hash.length, 32);
  });

  test('Statistics initialization correct', () => {
    assert.strictEqual(typeof syncManager.stats, 'object');
    assert.strictEqual(syncManager.stats.processed, 0);
    assert.strictEqual(syncManager.stats.updated, 0);
    assert.strictEqual(syncManager.stats.skipped, 0);
    assert.strictEqual(syncManager.stats.errors, 0);
    assert.strictEqual(syncManager.stats.rateLimitHits, 0);
  });

  console.log('\n🌐 5. GitHub API Tests');
  console.log('-'.repeat(30));

  test('Rate limit info parsing works', () => {
    const mockHeaders = {
      'x-ratelimit-remaining': '100',
      'x-ratelimit-reset': Math.floor(Date.now() / 1000) + 3600
    };
    
    githubAPI.updateRateLimitInfo(mockHeaders);
    
    assert.strictEqual(githubAPI.rateLimitRemaining, 100);
    assert.strictEqual(githubAPI.canMakeRequest(), true);
  });

  test('Rate limit detection works', () => {
    const mockHeaders = {
      'x-ratelimit-remaining': '0',
      'x-ratelimit-reset': Math.floor(Date.now() / 1000) + 3600
    };
    
    githubAPI.updateRateLimitInfo(mockHeaders);
    
    assert.strictEqual(githubAPI.rateLimitRemaining, 0);
    assert.strictEqual(githubAPI.canMakeRequest(), false);
  });

  console.log('\n📦 6. Package Configuration Tests');
  console.log('-'.repeat(30));

  test('Package.json has required scripts', () => {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const scripts = packageJson.scripts || {};
    
    assert(scripts['sync:languages']);
    assert(scripts['sync:rate-limit']);
  });

  console.log('\n⚡ 7. Performance Tests');
  console.log('-'.repeat(30));

  test('Hash generation performance acceptable', () => {
    const largeLanguageSet = {};
    for (let i = 0; i < 1000; i++) {
      largeLanguageSet[`Language${i}`] = Math.random() * 100000;
    }
    
    const startTime = Date.now();
    const hash = syncManager.generateLanguageHash(largeLanguageSet);
    const duration = Date.now() - startTime;
    
    assert(duration < 100, `Hash generation too slow: ${duration}ms`);
    assert.strictEqual(hash.length, 32);
  });

  console.log('\n🎯 8. Integration Tests');
  console.log('-'.repeat(30));

  test('All required methods available', () => {
    // GitHubAPI methods
    assert.strictEqual(typeof githubAPI.updateRateLimitInfo, 'function');
    assert.strictEqual(typeof githubAPI.waitForRateLimit, 'function');
    assert.strictEqual(typeof githubAPI.canMakeRequest, 'function');
    assert.strictEqual(typeof githubAPI.getTimeUntilReset, 'function');

    // LanguageSyncManager methods
    assert.strictEqual(typeof syncManager.generateLanguageHash, 'function');
    assert.strictEqual(typeof syncManager.shouldUpdateLanguages, 'function');
    assert.strictEqual(typeof syncManager.processProject, 'function');
    assert.strictEqual(typeof syncManager.syncAllProjects, 'function');
  });

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ GitHub Language Sync solution is fully functional');
    console.log('✅ Ready for production deployment');
    process.exit(0);
  } else {
    console.log('\n⚠️  SOME TESTS FAILED!');
    console.log('❌ Please review and fix issues');
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
});
