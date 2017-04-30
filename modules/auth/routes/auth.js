'use strict'

const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticationHelpers = require('../../authenticationHelpers');

router.get('/authenticated', authenticationHelpers.isAuth, (req, res, next) => {
    res.json({ "authenticated": true });
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

module.exports = router;