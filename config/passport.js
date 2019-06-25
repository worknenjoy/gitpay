const {
  google,
  facebook,
  github,
  oauthCallbacks,
  bitbucket,
  mailchimp
} = require('./secrets')
const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy
const gitHubStrategy = require('passport-github2').Strategy
const bitbucketStrategy = require('passport-bitbucket-oauth20').Strategy
const facebookStrategy = require('passport-facebook').Strategy
const LocalStrategy = require('passport-local').Strategy
const requestPromise = require('request-promise')
const passportJWT = require('passport-jwt')
const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy

const userExist = require('../modules/users').userExists
const userBuild = require('../modules/users').userBuilds
const userUpdate = require('../modules/users').userUpdate

const jwt = require('jsonwebtoken')
const Mailchimp = require('mailchimp-api-v3')

const mailChimpConnect = mail => {
  if (!mailchimp.apiKey) {
    return
  }

  const mc = new Mailchimp(mailchimp.apiKey)
  mc.post(`/lists/${mailchimp.listId}/members`, {
    email_address: mail,
    status: 'subscribed'
  })
    .then(results => {
      // eslint-disable-next-line no-console
      console.log('mailchimp')
      // eslint-disable-next-line no-console
      console.log(results)
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.log('mailchimp error')
      // eslint-disable-next-line no-console
      console.log(err)
    })
}

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  userExist(user).then(user => {
    done(null, user)
  })
})

/* eslint-disable new-cap */
passport.use(
  new googleStrategy(
    {
      clientID: google.id,
      clientSecret: google.secret,
      callbackURL: oauthCallbacks.googleCallbackUrl
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        const attributes = {
          access_token: accessToken,
          refresh_token: refreshToken
        }

        const data = {
          provider: 'google',
          social_id: profile.id,
          profile: profile,
          attribute: attributes,
          email: profile.emails[0].value
        }

        userExist(data)
          .then(user => {
            if (user) {
              userUpdate(data)
                .then(user => {
                  return done(null, user)
                })
                .catch(error => {
                  // eslint-disable-next-line no-console
                  console.log('Error in passport.js configuration file')
                  // eslint-disable-next-line no-console
                  console.log(error)

                  return done(null)
                })
            }
            else {
              userBuild(data)
                .then(user => {
                  return done(null, user)
                })
                .catch(error => {
                  // eslint-disable-next-line no-console
                  console.log('Error in passport.js configuration file')
                  // eslint-disable-next-line no-console
                  console.log(error)

                  return done(null)
                })
            }
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(
              'Error in passport.js configuration file - search users'
            )
            // eslint-disable-next-line no-console
            console.log(error)

            return done(null)
          })
      })
    }
  )
)

passport.use(
  new facebookStrategy(
    {
      clientID: facebook.id,
      clientSecret: facebook.secret,
      callbackURL: oauthCallbacks.facebookCallbackUrl
    },
    (accessToken, accessTokenSecret, profile, done) => {
      process.nextTick(_ => {
        const attributes = {
          access_token: accessToken,
          access_token_secret: accessTokenSecret
        }

        const data = {
          provider: 'facebook',
          social_id: profile.id,
          profile: profile,
          attribute: attributes,
          email: 'Checking a facebook setup'
        }

        userExist(data)
          .then(user => {
            if (user) {
              userUpdate(data)
                .then(user => {
                  return done(null, user)
                })
                .catch(error => {
                  // eslint-disable-next-line no-console
                  console.log('Error in passport.js configuration file')
                  // eslint-disable-next-line no-console
                  console.log(error)
                  return done(null)
                })
            }
            else {
              userBuild(data)
                .then(user => {
                  return done(null, user)
                })
                .catch(error => {
                  // eslint-disable-next-line no-console
                  console.log('Error in passport.js configuration file')
                  // eslint-disable-next-line no-console
                  console.log(error)

                  return done(null)
                })
            }
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(
              'Error in passport.js configuration file - search users'
            )
            // eslint-disable-next-line no-console
            console.log(error)

            return done(null)
          })
      })
    }
  )
)

passport.use(
  new gitHubStrategy(
    {
      clientID: github.id,
      clientSecret: github.secret,
      callbackURL: oauthCallbacks.githubCallbackUrl,
      scope: ['user:email', 'read:org']
    },
    (accessToken, accessTokenSecret, profile, done) => {
      process.nextTick(() => {
        const data = {
          provider: profile.provider,
          social_id: profile.id,
          name: profile.displayName,
          username: profile.username,
          picture_url: profile.photos[0].value,
          website: profile._json.blog,
          profile_url: profile.profileUrl,
          repos: 0,
          email: profile.emails ? profile.emails[0].value : profile._json.email
        }

        if (!data.email) {
          return done(null)
        }

        requestPromise({
          uri: `https://api.github.com/users/${profile.username}/repos`,
          headers: {
            'User-Agent':
              'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0',
            authorization: `token ${accessToken}`
          }
        })
          .then(response => {
            data.repos = JSON.parse(response).length
            userExist(data)
              .then(user => {
                if (user) {
                  userUpdate(data)
                    .then(user => {
                      const token = jwt.sign(
                        { email: data.email },
                        process.env.SECRET_PHRASE
                      )
                      data.token = token
                      return done(null, data)
                    })
                    .catch(error => {
                      // eslint-disable-next-line no-console
                      console.log('Error in passport.js configuration file')
                      // eslint-disable-next-line no-console
                      console.log(error)

                      return done(null)
                    })
                }
                else {
                  userBuild(data)
                    .then(user => {
                      const token = jwt.sign(
                        { email: data.email },
                        process.env.SECRET_PHRASE
                      )
                      data.token = token
                      mailChimpConnect(data.email)
                      return done(null, data)
                    })
                    .catch(error => {
                      // eslint-disable-next-line no-console
                      console.log('Error in passport.js configuration file')
                      // eslint-disable-next-line no-console
                      console.log(error)

                      return done(null)
                    })
                }
              })
              .catch(error => {
                // eslint-disable-next-line no-console
                console.log(
                  'Error in passport.js configuration file - search users'
                )
                // eslint-disable-next-line no-console
                console.log(error)

                return done(null)
              })
          })
          .catch(e => {
            // eslint-disable-next-line no-console
            console.log('error')
            // eslint-disable-next-line no-console
            console.log(e)

            return done(null)
          })
      })
    }
  )
)

passport.use(
  new bitbucketStrategy(
    {
      clientID: bitbucket.id,
      clientSecret: bitbucket.secret,
      callbackURL: oauthCallbacks.bitbucketCallbackUrl
    },
    function (accessToken, accessTokenSecret, profile, done) {
      process.nextTick(() => {
        const data = {
          provider: profile.provider,
          social_id: profile.id,
          name: profile.displayName,
          username: profile.username,
          picture_url: profile._json.links.avatar.href,
          website: profile._json.website,
          repos: 0,
          email: profile.emails[0].value
        }

        requestPromise({
          uri: `https://api.bitbucket.org/2.0/repositories/${profile.username}`,
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        })
          .then(response => {
            data.repos = JSON.parse(response).size
            userExist(data)
              .then(user => {
                if (user) {
                  userUpdate(data)
                    .then(_ => {
                      const token = jwt.sign(
                        { email: data.email },
                        process.env.SECRET_PHRASE
                      )
                      data.token = token
                      return done(null, data)
                    })
                    .catch(error => {
                      // eslint-disable-next-line no-console
                      console.log('Error in passport.js configuration file')
                      // eslint-disable-next-line no-console
                      console.log(error)

                      return done(null)
                    })
                }
                else {
                  userBuild(data)
                    .then(user => {
                      mailChimpConnect(profile.emails[0].value)
                      return done(null, user)
                    })
                    .catch(error => {
                      // eslint-disable-next-line no-console
                      console.log('Error in passport.js configuration file')
                      // eslint-disable-next-line no-console
                      console.log(error)

                      return done(null)
                    })
                }
              })
              .catch(error => {
                // eslint-disable-next-line no-console
                console.log(
                  'Error in passport.js configuration file - search users'
                )
                // eslint-disable-next-line no-console
                console.log(error)

                return done(null)
              })
          })
          .catch(e => {
            // eslint-disable-next-line no-console
            console.log('error')
            // eslint-disable-next-line no-console
            console.log(e)

            return done(null)
          })
      })
    }
  )
)

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, done) => {
      process.nextTick(_ => {
        const userAttributes = {
          email: email
        }
        userExist(userAttributes)
          .then(user => {
            if (!user) return done(null, false)
            if (user.verifyPassword(password, user.password)) {
              const token = jwt.sign(
                { email: user.email },
                process.env.SECRET_PHRASE
              )
              user.token = token
              return done(null, user)
            }
            return done(null, false)
          })
          .catch(error => {
            return done(error)
          })
      })
    }
  )
)

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_PHRASE
},
(jwtPayload, done) => {
  process.nextTick(_ => {
    const userAttributes = {
      email: jwtPayload.email
    }
    userExist(userAttributes)
      .then(user => {
        if (!user) return done(null, false)
        return done(null, user)
      })
      .catch(error => {
        return done(error)
      })
  })
}
))
