import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { google, oauthCallbacks } from '../../config/secrets'
import { userExists, userBuilds, userUpdate } from '../../modules/users'

interface UserData {
  id?: number
  provider?: string
  social_id?: string
  profile?: any
  attribute?: any
  email?: string
}

export const createGoogleStrategy = () => {
  if (!google.id || !google.secret) {
    return null
  }

  return new GoogleStrategy(
    {
      clientID: google.id,
      clientSecret: google.secret,
      callbackURL: oauthCallbacks.googleCallbackUrl
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const attributes = {
          access_token: accessToken,
          refresh_token: refreshToken
        }

        const data: UserData = {
          provider: 'google',
          social_id: profile.id,
          profile: profile,
          attribute: attributes,
          email: profile.emails?.[0]?.value
        }

        const user = await userExists(data)
        if (user) {
          const updatedUser = await userUpdate({ ...data, id: user.id })
          return done(null, updatedUser)
        } else {
          const newUser = await userBuilds(data)
          return done(null, newUser)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error in google-strategy.ts configuration file')
        // eslint-disable-next-line no-console
        console.log(error)
        return done(null)
      }
    }
  )
}
