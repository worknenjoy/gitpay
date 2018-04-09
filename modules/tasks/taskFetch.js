const Promise = require('bluebird');
const models = require('../../loading/loading');
const url = require('url');

module.exports = Promise.method(function taskFetch(taskParams) {
  return models.Task
    .findOne(
      {where: {id: taskParams.id}, include: models.User}
    )
    .then((data) => {
      const githubUrl = data.dataValues.url;
      const splitIssueUrl = url.parse(githubUrl).path.split('/');
      const userOrCompany = splitIssueUrl[1];
      const issueId = splitIssueUrl[4];

      

      return {
        id: data.dataValues.id,
        url: githubUrl,
        metadata: {

        }
      };
    }).catch((error) => {
      console.log(error);
      return false;
    });

});
