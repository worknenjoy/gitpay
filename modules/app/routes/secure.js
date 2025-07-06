const jwt = require('jsonwebtoken')
const { userExists } = require('../../users')

module.exports = async (req, res, next) => {

  const authHeader = req.headers['authorization'];
  let token = req.body?.token || req.query?.token;

  if (!token && authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    console.log('❌ No token provided');
    return res.status(403).send({ errors: ['No token provided'] });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_PHRASE);
  
    req.decoded = decoded;

    const user = await userExists(decoded);
    
    if (!user) {
      return res.status(403).send({ errors: ['User not found'] });
    }

    req.user = user;
    return next();
  } catch (err) {
    console.log('❌ JWT verify error:', err);
    return res.status(403).send({ errors: ['Failed to authenticate token'] });
  }
};

