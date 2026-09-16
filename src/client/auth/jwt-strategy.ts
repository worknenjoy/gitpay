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
      const jwtPayloadJson = JSON.stringify(jwtPayload, null, 2)
      console.log(
        `\x1b[1;38;2;240;79;120mjwtPayload: \x1b[1;38;2;143;211;255m${jwtPayloadJson}\x1b[0m`
      )
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
