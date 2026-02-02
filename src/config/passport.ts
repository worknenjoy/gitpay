import { google, facebook, github, oauthCallbacks, bitbucket } from './secrets'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { Strategy as BitbucketStrategy } from 'passport-bitbucket-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as LocalStrategy } from 'passport-local'
import requestPromise from 'request-promise'
import passportJWT from 'passport-jwt'
import { mailChimpConnect } from '../client/mail/mailchimp'
import { userExists, userBuilds, userUpdate } from '../modules/users'

const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy

interface UserData {
  id?: number
  provider?: string
  provider_username?: string
  provider_id?: string
  provider_email?: string
  social_id?: string
  profile?: any
  attribute?: any
  name?: string
  username?: string
  picture_url?: string
  website?: string
  profile_url?: string
  repos?: number
  email?: string
  login_strategy?: string
  token?: string
  password?: string
  verifyPassword?: (password: string, hashedPassword: string) => boolean
}

passport.serializeUser((user: any, done) => {
  done(null, user)
})

passport.deserializeUser(async (user: any, done) => {
  try {
    const foundUser = await userExists(user)
    done(null, foundUser)
  } catch (error) {
    done(error)
  }
})

/* eslint-disable new-cap */
if (google.id && google.secret) {
  passport.use(
    new GoogleStrategy(
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
        console.log('Error in passport.ts configuration file')
        // eslint-disable-next-line no-console
        console.log(error)
        return done(null)
      }
    }
  )
)
}

if (facebook.id && facebook.secret) {
  passport.use(
    new FacebookStrategy(
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
        console.log('Error in passport.ts configuration file')
        // eslint-disable-next-line no-console
        console.log(error)
        return done(null)
      }
    }
  )
)
}

if (github.id && github.secret) {
  passport.use(
    new GitHubStrategy(
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
        console.log('Error in passport.ts configuration file - search users')
        // eslint-disable-next-line no-console
        console.log(error)
        return done(null)
      }
    }
  )
)
}

if (bitbucket.id && bitbucket.secret) {
  passport.use(
    new BitbucketStrategy(
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
        console.log('Error in passport.ts configuration file - search users')
        // eslint-disable-next-line no-console
        console.log(error)
        return done(null)
      }
    }
  )
)
}

passport.use(
  new LocalStrategy(async function verify(username, password, done) {
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
)

if (process.env.SECRET_PHRASE) {
  passport.use(
    new JWTStrategy(
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
)
}

export default passport
