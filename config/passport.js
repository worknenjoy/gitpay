'use strict'
const config = require('./config');
const User = require('../loading/user');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth2').Strategy;
const gitHubStrategy = require('passport-github2').Strategy;
const facebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const requestPromise = require('request-promise');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(

    new googleStrategy({
            clientID: config.oauthCredentials.google.id,
            clientSecret: config.oauthCredentials.google.secret,
            callbackURL: config.oauthCallbacks.googleCallbackUrl,
            passReqToCallback: true
        },

        (request, accessToken, refreshToken, profile, done) => {
            process.nextTick(() => {

                const attributes = {
                    access_token: accessToken,
                    refresh_token: refreshToken
                };

                return done(null);

                // const data = {
                //     provider: 'google',
                //     social_id: profile.id,
                //     profile: profile,
                //     attribute: attributes
                // }

                // return User.upsert(data)
                //     .then((user) => {
                //         return done(null, user);
                //     }).catch((error) => {
                //         console.log("Error in passport.js configuration file");
                //         console.log(error);
                //         return done(null);
                //     });

            });

        })

);

passport.use(

    new gitHubStrategy({
            clientID: config.oauthCredentials.github.id,
            clientSecret: config.oauthCredentials.github.secret,
            callbackURL: config.oauthCallbacks.githubCallbackUrl
        },
        (accessToken, accessTokenSecret, profile, done) => {
            process.nextTick(() => {

                const attributes = {
                    access_token: accessToken,
                    access_token_secret: accessTokenSecret
                };

                // const data = {
                //     provider: 'github',
                //     social_id: profile.id,
                //     profile: profile,
                //     attribute: attributes
                // }

                // return User.upsert(data)
                //     .then((user) => {
                //         return done(null, user);
                //     }).catch((error) => {
                //         console.log("Error in passport.js configuration file");
                //         console.log(error);
                //         return done(null);
                //     });

            });

        })

);

passport.use(

    new facebookStrategy({
            clientID: config.oauthCredentials.facebook.id,
            clientSecret: config.oauthCredentials.facebook.secret,
            callbackURL: config.oauthCallbacks.facebookCallbackUrl
        },
        (accessToken, accessTokenSecret, profile, done) => {
            process.nextTick(() => {

                const attributes = {
                    access_token: accessToken,
                    access_token_secret: accessTokenSecret
                };

                // const data = {
                //     provider: 'facebook',
                //     social_id: profile.id,
                //     profile: profile,
                //     attribute: attributes
                // }

                // return User.upsert(data)
                //     .then((user) => {
                //         return done(null, user);
                //     }).catch((error) => {
                //         console.log("Error in passport.js configuration file");
                //         console.log(error);
                //         return done(null);
                //     });

            });

        })

);

passport.use(
    new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        (req, email, password, done) => {
            // provider: 'local' where below
            process.nextTick(() => {
                return User.findOne({ where: { email: email } })
                    .then((user) => {
                        if (!user) return done(null, false);
                        if (!user.verifyPassword(password)) return done(null, false);
                        return done(null, user);
                    }).catch((error) => {
                        return done(error);
                    });
            });

        })

);