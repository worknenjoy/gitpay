'use strict'
/**
 * Authentication helpers to determine if a user is logged in or not
 * before a route returns information to the response
 */

function isAuthOrRedirect(req, res, next) {
    if (req.isAuthenticated()) return next()

    res.redirect('/signin');
}

function isNotAuthOrRedirect(req, res, next) {
    if (!req.isAuthenticated()) return next()

    res.redirect('/');
}

function isAuth(req, res, next) {
    if (req.isAuthenticated()) return next()

    res.status(401).json({ 'authenticated': false });
}

function isNotAuth(req, res, next) {
    if (!req.isAuthenticated()) return next()

    res.send({ 'authenticated': true });
}

module.exports = {
    isAuthOrRedirect: isAuthOrRedirect,
    isNotAuthOrRedirect: isNotAuthOrRedirect,
    isAuth: isAuth,
    isNotAuth: isNotAuth
}