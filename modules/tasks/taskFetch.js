const Promise = require('bluebird');
const models = require('../../loading/loading');
const url = require('url');
const requestPromise = require('request-promise');

module.exports = Promise.method(function taskFetch(taskParams) {
  return models.Task
    .findOne(
      {where: {id: taskParams.id}, include: models.User}
    )
    .then(async (data) => {
      const githubUrl = data.dataValues.url;
      const splitIssueUrl = url.parse(githubUrl).path.split('/');
      const userOrCompany = splitIssueUrl[1];
      const projectName = splitIssueUrl[2];
      const issueId = splitIssueUrl[4];
      const issueData = await requestPromise({
        uri: `https://api.github.com/repos/${userOrCompany}/${projectName}/issues/${issueId}`,
        headers: {
          'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
        }
      }).then(response => {
        console.log('response error when query the task');
        return response;
      }).catch(e => {
        console.log('github response error');
        console.log(e);
      });

      const issueDataJson = JSON.parse(issueData);

      return {
        id: data.dataValues.id,
        url: githubUrl,
        value: data.dataValues.value || 0,
        metadata: {
          id: issueId,
          user: userOrCompany,
          company: userOrCompany,
          projectName: projectName,
          issue: issueDataJson
        }
      };

    }).catch((error) => {
      console.log(error);
      return false;
    });

});
