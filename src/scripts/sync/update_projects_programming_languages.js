const models = require('../../models')
const requestPromise = require('request-promise')
const secrets = require('../../config/secrets')

async function updateProjectLanguages() {
  const githubClientId = secrets.github.id
  const githubClientSecret = secrets.github.secret

  // Fetch all tasks with GitHub URLs
  const projects = await models.Project.findAll({
    //where: { provider: "github" },
    include: [models.Organization]
  })

  for (const project of projects) {
    try {
      const owner = project.Organization.name
      const repo = project.name
      console.log(`Fetching languages for ${owner}/${repo}`)

      // Fetch programming languages from GitHub API
      const languagesResponse = await requestPromise({
        uri: `https://api.github.com/repos/${owner}/${repo}/languages?client_id=${githubClientId}&client_secret=${githubClientSecret}`,
        headers: {
          'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
        },
        json: true
      })

      // Extract languages
      const languages = Object.keys(languagesResponse)

      console.log(`Languages: ${languages.join(', ') || 'No languages found'}`)

      // Clear existing language associations for the task
      await models.ProjectProgrammingLanguage.destroy({
        where: { projectId: project.id }
      })

      // Ensure all programming languages exist in the ProgrammingLanguage table
      for (const language of languages) {
        // Check if the language already exists
        let programmingLanguage = await models.ProgrammingLanguage.findOne({
          where: { name: language }
        })

        // If the language doesn't exist, insert it
        if (!programmingLanguage) {
          programmingLanguage = await models.ProgrammingLanguage.create({
            name: language
          })
        }

        // Associate the language with the task
        await models.ProjectProgrammingLanguage.create({
          projectId: project.id,
          programmingLanguageId: programmingLanguage.id
        })
      }

      console.log(`Updated languages for project ID: ${project.id}`)
    } catch (error) {
      console.error(`Failed to update languages for project ID: ${project.id}`, error)
    }
  }
}

updateProjectLanguages().then(() => {
  console.log('Project language update complete.')
  process.exit()
})
