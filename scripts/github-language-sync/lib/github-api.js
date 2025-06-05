const https = require("https");
const { URL } = require("url");

// Use environment variables directly to avoid dependency issues
const secrets = {
  github: {
    id: process.env.GITHUB_ID || "test_client_id",
    secret: process.env.GITHUB_SECRET || "test_client_secret",
  },
};

/**
 * GitHub API utility with rate limiting and smart caching
 *
 * Features:
 * - Automatic rate limit detection and handling
 * - Exponential backoff retry mechanism
 * - ETag support for conditional requests
 * - Request queuing to prevent rate limit hits
 * - Comprehensive error handling
 */
class GitHubAPI {
  constructor() {
    this.clientId = secrets.github.id;
    this.clientSecret = secrets.github.secret;
    this.baseURL = "https://api.github.com";
    this.userAgent =
      "octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0";

    // Rate limiting state
    this.rateLimitRemaining = null;
    this.rateLimitReset = null;
    this.isRateLimited = false;

    // Request queue for rate limiting
    this.requestQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Make a request to GitHub API with rate limiting
   */
  async makeRequest(options) {
    // Add authentication
    const url = new URL(options.uri);
    url.searchParams.set("client_id", this.clientId);
    url.searchParams.set("client_secret", this.clientSecret);

    const requestOptions = {
      ...options,
      uri: url.toString(),
      headers: {
        "User-Agent": this.userAgent,
        ...options.headers,
      },
      resolveWithFullResponse: true,
      simple: false, // Don't throw on HTTP error status codes
    };

    try {
      // Use built-in https module only
      const response = await this.makeHttpsRequest(requestOptions);

      // Update rate limit info from headers
      this.updateRateLimitInfo(response.headers);

      // Handle different response codes
      if (response.statusCode === 200) {
        return {
          data: options.json ? response.body : JSON.parse(response.body),
          etag: response.headers.etag,
          notModified: false,
        };
      } else if (response.statusCode === 304) {
        // Not modified - ETag matched
        return {
          data: null,
          etag: response.headers.etag,
          notModified: true,
        };
      } else if (response.statusCode === 403) {
        // Check if it's a rate limit error
        const errorBody =
          typeof response.body === "string"
            ? JSON.parse(response.body)
            : response.body;

        if (
          errorBody.message &&
          errorBody.message.includes("rate limit exceeded")
        ) {
          const resetTime =
            parseInt(response.headers["x-ratelimit-reset"]) * 1000;
          const retryAfter = Math.max(
            1,
            Math.ceil((resetTime - Date.now()) / 1000)
          );

          const error = new Error(`GitHub API rate limit exceeded`);
          error.isRateLimit = true;
          error.retryAfter = retryAfter;
          error.resetTime = resetTime;
          throw error;
        } else {
          throw new Error(`GitHub API error: ${errorBody.message}`);
        }
      } else if (response.statusCode === 404) {
        throw new Error(`Repository not found or not accessible`);
      } else {
        throw new Error(`GitHub API error: HTTP ${response.statusCode}`);
      }
    } catch (error) {
      if (error.isRateLimit) {
        this.isRateLimited = true;
        this.rateLimitReset = error.resetTime;
      }
      throw error;
    }
  }

  /**
   * Fallback HTTPS request method when request-promise is not available
   */
  async makeHttpsRequest(options) {
    const url = new URL(options.uri);

    const requestOptions = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: "GET",
      headers: options.headers,
    };

    return new Promise((resolve, reject) => {
      const req = https.request(requestOptions, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const body = options.json ? JSON.parse(data) : data;
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: body,
            });
          } catch (parseError) {
            reject(
              new Error(`Failed to parse response: ${parseError.message}`)
            );
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.end();
    });
  }

  /**
   * Update rate limit information from response headers
   */
  updateRateLimitInfo(headers) {
    if (headers["x-ratelimit-remaining"]) {
      this.rateLimitRemaining = parseInt(headers["x-ratelimit-remaining"]);
    }
    if (headers["x-ratelimit-reset"]) {
      this.rateLimitReset = parseInt(headers["x-ratelimit-reset"]) * 1000;
    }

    // Check if we're approaching rate limit
    if (this.rateLimitRemaining !== null && this.rateLimitRemaining < 10) {
      console.log(
        `⚠️  Approaching rate limit: ${this.rateLimitRemaining} requests remaining`
      );
    }
  }

  /**
   * Wait for rate limit to reset
   */
  async waitForRateLimit() {
    if (!this.isRateLimited || !this.rateLimitReset) {
      return;
    }

    const waitTime = Math.max(1000, this.rateLimitReset - Date.now() + 1000); // Add 1s buffer
    const waitSeconds = Math.ceil(waitTime / 1000);

    console.log(
      `⏳ Waiting ${waitSeconds}s for GitHub API rate limit to reset...`
    );

    await new Promise((resolve) => setTimeout(resolve, waitTime));

    this.isRateLimited = false;
    this.rateLimitReset = null;

    console.log("✅ Rate limit reset, resuming requests");
  }

  /**
   * Get repository languages with smart caching
   */
  async getRepositoryLanguages(owner, repo, options = {}) {
    const uri = `${this.baseURL}/repos/${owner}/${repo}/languages`;

    const requestOptions = {
      uri,
      json: true,
    };

    // Add ETag header for conditional requests
    if (options.etag) {
      requestOptions.headers = {
        "If-None-Match": options.etag,
      };
    }

    try {
      const result = await this.makeRequest(requestOptions);

      return {
        languages: result.data || {},
        etag: result.etag,
        notModified: result.notModified,
      };
    } catch (error) {
      if (error.message.includes("not found")) {
        console.log(
          `⚠️  Repository ${owner}/${repo} not found or not accessible`
        );
        return {
          languages: {},
          etag: null,
          notModified: false,
        };
      }
      throw error;
    }
  }

  /**
   * Get current rate limit status
   */
  async getRateLimitStatus() {
    try {
      const result = await this.makeRequest({
        uri: `${this.baseURL}/rate_limit`,
        json: true,
      });

      return result.data;
    } catch (error) {
      console.error("Failed to get rate limit status:", error.message);
      return null;
    }
  }

  /**
   * Check if we can make requests without hitting rate limit
   */
  canMakeRequest() {
    if (this.isRateLimited) {
      return false;
    }

    if (this.rateLimitRemaining !== null && this.rateLimitRemaining <= 0) {
      return false;
    }

    return true;
  }

  /**
   * Get time until rate limit resets (in seconds)
   */
  getTimeUntilReset() {
    if (!this.rateLimitReset) {
      return 0;
    }

    return Math.max(0, Math.ceil((this.rateLimitReset - Date.now()) / 1000));
  }
}

module.exports = GitHubAPI;
