# GitHub Programming Languages Sync

This document describes the optimized GitHub programming languages synchronization system for GitPay.

## Overview

The GitHub language sync system automatically fetches and updates programming language information for projects from the GitHub API. It includes smart caching, rate limit handling, and efficient database operations to minimize API calls and improve performance.

## Features

### 🚀 Smart Sync with Change Detection
- Uses MD5 hashing to detect language changes
- Only updates when repository languages have actually changed
- Supports ETag-based conditional requests to minimize API calls

### ⏳ GitHub API Rate Limit Handling
- Automatic detection of rate limit exceeded errors
- Intelligent waiting based on `x-ratelimit-reset` header
- Exponential backoff retry mechanism
- Request queuing to prevent hitting rate limits

### 🔧 Efficient Database Operations
- Differential updates (only add/remove changed languages)
- Database transactions for data consistency
- Bulk operations to minimize database round trips
- Proper foreign key handling and cleanup

### 📊 Comprehensive Logging and Monitoring
- Detailed progress tracking with emojis for easy reading
- Statistics collection (processed, updated, skipped, errors)
- Rate limit hit tracking
- Performance metrics and timing

## Usage

### Running the Sync Script

```bash
# Run the optimized language sync
node scripts/update_projects_programming_languages.js

# Check GitHub API rate limit status before running
node scripts/github-rate-limit-status.js
```

### Example Output

```
🚀 Starting optimized GitHub programming languages sync...
📋 Found 25 projects to process
🔍 Checking languages for facebook/react
✅ Updated languages for facebook/react: +1 -0
📊 Languages: JavaScript, TypeScript, CSS
⏭️  Languages unchanged for microsoft/vscode
⚠️  Skipping project orphan-repo - no organization
⏳ Rate limit hit for google/tensorflow. Waiting 1847s...
✅ Rate limit reset, resuming requests

==================================================
📊 SYNC SUMMARY
==================================================
⏱️  Duration: 45s
📋 Processed: 25 projects
✅ Updated: 8 projects
⏭️  Skipped: 15 projects
❌ Errors: 2 projects
⏳ Rate limit hits: 1
==================================================
```

## Database Schema

### New Project Fields

The Project model has been extended with the following fields:

```sql
-- Timestamp of last programming languages sync from GitHub
lastLanguageSync DATETIME NULL

-- MD5 hash of current programming languages for change detection  
languageHash VARCHAR(32) NULL

-- ETag from GitHub API for conditional requests
languageEtag VARCHAR(100) NULL
```

### Migration

Run the migration to add the new fields:

```bash
npm run migrate
```

## API Classes

### GitHubAPI

Centralized GitHub API client with rate limiting and smart caching.

```javascript
const GitHubAPI = require('./modules/github/api');

const githubAPI = new GitHubAPI();

// Get repository languages with ETag support
const result = await githubAPI.getRepositoryLanguages('owner', 'repo', {
  etag: '"abc123"' // Optional ETag for conditional requests
});

// Check rate limit status
const rateLimitStatus = await githubAPI.getRateLimitStatus();

// Check if we can make requests
if (githubAPI.canMakeRequest()) {
  // Safe to make requests
}
```

### LanguageSyncManager

Main sync orchestrator with smart update logic.

```javascript
const { LanguageSyncManager } = require('./scripts/update_projects_programming_languages');

const syncManager = new LanguageSyncManager();

// Sync all projects
await syncManager.syncAllProjects();

// Process a single project
await syncManager.processProject(project);

// Generate language hash for change detection
const hash = syncManager.generateLanguageHash(languages);
```

## Configuration

### Environment Variables

```bash
# GitHub API credentials (required)
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# Optional: GitHub webhook token for enhanced features
GITHUB_WEBHOOK_APP_TOKEN=your_webhook_token
```

### Rate Limiting

The system respects GitHub's rate limits:

- **Unauthenticated requests**: 60 requests/hour
- **Authenticated requests**: 5,000 requests/hour
- **Search API**: 30 requests/minute

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run only language sync tests
npm test test/github-language-sync.test.js
```

### Test Coverage

The test suite covers:

- ✅ GitHub API rate limit handling
- ✅ ETag-based conditional requests
- ✅ Language hash generation and comparison
- ✅ Database transaction handling
- ✅ Error scenarios and edge cases
- ✅ Integration testing with mocked GitHub API

## Monitoring and Troubleshooting

### Rate Limit Status

Check current rate limit status:

```bash
node scripts/github-rate-limit-status.js
```

### Common Issues

**Rate Limit Exceeded**
- The script automatically handles this by waiting for the reset time
- Check rate limit status before running large syncs
- Consider using authenticated requests for higher limits

**Repository Not Found**
- Some repositories may be private or deleted
- The script logs warnings and continues with other repositories

**Database Connection Issues**
- Ensure database is running and accessible
- Check database connection configuration

### Performance Tips

1. **Run during off-peak hours** to avoid rate limits
2. **Use authenticated requests** for 5,000 requests/hour limit
3. **Monitor rate limit status** before large operations
4. **Enable database indexing** for better query performance

## Best Practices

1. **Schedule regular syncs** but not too frequently (daily/weekly)
2. **Monitor logs** for errors and rate limit hits
3. **Use the rate limit checker** before manual runs
4. **Keep GitHub credentials secure** and rotate regularly
5. **Test changes** in development environment first

## Contributing

When modifying the sync system:

1. **Add tests** for new functionality
2. **Update documentation** for API changes
3. **Test rate limit scenarios** thoroughly
4. **Verify database migrations** work correctly
5. **Check performance impact** on large datasets
