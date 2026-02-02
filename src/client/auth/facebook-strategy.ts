import { Strategy as FacebookStrategy } from 'passport-facebook'
import { facebook, oauthCallbacks } from '../../config/secrets'
import { userExists, userBuilds, userUpdate } from '../../modules/users'

interface UserData {
  id?: number
  provider?: string
  social_id?: string
  profile?: any
  attribute?: any
  email?: string
}

export const createFacebookStrategy = () => {
  if (!facebook.id || !facebook.secret) {
    return null
  }

  return new FacebookStrategy(
    {
      clientID: facebook.id,
      clientSecret: facebook.secret,
      callbackURL: oauthCallbacks.facebookCallbackUrl
    },
    async (accessToken, accessTokenSecret, profile, done) => {
      try {
        const attributes = {
          access_token: accessToken,
          access_token_secret: accessTokenSecret
        }

        const data: UserData = {
          provider: 'facebook',
          social_id: profile.id,
          profile: profile,
          attribute: attributes,
          email: 'Checking a facebook setup'
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
        console.log('Error in facebook-strategy.ts configuration file')
        // eslint-disable-next-line no-console
        console.log(error)
        return done(null)
      }
    }
  )
}
