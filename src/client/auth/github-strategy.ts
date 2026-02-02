import { Strategy as GitHubStrategy } from 'passport-github2'
import jwt from 'jsonwebtoken'
import requestPromise from 'request-promise'
import { github, oauthCallbacks } from '../../config/secrets'
import { userExists, userBuilds, userUpdate } from '../../modules/users'
import { mailChimpConnect } from '../mail/mailchimp'

interface UserData {
  id?: number
  provider?: string
  provider_username?: string
  provider_id?: string
  provider_email?: string
  name?: string
  username?: string
  picture_url?: string
  website?: string
  profile_url?: string
  repos?: number
  email?: string
  login_strategy?: string
  token?: string
}

export const createGitHubStrategy = () => {
  if (!github.id || !github.secret) {
    return null
  }

  return new GitHubStrategy(
    {
      clientID: github.id,
      clientSecret: github.secret,
      callbackURL: oauthCallbacks.githubCallbackUrl,
      passReqToCallback: true,
      scope: ['user:email', 'read:org']
    },
    async (req: any, accessToken: string, accessTokenSecret: string, profile: any, done: any) => {
      try {
        const githubEmail = profile.emails ? profile.emails[0].value : profile._json.email
        const userEmail = req.query.state
        const email = userEmail || githubEmail

        const data: UserData = {
          provider: profile.provider,
          provider_username: profile.username,
          provider_id: profile.id,
          provider_email: githubEmail,
          name: profile.displayName,
          username: profile.username,
          picture_url: profile.photos[0].value,
          website: profile._json.blog,
          profile_url: profile.profileUrl,
          repos: 0,
          email: email
        }

        if (userEmail) {
          data.login_strategy = 'local'
        } else {
          data.login_strategy = 'github'
        }

        if (!email) {
          return done(null)
        }

        try {
          const response = await requestPromise({
            uri: `https://api.github.com/users/${profile.username}/repos`,
            headers: {
              'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0',
              authorization: `token ${accessToken}`
            }
          })

          data.repos = JSON.parse(response).length
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
            await userBuilds(data)
            const token = jwt.sign(
              { id: data.id, email: data.email },
              process.env.SECRET_PHRASE as string
            )
            data.token = token
            mailChimpConnect(data.email as string)
            return done(null, data)
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('Error fetching GitHub repositories')
          // eslint-disable-next-line no-console
          console.log(e)
          return done(null)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error in github-strategy.ts configuration file - search users')
        // eslint-disable-next-line no-console
        console.log(error)
        return done(null)
      }
    }
  )
}
