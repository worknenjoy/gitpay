import { Strategy as BitbucketStrategy } from 'passport-bitbucket-oauth20'
import jwt from 'jsonwebtoken'
import requestPromise from 'request-promise'
import { bitbucket, oauthCallbacks } from '../../config/secrets'
import { userExists, userBuilds, userUpdate } from '../../modules/users'
import { mailChimpConnect } from '../mail/mailchimp'

interface UserData {
  id?: number
  provider?: string
  social_id?: string
  name?: string
  username?: string
  picture_url?: string
  website?: string
  repos?: number
  email?: string
  token?: string
}

export const createBitbucketStrategy = () => {
  if (!bitbucket.id || !bitbucket.secret) {
    return null
  }

  return new BitbucketStrategy(
    {
      clientID: bitbucket.id,
      clientSecret: bitbucket.secret,
      callbackURL: oauthCallbacks.bitbucketCallbackUrl
    },
    async (accessToken: string, accessTokenSecret: string, profile: any, done: any) => {
      try {
        const data: UserData = {
          provider: profile.provider,
          social_id: profile.id,
          name: profile.displayName,
          username: profile.username,
          picture_url: profile._json.links.avatar.href,
          website: profile._json.website,
          repos: 0,
          email: profile.emails[0].value
        }

        try {
          const response = await requestPromise({
            uri: `https://api.bitbucket.org/2.0/repositories/${profile.username}`,
            headers: {
              authorization: `Bearer ${accessToken}`
            }
          })

          data.repos = JSON.parse(response).size
          const user = await userExists(data)

          if (user) {
            await userUpdate({ ...data, id: user.id })
            const token = jwt.sign(
              { id: data.id, email: data.email },
              process.env.SECRET_PHRASE as string
            )
            data.token = token
            return done(null, data)
          } else {
            const newUser = await userBuilds(data)
            mailChimpConnect(profile.emails[0].value)
            return done(null, newUser)
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('Error fetching Bitbucket repositories')
          // eslint-disable-next-line no-console
          console.log(e)
          return done(null)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error in bitbucket-strategy.ts configuration file - search users')
        // eslint-disable-next-line no-console
        console.log(error)
        return done(null)
      }
    }
  )
}
