import passport from 'passport'
import { userExists } from '../../modules/users'
import { createGoogleStrategy } from './google-strategy'
import { createFacebookStrategy } from './facebook-strategy'
import { createGitHubStrategy } from './github-strategy'
import { createBitbucketStrategy } from './bitbucket-strategy'
import { createLocalStrategy } from './local-strategy'
import { createJWTStrategy } from './jwt-strategy'

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
const googleStrategy = createGoogleStrategy()
if (googleStrategy) {
  passport.use(googleStrategy)
}

const facebookStrategy = createFacebookStrategy()
if (facebookStrategy) {
  passport.use(facebookStrategy)
}

const githubStrategy = createGitHubStrategy()
if (githubStrategy) {
  passport.use(githubStrategy)
}

const bitbucketStrategy = createBitbucketStrategy()
if (bitbucketStrategy) {
  passport.use(bitbucketStrategy)
}

const localStrategy = createLocalStrategy()
passport.use(localStrategy)

const jwtStrategy = createJWTStrategy()
if (jwtStrategy) {
  passport.use(jwtStrategy)
}

export default passport
