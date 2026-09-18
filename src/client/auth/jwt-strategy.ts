import passportJWT from 'passport-jwt'
import { userExists } from '../../modules/users'

const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy

export const createJWTStrategy = () => {
  if (!process.env.SECRET_PHRASE) {
    return null
  }

  return new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_PHRASE
    },
    async (jwtPayload: any, done: any) => {
      try {
        const userAttributes = {
          email: jwtPayload.email
        }
        const user = await userExists(userAttributes)
        if (!user) return done(null, false)
        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  )
}
