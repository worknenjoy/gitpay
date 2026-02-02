import { Strategy as LocalStrategy } from 'passport-local'
import jwt from 'jsonwebtoken'
import { userExists } from '../../modules/users'

export const createLocalStrategy = () => {
  return new LocalStrategy(async function verify(username, password, done) {
    const userAttributes = {
      email: username
    }
    try {
      const user = await userExists(userAttributes)
      if (!user) return done(null, false)
      if (user.login_strategy && user.login_strategy !== 'local') return done(null, false)
      if (user.verifyPassword && user.verifyPassword(password, user.password as string)) {
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.SECRET_PHRASE as string
        )
        user.token = token
        return done(null, user)
      }
      return done(null, false)
    } catch (err) {
      console.log('err', err)
      return done(err)
    }
  })
}
