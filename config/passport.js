'use strict'
const { google, facebook, github, oauthCallbacks, bitbucket, mailchimp } = require('./secrets');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy
const gitHubStrategy = require('passport-github2').Strategy;
const bitbucketStrategy = require('passport-bitbucket-oauth20').Strategy;
const facebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const requestPromise = require('request-promise');

const userExist = require('../modules/users').userExists;
const userBuild = require('../modules/users').userBuilds;
const userUpdate = require('../modules/users').userUpdate;
const userFindOrCreate = require('../modules/users').userFindOrCreate;
const Promise = require('bluebird');

const Mailchimp = require('mailchimp-api-v3')
const mc = new Mailchimp(mailchimp.apiKey);

const mailChimpConnect = (mail) => {
  mc.post(`/lists/${mailchimp.listId}/members`, {
    email_address : mail,
    status : 'subscribed'
  })
    .then(function(results) {
      console.log('mailchimp');
      console.log(results);
    })
    .catch(function (err) {
      console.log('mailchimp error');
      console.log(err)
    });
}

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(

    new googleStrategy({
            clientID: google.id,
            clientSecret: google.secret,
            callbackURL: oauthCallbacks.googleCallbackUrl
        },
        (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => {

                const attributes = {
                    access_token: accessToken,
                    refresh_token: refreshToken
                };

                const data = {
                    provider: 'google',
                    social_id: profile.id,
                    profile: profile,
                    attribute: attributes,
                    email: profile.emails[0].value
                }

                userExist(data)
                    .then((user) => {

                        if (user){

                            userUpdat(data)
                                .then((user) => {
                                    return done(null, user);
                                }).catch((error) => {
                                    console.log("Error in passport.js configuration file");
                                    console.log(error);
                                    return done(null);
                                });

                        }else{

                            userBuild(data)
                                .then((user) => {
                                    return done(null, user);
                                }).catch((error) => {
                                    console.log("Error in passport.js configuration file");
                                    console.log(error);
                                    return done(null);
                                });
                        }

                    }).catch((error) => {
                        console.log("Error in passport.js configuration file - search users");
                        console.log(error);
                        return done(null);
                    });
            });

        })

);

passport.use(

    new gitHubStrategy({
            clientID: github.id,
            clientSecret: github.secret,
            callbackURL: oauthCallbacks.githubCallbackUrl
        },
        (accessToken, accessTokenSecret, profile, done) => {
            process.nextTick(() => {

                const attributes = {
                    access_token: accessToken,
                    access_token_secret: accessTokenSecret
                };

                const data = {
                    provider: 'github',
                    social_id: profile.id,
                    profile: profile,
                    attribute: attributes,
                    email: profile.emails[0].value
                }

                userExist(data)
                    .then((user) => {

                        if(user){

                            userUpdate(data)
                                .then((user) => {
                                    return done(null, user);
                                }).catch((error) => {
                                    console.log("Error in passport.js configuration file");
                                    console.log(error);
                                    return done(null);
                                });

                        }else{
                            userBuild(data)
                                .then((user) => {
                                    mailChimpConnect(profile.emails[0].value);
                                    return done(null, user);
                                }).catch((error) => {
                                    console.log("Error in passport.js configuration file");
                                    console.log(error);
                                    return done(null);
                                });
                        }

                    }).catch((error) => {
                        console.log("Error in passport.js configuration file - search users");
                        console.log(error);
                        return done(null);
                    });
            });

        })

);

passport.use(

    new facebookStrategy({
            clientID: facebook.id,
            clientSecret: facebook.secret,
            callbackURL: oauthCallbacks.facebookCallbackUrl
        },
        (accessToken, accessTokenSecret, profile, done) => {
            process.nextTick(() => {

                const attributes = {
                    access_token: accessToken,
                    access_token_secret: accessTokenSecret
                };

                const data = {
                    provider: 'facebook',
                    social_id: profile.id,
                    profile: profile,
                    attribute: attributes,
                    email: 'Checking a facebook setup'
                }

                userExist(data)
                    .then((user) => {

                        if(user){

                            userUpdate(data)
                                .then((user) => {
                                    return done(null, user);
                                }).catch((error) => {
                                    console.log("Error in passport.js configuration file");
                                    console.log(error);
                                    return done(null);
                                });

                        }else{

                            userBuild(data)
                                .then((user) => {
                                    return done(null, user);
                                }).catch((error) => {
                                    console.log("Error in passport.js configuration file");
                                    console.log(error);
                                    return done(null);
                                });
                        }

                    }).catch((error) => {
                        console.log("Error in passport.js configuration file - search users");
                        console.log(error);
                        return done(null);
                    });
            });

        })

);

passport.use(
  new bitbucketStrategy({
    clientID: bitbucket.id,
    clientSecret: bitbucket.secret,
    callbackURL: oauthCallbacks.bitbucketCallbackUrl
  },
  function (accessToken, accessTokenSecret, profile, done) {
    process.nextTick(() => {
      const attributes = {
        access_token: accessToken,
        access_token_secret: accessTokenSecret
      };

      const data = {
        provider: profile.provider,
        social_id: profile.account_id,
        profile: profile,
        attribute: attributes,
        email: profile.emails[0].value
      }

      userExist(data)
        .then((user) => {

          if(user){

            userUpdate(data)
              .then((user) => {
                console.log('user updated');
                console.log(user);

                return done(null, user);
              }).catch((error) => {
              console.log("Error in passport.js configuration file");
              console.log(error);
              return done(null);
            });

          }else{
            userBuild(data)
              .then((user) => {
                console.log('user created');
                console.log(user);
                mailChimpConnect(profile.emails[0].value);
                return done(null, user);
              }).catch((error) => {
              console.log("Error in passport.js configuration file");
              console.log(error);
              return done(null);
            });
          }

        }).catch((error) => {
        console.log("Error in passport.js configuration file - search users");
        console.log(error);
        return done(null);
      });
    })
}));



passport.use(
    new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        (email, password, done) => {
            process.nextTick(() => {

                const userAttributes = {
                    email: email
                }


                userExist(userAttributes)
                    .then((user) => {
                        if (!user) return done(null, false);
                        if (!user.verifyPassword(password, user.password)) return done(null, false);
                        return done(null, user);
                    }).catch((error) => {
                        return done(error);
                    })
            });

        })

);
