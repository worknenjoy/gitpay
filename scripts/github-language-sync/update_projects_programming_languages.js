const models = require("../../models");
const GitHubAPI = require("./lib/github-api");
const crypto = require("crypto");

/**
 * Optimized GitHub Programming Languages Sync Script
 *
 * Features:
 * - Smart sync with change detection
 * - GitHub API rate limit handling
 * - Automatic retry with exponential backoff
 * - Efficient database operations
 * - Comprehensive logging and error handling
 */

class LanguageSyncManager {
  constructor() {
    this.githubAPI = new GitHubAPI();
    this.stats = {
      processed: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      rateLimitHits: 0,
    };
  }

  /**
   * Generate a hash for a set of languages to detect changes
   */
  generateLanguageHash(languages) {
    const sortedLanguages = Object.keys(languages).sort();
    return crypto
      .createHash("md5")
      .update(JSON.stringify(sortedLanguages))
      .digest("hex");
  }

  /**
   * Check if project languages need to be updated
   */
  async shouldUpdateLanguages(project, currentLanguageHash) {
    // If no previous sync or hash doesn't match, update is needed
    return (
      !project.lastLanguageSync || project.languageHash !== currentLanguageHash
    );
  }

  /**
   * Update project languages efficiently
   */
  async updateProjectLanguages(project, languages) {
    const transaction = await models.sequelize.transaction();

    try {
      const languageNames = Object.keys(languages);

      // Get existing language associations
      const existingAssociations =
        await models.ProjectProgrammingLanguage.findAll({
          where: { projectId: project.id },
          include: [models.ProgrammingLanguage],
          transaction,
        });

      const existingLanguageNames = existingAssociations.map(
        (assoc) => assoc.ProgrammingLanguage.name
      );

      // Find languages to add and remove
      const languagesToAdd = languageNames.filter(
        (lang) => !existingLanguageNames.includes(lang)
      );
      const languagesToRemove = existingLanguageNames.filter(
        (lang) => !languageNames.includes(lang)
      );

      // Remove obsolete language associations
      if (languagesToRemove.length > 0) {
        const languageIdsToRemove = existingAssociations
          .filter((assoc) =>
            languagesToRemove.includes(assoc.ProgrammingLanguage.name)
          )
          .map((assoc) => assoc.programmingLanguageId);

        await models.ProjectProgrammingLanguage.destroy({
          where: {
            projectId: project.id,
            programmingLanguageId: languageIdsToRemove,
          },
          transaction,
        });
      }

      // Add new language associations
      for (const languageName of languagesToAdd) {
        // Find or create programming language
        let [programmingLanguage] =
          await models.ProgrammingLanguage.findOrCreate({
            where: { name: languageName },
            defaults: { name: languageName },
            transaction,
          });

        // Create association
        await models.ProjectProgrammingLanguage.create(
          {
            projectId: project.id,
            programmingLanguageId: programmingLanguage.id,
          },
          { transaction }
        );
      }

      // Update project sync metadata
      const languageHash = this.generateLanguageHash(languages);
      await models.Project.update(
        {
          lastLanguageSync: new Date(),
          languageHash: languageHash,
        },
        {
          where: { id: project.id },
          transaction,
        }
      );

      await transaction.commit();

      console.log(
        `✅ Updated languages for ${project.Organization.name}/${project.name}: +${languagesToAdd.length} -${languagesToRemove.length}`
      );
      return {
        added: languagesToAdd.length,
        removed: languagesToRemove.length,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Process a single project
   */
  async processProject(project) {
    try {
      if (!project.Organization) {
        console.log(`⚠️  Skipping project ${project.name} - no organization`);
        this.stats.skipped++;
        return;
      }

      const owner = project.Organization.name;
      const repo = project.name;

      console.log(`🔍 Checking languages for ${owner}/${repo}`);

      // Fetch languages from GitHub API with smart caching
      const languagesData = await this.githubAPI.getRepositoryLanguages(
        owner,
        repo,
        {
          etag: project.languageEtag, // Use ETag for conditional requests
        }
      );

      // If not modified (304), skip update
      if (languagesData.notModified) {
        console.log(`⏭️  Languages unchanged for ${owner}/${repo}`);
        this.stats.skipped++;
        return;
      }

      const { languages, etag } = languagesData;
      const languageHash = this.generateLanguageHash(languages);

      // Check if update is needed
      if (!(await this.shouldUpdateLanguages(project, languageHash))) {
        console.log(`⏭️  Languages already up to date for ${owner}/${repo}`);
        this.stats.skipped++;
        return;
      }

      // Update languages
      await this.updateProjectLanguages(project, languages);

      // Update ETag for future conditional requests
      if (etag) {
        await models.Project.update(
          {
            languageEtag: etag,
          },
          {
            where: { id: project.id },
          }
        );
      }

      this.stats.updated++;
      console.log(
        `📊 Languages: ${
          Object.keys(languages).join(", ") || "No languages found"
        }`
      );
    } catch (error) {
      this.stats.errors++;

      if (error.isRateLimit) {
        this.stats.rateLimitHits++;
        console.log(
          `⏳ Rate limit hit for ${project.Organization?.name}/${project.name}. Waiting ${error.retryAfter}s...`
        );
        throw error; // Re-throw to trigger retry at higher level
      } else {
        console.error(
          `❌ Failed to update languages for ${project.Organization?.name}/${project.name}:`,
          error.message
        );
      }
    } finally {
      this.stats.processed++;
    }
  }

  /**
   * Main sync function
   */
  async syncAllProjects() {
    console.log("🚀 Starting optimized GitHub programming languages sync...");
    const startTime = Date.now();

    try {
      // Fetch all projects with organizations
      const projects = await models.Project.findAll({
        include: [models.Organization],
        order: [["updatedAt", "DESC"]], // Process recently updated projects first
      });

      console.log(`📋 Found ${projects.length} projects to process`);

      // Process projects with rate limit handling
      for (const project of projects) {
        try {
          await this.processProject(project);
        } catch (error) {
          if (error.isRateLimit) {
            // Wait for rate limit reset and continue
            await this.githubAPI.waitForRateLimit();
            // Retry the same project
            await this.processProject(project);
          }
          // For other errors, continue with next project
        }
      }
    } catch (error) {
      console.error("💥 Fatal error during sync:", error);
      throw error;
    } finally {
      const duration = Math.round((Date.now() - startTime) / 1000);
      this.printSummary(duration);
    }
  }

  /**
   * Print sync summary
   */
  printSummary(duration) {
    console.log("\n" + "=".repeat(50));
    console.log("📊 SYNC SUMMARY");
    console.log("=".repeat(50));
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`📋 Processed: ${this.stats.processed} projects`);
    console.log(`✅ Updated: ${this.stats.updated} projects`);
    console.log(`⏭️  Skipped: ${this.stats.skipped} projects`);
    console.log(`❌ Errors: ${this.stats.errors} projects`);
    console.log(`⏳ Rate limit hits: ${this.stats.rateLimitHits}`);
    console.log("=".repeat(50));
  }
}

// Main execution
async function main() {
  const syncManager = new LanguageSyncManager();

  try {
    await syncManager.syncAllProjects();
    console.log("✅ Project language sync completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("💥 Sync failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { LanguageSyncManager };
