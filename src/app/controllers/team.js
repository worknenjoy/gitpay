const requestJoinCoreTeam = require('../../modules/team').requestJoinCoreTeam

exports.requestJoinCoreTeamController = (req, res) => {
  requestJoinCoreTeam(req.body)
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on requestJoinCoreTeam', error)
      res.status(401).send(error)
    })
}
