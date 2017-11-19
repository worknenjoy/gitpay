'use strict'

const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticationHelpers = require('../../authenticationHelpers');
const models = require('../../../loading/loading');
const controllers = require('../controllers/auth');

router.get('/authenticated', authenticationHelpers.isAuth, (req, res, next) => {
    res.send({ 'authenticated': true });
});
router.get('/authorize/google', passport.authenticate('google', { scope: ['email'], accessType: 'offline' }));
router.get('/callback/google', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/signin'
}));

router.get('/authorize/facebook', passport.authenticate('facebook', { scope: ['email'], accessType: 'offline' }));
router.get('/callback/facebook', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/signin'
}));

router.get('/authorize/github', passport.authenticate('github', { scope: ['email'], accessType: 'offline' }));
router.get('/callback/github', passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/signin'
}));

router.post('/authorize/local', (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {

        if (!user) {
            res.status(401);
            res.send({ 'reason': 'Invalid credentials' });
        } else {

            req.logIn(user, (err) => {

                if (err) {
                    res.status(500);
                    res.send({ "error": "Server error" });
                }

                res.send(user)
            });

        }
    })(req, res, next);
});

router.post('/auth/register', controllers.register)
router.get('/getUserAll', controllers.searchAll)

module.exports = router;