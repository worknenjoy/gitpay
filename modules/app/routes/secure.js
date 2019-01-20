const jwt = require('jsonwebtoken')
const { userExists } = require('../../users')

module.exports = (req, res, next) => {
  // CORS preflight request
  if (req.method === 'OPTIONS') {
    next()
  }
  else {
    const token = req.body.token || req.query.token ||
      // support with or without 'Bearer '
      (req.headers['authorization'] || '').replace(/Bearer\s+/, '')

    if (!token) return res.status(403).send({ errors: ['No token provided'] })

    jwt.verify(token, process.env.SECRET_PHRASE, async (err, decoded) => {
      if (err) return res.status(403).send({ errors: ['Failed to authenticate token'] })

      req.decoded = decoded
      req.user = await userExists(decoded).catch(next)

      next()
    })
  }
}
