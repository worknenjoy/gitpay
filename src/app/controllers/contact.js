const contactRecruiters = require('../../modules/contact').contactRecruiters

exports.contactRecruiters = (req, res) => {
  contactRecruiters(req.body)
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on contactRecruiters', error)
      res.status(401).send(error)
    })
}
