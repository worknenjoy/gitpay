const GitHubAPI = require("./lib/github-api");

/**
 * Utility script to check GitHub API rate limit status
 * 
 * Usage:
 * node scripts/github-language-sync/rate-limit-status.js
 */

async function checkRateLimitStatus() {
  const githubAPI = new GitHubAPI();
  
  console.log("🔍 Checking GitHub API rate limit status...\n");
  
  try {
    const rateLimitData = await githubAPI.getRateLimitStatus();
    
    if (!rateLimitData) {
      console.log("❌ Failed to retrieve rate limit status");
      return;
    }
    
    const { core, search, graphql } = rateLimitData.resources;
    
    console.log("📊 GitHub API Rate Limit Status");
    console.log("=".repeat(40));
    
    // Core API (most endpoints)
    console.log("🔧 Core API:");
    console.log(`   Limit: ${core.limit} requests/hour`);
    console.log(`   Used: ${core.used} requests`);
    console.log(`   Remaining: ${core.remaining} requests`);
    console.log(`   Reset: ${new Date(core.reset * 1000).toLocaleString()}`);
    
    const corePercentUsed = ((core.used / core.limit) * 100).toFixed(1);
    console.log(`   Usage: ${corePercentUsed}%`);
    
    if (core.remaining < 100) {
      console.log("   ⚠️  WARNING: Low remaining requests!");
    }
    
    console.log();
    
    // Search API
    console.log("🔍 Search API:");
    console.log(`   Limit: ${search.limit} requests/hour`);
    console.log(`   Used: ${search.used} requests`);
    console.log(`   Remaining: ${search.remaining} requests`);
    console.log(`   Reset: ${new Date(search.reset * 1000).toLocaleString()}`);
    
    console.log();
    
    // GraphQL API
    console.log("📈 GraphQL API:");
    console.log(`   Limit: ${graphql.limit} requests/hour`);
    console.log(`   Used: ${graphql.used} requests`);
    console.log(`   Remaining: ${graphql.remaining} requests`);
    console.log(`   Reset: ${new Date(graphql.reset * 1000).toLocaleString()}`);
    
    console.log();
    
    // Recommendations
    if (core.remaining < 500) {
      console.log("💡 Recommendations:");
      console.log("   - Consider waiting before running language sync");
      console.log("   - Use authenticated requests for higher limits");
      console.log("   - Implement request batching and caching");
    } else {
      console.log("✅ Rate limit status looks good for running sync operations");
    }
    
    // Time until reset
    const resetTime = core.reset * 1000;
    const timeUntilReset = Math.max(0, resetTime - Date.now());
    const minutesUntilReset = Math.ceil(timeUntilReset / (1000 * 60));
    
    if (minutesUntilReset > 0) {
      console.log(`⏰ Rate limit resets in ${minutesUntilReset} minutes`);
    }
    
  } catch (error) {
    console.error("❌ Error checking rate limit status:", error.message);
    
    if (error.isRateLimit) {
      console.log(`⏳ Rate limit exceeded. Resets in ${error.retryAfter} seconds`);
    }
  }
}

// Run if called directly
if (require.main === module) {
  checkRateLimitStatus()
    .then(() => process.exit(0))
    .catch(error => {
      console.error("💥 Script failed:", error);
      process.exit(1);
    });
}

module.exports = { checkRateLimitStatus };
