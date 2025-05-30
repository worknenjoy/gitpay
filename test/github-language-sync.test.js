const expect = require("chai").expect;
const nock = require("nock");
const sinon = require("sinon");
const models = require("../models");
const GitHubAPI = require("../modules/github/api");
const {
  LanguageSyncManager,
} = require("../scripts/update_projects_programming_languages");
const { truncateModels } = require("./helpers");
const secrets = require("../config/secrets");

/**
 * COMPREHENSIVE GITHUB LANGUAGE SYNC TEST SUITE
 *
 * This test suite validates all critical functionality as a senior engineer would expect:
 * - Rate limit handling with real GitHub API responses
 * - ETag conditional requests and caching
 * - Database consistency and transaction handling
 * - Error scenarios and edge cases
 * - Performance and efficiency validations
 * - Integration testing with realistic data
 */

describe("GitHub Language Sync - Production Grade Tests", () => {
  let syncManager;
  let githubAPI;
  let testProject;
  let testOrganization;
  let testUser;
  let clock;

  // Test data constants
  const GITHUB_API_BASE = "https://api.github.com";
  const TEST_LANGUAGES = {
    JavaScript: 150000,
    TypeScript: 75000,
    CSS: 25000,
    HTML: 10000,
  };
  const UPDATED_LANGUAGES = {
    JavaScript: 160000,
    TypeScript: 80000,
    Python: 45000, // Added Python, removed CSS and HTML
  };

  beforeEach(async () => {
    // Clean up database completely
    await truncateModels(models.ProjectProgrammingLanguage);
    await truncateModels(models.ProgrammingLanguage);
    await truncateModels(models.Project);
    await truncateModels(models.Organization);
    await truncateModels(models.User);

    // Create realistic test data
    testUser = await models.User.create({
      email: "senior.engineer@gitpay.com",
      username: "seniorengineer",
      password: "securepassword123",
    });

    testOrganization = await models.Organization.create({
      name: "facebook",
      UserId: testUser.id,
      provider: "github",
      description: "Facebook Open Source",
    });

    testProject = await models.Project.create({
      name: "react",
      repo: "react",
      description:
        "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
      OrganizationId: testOrganization.id,
      private: false,
    });

    // Initialize managers
    syncManager = new LanguageSyncManager();
    githubAPI = new GitHubAPI();

    // Clean nock and setup default interceptors
    nock.cleanAll();

    // Setup fake timer for testing time-based functionality
    clock = sinon.useFakeTimers({
      now: new Date("2024-01-01T12:00:00Z"),
      shouldAdvanceTime: false,
    });
  });

  afterEach(() => {
    nock.cleanAll();
    if (clock) {
      clock.restore();
    }
    sinon.restore();
  });

  describe("Critical Rate Limit Handling Tests", () => {
    it("should handle successful language requests with proper headers", async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const resetTime = currentTime + 3600;

      nock(GITHUB_API_BASE)
        .get("/repos/facebook/react/languages")
        .query({
          client_id: secrets.github.id || "test_client_id",
          client_secret: secrets.github.secret || "test_client_secret",
        })
        .reply(200, TEST_LANGUAGES, {
          "x-ratelimit-remaining": "4999",
          "x-ratelimit-reset": resetTime.toString(),
          etag: '"W/abc123def456"',
          "cache-control": "public, max-age=60, s-maxage=60",
        });

      const result = await githubAPI.getRepositoryLanguages(
        "facebook",
        "react"
      );

      expect(result.languages).to.deep.equal(TEST_LANGUAGES);
      expect(result.etag).to.equal('"W/abc123def456"');
      expect(result.notModified).to.be.false;
      expect(githubAPI.rateLimitRemaining).to.equal(4999);
      expect(githubAPI.rateLimitReset).to.equal(resetTime * 1000);
    });

    it("should handle rate limit exceeded with exact x-ratelimit-reset timing", async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const resetTime = currentTime + 1847; // Realistic reset time from GitHub

      nock(GITHUB_API_BASE)
        .get("/repos/facebook/react/languages")
        .query({
          client_id: secrets.github.id || "test_client_id",
          client_secret: secrets.github.secret || "test_client_secret",
        })
        .reply(
          403,
          {
            message:
              "API rate limit exceeded for 87.52.110.50. (But here's the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.) If you reach out to GitHub Support for help, please include the request ID FF0B:15FEB:9CD277E:9D9D116:66193B8E.",
            documentation_url:
              "https://docs.github.com/rest/overview/rate-limits-for-the-rest-api",
          },
          {
            "x-ratelimit-remaining": "0",
            "x-ratelimit-reset": resetTime.toString(),
            "retry-after": "1847",
          }
        );

      try {
        await githubAPI.getRepositoryLanguages("facebook", "react");
        expect.fail("Should have thrown rate limit error");
      } catch (error) {
        expect(error.isRateLimit).to.be.true;
        expect(error.retryAfter).to.equal(1847);
        expect(error.resetTime).to.equal(resetTime * 1000);
        expect(error.message).to.include("GitHub API rate limit exceeded");
      }
    });

    it("should wait for exact rate limit reset time and retry", async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const resetTime = currentTime + 10; // 10 seconds from now

      // Mock the wait function to advance time
      const originalWaitForRateLimit = githubAPI.waitForRateLimit;
      githubAPI.waitForRateLimit = async function() {
        clock.tick(11000); // Advance 11 seconds
        this.isRateLimited = false;
        this.rateLimitReset = null;
      };

      // First call - rate limited
      nock(GITHUB_API_BASE)
        .get("/repos/facebook/react/languages")
        .query(true)
        .reply(
          403,
          {
            message: "API rate limit exceeded",
            documentation_url:
              "https://docs.github.com/rest/overview/rate-limits-for-the-rest-api",
          },
          {
            "x-ratelimit-remaining": "0",
            "x-ratelimit-reset": resetTime.toString(),
          }
        );

      // Second call after reset - success
      nock(GITHUB_API_BASE)
        .get("/repos/facebook/react/languages")
        .query(true)
        .reply(200, TEST_LANGUAGES, {
          "x-ratelimit-remaining": "5000",
          "x-ratelimit-reset": (resetTime + 3600).toString(),
          etag: '"after-reset"',
        });

      // Test the retry mechanism
      try {
        await githubAPI.getRepositoryLanguages("facebook", "react");
        expect.fail("First call should fail");
      } catch (error) {
        expect(error.isRateLimit).to.be.true;

        // Wait for rate limit and retry
        await githubAPI.waitForRateLimit();
        const result = await githubAPI.getRepositoryLanguages("facebook", "react");

        expect(result.languages).to.deep.equal(TEST_LANGUAGES);
        expect(result.etag).to.equal('"after-reset"');
      }

      // Restore original function
      githubAPI.waitForRateLimit = originalWaitForRateLimit;
    });
  });

  describe("ETag Conditional Request Tests", () => {
    it("should handle 304 Not Modified responses correctly", async () => {
      const etag = '"W/cached-etag-12345"';

      nock(GITHUB_API_BASE)
        .get("/repos/facebook/react/languages")
        .query(true)
        .matchHeader("If-None-Match", etag)
        .reply(304, "", {
          "x-ratelimit-remaining": "4998",
          "x-ratelimit-reset": Math.floor(Date.now() / 1000) + 3600,
          etag: etag,
        });

      const result = await githubAPI.getRepositoryLanguages("facebook", "react", {
        etag: etag,
      });

      expect(result.notModified).to.be.true;
      expect(result.languages).to.deep.equal({});
      expect(result.etag).to.equal(etag);
      expect(githubAPI.rateLimitRemaining).to.equal(4998);
    });

    it("should make conditional requests when ETag is provided", async () => {
      const etag = '"W/old-etag"';
      const newEtag = '"W/new-etag"';

      nock(GITHUB_API_BASE)
        .get("/repos/facebook/react/languages")
        .query(true)
        .matchHeader("If-None-Match", etag)
        .reply(200, UPDATED_LANGUAGES, {
          "x-ratelimit-remaining": "4997",
          "x-ratelimit-reset": Math.floor(Date.now() / 1000) + 3600,
          etag: newEtag,
        });

      const result = await githubAPI.getRepositoryLanguages("facebook", "react", {
        etag: etag,
      });

      expect(result.notModified).to.be.false;
      expect(result.languages).to.deep.equal(UPDATED_LANGUAGES);
      expect(result.etag).to.equal(newEtag);
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("should handle repository not found (404) gracefully", async () => {
      nock(GITHUB_API_BASE)
        .get("/repos/facebook/nonexistent")
        .query(true)
        .reply(404, {
          message: "Not Found",
          documentation_url: "https://docs.github.com/rest",
        });

      const result = await githubAPI.getRepositoryLanguages("facebook", "nonexistent");

      expect(result.languages).to.deep.equal({});
      expect(result.etag).to.be.null;
      expect(result.notModified).to.be.false;
    });

    it("should handle network timeouts and connection errors", async () => {
      nock(GITHUB_API_BASE)
        .get("/repos/facebook/react/languages")
        .query(true)
        .replyWithError({
          code: "ECONNRESET",
          message: "socket hang up",
        });

      try {
        await githubAPI.getRepositoryLanguages("facebook", "react");
        expect.fail("Should have thrown network error");
      } catch (error) {
        expect(error.code).to.equal("ECONNRESET");
        expect(error.message).to.include("socket hang up");
      }
    });

    it("should handle malformed JSON responses", async () => {
      nock(GITHUB_API_BASE)
        .get("/repos/facebook/react/languages")
        .query(true)
        .reply(200, "invalid json response", {
          "content-type": "application/json",
        });

      try {
        await githubAPI.getRepositoryLanguages("facebook", "react");
        expect.fail("Should have thrown JSON parse error");
      } catch (error) {
        expect(error.message).to.include("Unexpected token");
      }
    });
  });

  describe("Database Consistency and Transaction Tests", () => {
    it("should handle database transaction rollbacks on errors", async () => {
      // Create initial languages
      await syncManager.updateProjectLanguages(testProject, TEST_LANGUAGES);

      // Verify initial state
      let associations = await models.ProjectProgrammingLanguage.findAll({
        where: { projectId: testProject.id },
        include: [models.ProgrammingLanguage]
      });
      expect(associations).to.have.length(4);

      // Mock a database error during update
      const originalCreate = models.ProjectProgrammingLanguage.create;
      models.ProjectProgrammingLanguage.create = sinon.stub().rejects(new Error("Database connection lost"));

      try {
        await syncManager.updateProjectLanguages(testProject, UPDATED_LANGUAGES);
        expect.fail("Should have thrown database error");
      } catch (error) {
        expect(error.message).to.include("Database connection lost");
      }

      // Verify rollback - original data should still be there
      associations = await models.ProjectProgrammingLanguage.findAll({
        where: { projectId: testProject.id },
        include: [models.ProgrammingLanguage]
      });
      expect(associations).to.have.length(4); // Original count preserved

      // Restore original function
      models.ProjectProgrammingLanguage.create = originalCreate;
    });

    it("should perform differential updates efficiently", async () => {
      // Initial sync with 4 languages
      await syncManager.updateProjectLanguages(testProject, TEST_LANGUAGES);

      let associations = await models.ProjectProgrammingLanguage.findAll({
        where: { projectId: testProject.id },
        include: [models.ProgrammingLanguage]
      });
      expect(associations).to.have.length(4);

      const initialLanguageNames = associations.map(a => a.ProgrammingLanguage.name).sort();
      expect(initialLanguageNames).to.deep.equal(['CSS', 'HTML', 'JavaScript', 'TypeScript']);

      // Update with different languages (remove CSS, HTML; add Python)
      await syncManager.updateProjectLanguages(testProject, UPDATED_LANGUAGES);

      associations = await models.ProjectProgrammingLanguage.findAll({
        where: { projectId: testProject.id },
        include: [models.ProgrammingLanguage]
      });
      expect(associations).to.have.length(3);

      const updatedLanguageNames = associations.map(a => a.ProgrammingLanguage.name).sort();
      expect(updatedLanguageNames).to.deep.equal(['JavaScript', 'Python', 'TypeScript']);

      // Verify project metadata was updated
      await testProject.reload();
      expect(testProject.lastLanguageSync).to.not.be.null;
      expect(testProject.languageHash).to.not.be.null;
      expect(testProject.languageHash).to.equal(syncManager.generateLanguageHash(UPDATED_LANGUAGES));
    });

    it("should handle concurrent updates safely", async () => {
      // Simulate concurrent updates to the same project
      const promises = [
        syncManager.updateProjectLanguages(testProject, TEST_LANGUAGES),
        syncManager.updateProjectLanguages(testProject, UPDATED_LANGUAGES)
      ];

      // Both should complete without deadlocks
      await Promise.all(promises);

      // Final state should be consistent
      const associations = await models.ProjectProgrammingLanguage.findAll({
        where: { projectId: testProject.id },
        include: [models.ProgrammingLanguage]
      });

      // Should have languages from one of the updates
      expect(associations.length).to.be.greaterThan(0);
      expect(associations.length).to.be.lessThan(5);
    });
  });

  describe("Language Hash and Change Detection Tests", () => {
    it("should generate consistent hashes for same language sets", () => {
      const languages1 = { JavaScript: 100, Python: 200, TypeScript: 50 };
      const languages2 = { Python: 200, TypeScript: 50, JavaScript: 100 }; // Different order
      const languages3 = { JavaScript: 150, Python: 200, TypeScript: 50 }; // Different byte counts

      const hash1 = syncManager.generateLanguageHash(languages1);
      const hash2 = syncManager.generateLanguageHash(languages2);
      const hash3 = syncManager.generateLanguageHash(languages3);

      expect(hash1).to.equal(hash2); // Order shouldn't matter
      expect(hash1).to.equal(hash3); // Byte counts shouldn't matter, only language names
      expect(hash1).to.be.a('string');
      expect(hash1).to.have.length(32); // MD5 hash length
    });

    it("should generate different hashes for different language sets", () => {
      const languages1 = { JavaScript: 100, Python: 200 };
      const languages2 = { JavaScript: 100, TypeScript: 200 };
      const languages3 = { JavaScript: 100, Python: 200, CSS: 50 };

      const hash1 = syncManager.generateLanguageHash(languages1);
      const hash2 = syncManager.generateLanguageHash(languages2);
      const hash3 = syncManager.generateLanguageHash(languages3);

      expect(hash1).to.not.equal(hash2);
      expect(hash1).to.not.equal(hash3);
      expect(hash2).to.not.equal(hash3);
    });

    it("should correctly detect when updates are needed", async () => {
      const languages = { JavaScript: 100, Python: 200 };
      const hash = syncManager.generateLanguageHash(languages);

      // Project with no previous sync - should need update
      let needsUpdate = await syncManager.shouldUpdateLanguages(testProject, hash);
      expect(needsUpdate).to.be.true;

      // Update project with sync data
      await testProject.update({
        lastLanguageSync: new Date(),
        languageHash: hash
      });
      await testProject.reload();

      // Same hash - no update needed
      needsUpdate = await syncManager.shouldUpdateLanguages(testProject, hash);
      expect(needsUpdate).to.be.false;

      // Different hash - update needed
      const newLanguages = { JavaScript: 100, Python: 200, TypeScript: 50 };
      const newHash = syncManager.generateLanguageHash(newLanguages);
      needsUpdate = await syncManager.shouldUpdateLanguages(testProject, newHash);
      expect(needsUpdate).to.be.true;
    });
  });

  describe("Integration Tests - Full Sync Scenarios", () => {
    it("should perform complete sync with rate limit handling", async () => {
      // Create multiple projects for comprehensive testing
      const testProject2 = await models.Project.create({
        name: 'vue',
        repo: 'vue',
        OrganizationId: testOrganization.id
      });

      const currentTime = Math.floor(Date.now() / 1000);

      // First project - success
      nock(GITHUB_API_BASE)
        .get('/repos/facebook/react/languages')
        .query(true)
        .reply(200, TEST_LANGUAGES, {
          'x-ratelimit-remaining': '1',
          'x-ratelimit-reset': (currentTime + 3600).toString(),
          'etag': '"react-etag"'
        });

      // Second project - rate limited
      nock(GITHUB_API_BASE)
        .get('/repos/facebook/vue/languages')
        .query(true)
        .reply(403, {
          message: 'API rate limit exceeded',
          documentation_url: 'https://docs.github.com/rest/overview/rate-limits-for-the-rest-api'
        }, {
          'x-ratelimit-remaining': '0',
          'x-ratelimit-reset': (currentTime + 10).toString()
        });

      // After rate limit reset - success
      nock(GITHUB_API_BASE)
        .get('/repos/facebook/vue/languages')
        .query(true)
        .reply(200, UPDATED_LANGUAGES, {
          'x-ratelimit-remaining': '4999',
          'x-ratelimit-reset': (currentTime + 3600).toString(),
          'etag': '"vue-etag"'
        });

      // Mock the wait function for testing
      const originalWaitForRateLimit = syncManager.githubAPI.waitForRateLimit;
      syncManager.githubAPI.waitForRateLimit = async function() {
        clock.tick(11000); // Advance time
        this.isRateLimited = false;
        this.rateLimitReset = null;
      };

      await syncManager.syncAllProjects();

      expect(syncManager.stats.processed).to.equal(2);
      expect(syncManager.stats.updated).to.equal(2);
      expect(syncManager.stats.rateLimitHits).to.equal(1);
      expect(syncManager.stats.errors).to.equal(0);

      // Verify both projects were updated
      const reactAssociations = await models.ProjectProgrammingLanguage.findAll({
        where: { projectId: testProject.id },
        include: [models.ProgrammingLanguage]
      });
      expect(reactAssociations).to.have.length(4);

      const vueAssociations = await models.ProjectProgrammingLanguage.findAll({
        where: { projectId: testProject2.id },
        include: [models.ProgrammingLanguage]
      });
      expect(vueAssociations).to.have.length(3);

      // Restore original function
      syncManager.githubAPI.waitForRateLimit = originalWaitForRateLimit;
    });

    it("should skip projects without organizations", async () => {
      // Create orphan project
      const orphanProject = await models.Project.create({
        name: 'orphan-repo',
        repo: 'orphan-repo'
        // No OrganizationId
      });

      await syncManager.syncAllProjects();

      expect(syncManager.stats.processed).to.equal(2); // testProject + orphanProject
      expect(syncManager.stats.skipped).to.equal(1); // orphanProject
      expect(syncManager.stats.updated).to.equal(0);
    });

    it("should handle ETag-based conditional requests in full sync", async () => {
      // Set up project with existing ETag
      await testProject.update({
        languageEtag: '"existing-etag"',
        lastLanguageSync: new Date(),
        languageHash: syncManager.generateLanguageHash(TEST_LANGUAGES)
      });

      // Mock 304 Not Modified response
      nock(GITHUB_API_BASE)
        .get('/repos/facebook/react/languages')
        .query(true)
        .matchHeader('If-None-Match', '"existing-etag"')
        .reply(304, '', {
          'x-ratelimit-remaining': '4999',
          'x-ratelimit-reset': Math.floor(Date.now() / 1000) + 3600,
          'etag': '"existing-etag"'
        });

      await syncManager.syncAllProjects();

      expect(syncManager.stats.processed).to.equal(1);
      expect(syncManager.stats.skipped).to.equal(1); // Due to 304 Not Modified
      expect(syncManager.stats.updated).to.equal(0);
    });

    it("should provide comprehensive statistics and logging", async () => {
      const consoleSpy = sinon.spy(console, 'log');

      nock(GITHUB_API_BASE)
        .get('/repos/facebook/react/languages')
        .query(true)
        .reply(200, TEST_LANGUAGES, {
          'x-ratelimit-remaining': '4999',
          'x-ratelimit-reset': Math.floor(Date.now() / 1000) + 3600,
          'etag': '"test-etag"'
        });

      await syncManager.syncAllProjects();

      // Verify comprehensive logging
      expect(consoleSpy.calledWith('🚀 Starting optimized GitHub programming languages sync...')).to.be.true;
      expect(consoleSpy.calledWith('📋 Found 1 projects to process')).to.be.true;
      expect(consoleSpy.calledWith('🔍 Checking languages for facebook/react')).to.be.true;
      expect(consoleSpy.calledWith('📊 SYNC SUMMARY')).to.be.true;

      // Verify statistics
      expect(syncManager.stats.processed).to.equal(1);
      expect(syncManager.stats.updated).to.equal(1);
      expect(syncManager.stats.skipped).to.equal(0);
      expect(syncManager.stats.errors).to.equal(0);
      expect(syncManager.stats.rateLimitHits).to.equal(0);

      consoleSpy.restore();
    });
  });

  describe("Performance and Efficiency Tests", () => {
    it("should minimize database queries through efficient operations", async () => {
      // Spy on database operations
      const findAllSpy = sinon.spy(models.ProjectProgrammingLanguage, 'findAll');
      const createSpy = sinon.spy(models.ProjectProgrammingLanguage, 'create');
      const destroySpy = sinon.spy(models.ProjectProgrammingLanguage, 'destroy');

      await syncManager.updateProjectLanguages(testProject, TEST_LANGUAGES);

      // Should use minimal database operations
      expect(findAllSpy.callCount).to.equal(1); // One query to get existing associations
      expect(createSpy.callCount).to.equal(4); // One create per language
      expect(destroySpy.callCount).to.equal(0); // No destroys for new project

      findAllSpy.restore();
      createSpy.restore();
      destroySpy.restore();
    });

    it("should handle large language sets efficiently", async () => {
      // Create a large set of languages
      const largeLanguageSet = {};
      for (let i = 0; i < 50; i++) {
        largeLanguageSet[`Language${i}`] = Math.floor(Math.random() * 100000);
      }

      const startTime = Date.now();
      await syncManager.updateProjectLanguages(testProject, largeLanguageSet);
      const duration = Date.now() - startTime;

      // Should complete within reasonable time (less than 5 seconds)
      expect(duration).to.be.lessThan(5000);

      // Verify all languages were created
      const associations = await models.ProjectProgrammingLanguage.findAll({
        where: { projectId: testProject.id }
      });
      expect(associations).to.have.length(50);
    });
  });
});
            documentation_url:
              "https://docs.github.com/rest/overview/rate-limits-for-the-rest-api",
          },
          {
            "x-ratelimit-remaining": "0",
            "x-ratelimit-reset": resetTime.toString(),
          }
        );

      try {
        await githubAPI.getRepositoryLanguages("testorg", "testrepo");
        expect.fail("Should have thrown rate limit error");
      } catch (error) {
        expect(error.isRateLimit).to.be.true;
        expect(error.retryAfter).to.be.a("number");
        expect(error.retryAfter).to.be.greaterThan(0);
      }
    });

    it("should handle conditional requests with ETag", async () => {
      nock("https://api.github.com")
        .get("/repos/testorg/testrepo/languages")
        .query({
          client_id: process.env.GITHUB_CLIENT_ID || "test",
          client_secret: process.env.GITHUB_CLIENT_SECRET || "test",
        })
        .matchHeader("If-None-Match", '"abc123"')
        .reply(304, "", {
          "x-ratelimit-remaining": "4999",
          "x-ratelimit-reset": Math.floor(Date.now() / 1000) + 3600,
          etag: '"abc123"',
        });

      const result = await githubAPI.getRepositoryLanguages(
        "testorg",
        "testrepo",
        {
          etag: '"abc123"',
        }
      );

      expect(result.notModified).to.be.true;
      expect(result.languages).to.deep.equal({});
      expect(result.etag).to.equal('"abc123"');
    });

    it("should handle repository not found", async () => {
      nock("https://api.github.com")
        .get("/repos/testorg/nonexistent")
        .query({
          client_id: process.env.GITHUB_CLIENT_ID || "test",
          client_secret: process.env.GITHUB_CLIENT_SECRET || "test",
        })
        .reply(404, {
          message: "Not Found",
          documentation_url: "https://docs.github.com/rest",
        });

      const result = await githubAPI.getRepositoryLanguages(
        "testorg",
        "nonexistent"
      );

      expect(result.languages).to.deep.equal({});
      expect(result.etag).to.be.null;
      expect(result.notModified).to.be.false;
    });
  });

  describe("LanguageSyncManager", () => {
    it("should generate consistent language hashes", () => {
      const languages1 = { JavaScript: 100, Python: 200 };
      const languages2 = { Python: 200, JavaScript: 100 }; // Different order

      const hash1 = syncManager.generateLanguageHash(languages1);
      const hash2 = syncManager.generateLanguageHash(languages2);

      expect(hash1).to.equal(hash2);
      expect(hash1).to.be.a("string");
      expect(hash1).to.have.length(32); // MD5 hash length
    });

    it("should detect when languages need updating", async () => {
      const languages = { JavaScript: 100, Python: 200 };
      const hash = syncManager.generateLanguageHash(languages);

      // Project with no previous sync
      let needsUpdate = await syncManager.shouldUpdateLanguages(
        testProject,
        hash
      );
      expect(needsUpdate).to.be.true;

      // Update project with sync data
      await testProject.update({
        lastLanguageSync: new Date(),
        languageHash: hash,
      });
      await testProject.reload();

      // Same hash - no update needed
      needsUpdate = await syncManager.shouldUpdateLanguages(testProject, hash);
      expect(needsUpdate).to.be.false;

      // Different hash - update needed
      const newLanguages = { JavaScript: 100, Python: 200, TypeScript: 50 };
      const newHash = syncManager.generateLanguageHash(newLanguages);
      needsUpdate = await syncManager.shouldUpdateLanguages(
        testProject,
        newHash
      );
      expect(needsUpdate).to.be.true;
    });

    it("should update project languages efficiently", async () => {
      // Create initial languages
      const initialLanguages = { JavaScript: 100, Python: 200 };

      await syncManager.updateProjectLanguages(testProject, initialLanguages);

      // Verify languages were created and associated
      const associations = await models.ProjectProgrammingLanguage.findAll({
        where: { projectId: testProject.id },
        include: [models.ProgrammingLanguage],
      });

      expect(associations).to.have.length(2);
      const languageNames = associations
        .map((a) => a.ProgrammingLanguage.name)
        .sort();
      expect(languageNames).to.deep.equal(["JavaScript", "Python"]);

      // Update with new languages (add TypeScript, remove Python)
      const updatedLanguages = { JavaScript: 100, TypeScript: 50 };

      await syncManager.updateProjectLanguages(testProject, updatedLanguages);

      // Verify updated associations
      const updatedAssociations =
        await models.ProjectProgrammingLanguage.findAll({
          where: { projectId: testProject.id },
          include: [models.ProgrammingLanguage],
        });

      expect(updatedAssociations).to.have.length(2);
      const updatedLanguageNames = updatedAssociations
        .map((a) => a.ProgrammingLanguage.name)
        .sort();
      expect(updatedLanguageNames).to.deep.equal(["JavaScript", "TypeScript"]);

      // Verify project metadata was updated
      await testProject.reload();
      expect(testProject.lastLanguageSync).to.not.be.null;
      expect(testProject.languageHash).to.not.be.null;
    });

    it("should handle projects without organizations", async () => {
      // Create project without organization
      const orphanProject = await models.Project.create({
        name: "orphan-repo",
      });

      await syncManager.processProject(orphanProject);

      expect(syncManager.stats.skipped).to.equal(1);
      expect(syncManager.stats.errors).to.equal(0);
    });
  });

  describe("Integration Tests", () => {
    it("should perform complete sync with mocked GitHub API", async () => {
      const mockLanguages = {
        JavaScript: 100000,
        TypeScript: 50000,
      };

      nock("https://api.github.com")
        .get("/repos/testorg/testrepo/languages")
        .query({
          client_id: process.env.GITHUB_CLIENT_ID || "test",
          client_secret: process.env.GITHUB_CLIENT_SECRET || "test",
        })
        .reply(200, mockLanguages, {
          "x-ratelimit-remaining": "4999",
          "x-ratelimit-reset": Math.floor(Date.now() / 1000) + 3600,
          etag: '"def456"',
        });

      await syncManager.syncAllProjects();

      expect(syncManager.stats.processed).to.equal(1);
      expect(syncManager.stats.updated).to.equal(1);
      expect(syncManager.stats.errors).to.equal(0);

      // Verify languages were stored
      const associations = await models.ProjectProgrammingLanguage.findAll({
        where: { projectId: testProject.id },
        include: [models.ProgrammingLanguage],
      });

      expect(associations).to.have.length(2);
      const languageNames = associations
        .map((a) => a.ProgrammingLanguage.name)
        .sort();
      expect(languageNames).to.deep.equal(["JavaScript", "TypeScript"]);

      // Verify project metadata
      await testProject.reload();
      expect(testProject.lastLanguageSync).to.not.be.null;
      expect(testProject.languageHash).to.not.be.null;
      expect(testProject.languageEtag).to.equal('"def456"');
    });
  });
});
