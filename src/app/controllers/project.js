const Projects = require('../../modules/projects')

exports.fetchProject = (req, res) => {
  Projects.projectFetch(req.params, req.query)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.listProjects = (req, res) => {
  Projects.projectList(req.params)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}
