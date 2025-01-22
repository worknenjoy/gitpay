const models = require("../models");
const requestPromise = require("request-promise");
const secrets = require("../config/secrets");

async function updateTaskLanguages() {
  const githubClientId = secrets.github.id;
  const githubClientSecret = secrets.github.secret;

  // Fetch all tasks with GitHub URLs
  const tasks = await models.Task.findAll({
    where: { provider: "github" },
  });

  for (const task of tasks) {
    try {
      const issueUrl = task.url;
      const splitIssueUrl = new URL(issueUrl).pathname.split("/");
      const owner = splitIssueUrl[1];
      const repo = splitIssueUrl[2];

      // Fetch programming languages from GitHub API
      const languagesResponse = await requestPromise({
        uri: `https://api.github.com/repos/${owner}/${repo}/languages?client_id=${githubClientId}&client_secret=${githubClientSecret}`,
        headers: {
          "User-Agent":
            "octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0",
        },
        json: true,
      });

      // Extract languages
      const languages = Object.keys(languagesResponse);

      // Print task title and languages
      console.log(`Task: ${task.title}`);
      console.log(`Languages: ${languages.join(", ") || "No languages found"}`);

      // Clear existing language associations for the task
      await models.TaskProgrammingLanguage.destroy({
        where: { taskId: task.id },
      });

      // Ensure all programming languages exist in the ProgrammingLanguage table
      for (const language of languages) {
        // Check if the language already exists
        let programmingLanguage = await models.ProgrammingLanguage.findOne({
          where: { name: language },
        });

        // If the language doesn't exist, insert it
        if (!programmingLanguage) {
          programmingLanguage = await models.ProgrammingLanguage.create({
            name: language,
          });
        }

        // Associate the language with the task
        await models.TaskProgrammingLanguage.create({
          taskId: task.id,
          programmingLanguageId: programmingLanguage.id,
        });
      }

      console.log(`Updated languages for task ID: ${task.id}`);
    } catch (error) {
      console.error(
        `Failed to update languages for task ID: ${task.id}`,
        error
      );
    }
  }
}

updateTaskLanguages().then(() => {
  console.log("Task language update complete.");
  process.exit();
});
