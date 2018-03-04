'use strict'
/**
 * Authentication helpers to determine if a user is logged in or not
 * before a route returns information to the response
 */

const userExist = require('../modules/users').userExists;
const jwt = require('jsonwebtoken');

function isAuthOrRedirect(req, res, next) {
    if (req.isAuthenticated()) return next()

    res.redirect('/');
}

function isNotAuthOrRedirect(req, res, next) {
    if (!req.isAuthenticated()) return next()

    res.redirect('/');
}

function isAuth(req, res, next) {
    if (req.isAuthenticated()) return next()

  //res.status(401).json({ 'authenticated': false });
  console.log(req.isAuthenticated());

  //console.log(req);
  /*if(!req.headers.authorization) {
    return res.status(401).end();
  }*/
  console.log('is auth');
  const token = req.headers.authorization.split(' ')[1];
  return jwt.verify(token, process.env.SECRET_PHRASE, (err, decoded) => {
    console.log(err);
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    const userEmail = decoded.email;
    // check if a user exists
    return userExist(userEmail).then((user) => {
      console.log(user);
      return next();
    }).catch(e => {
      console.log('error to sign user');
      return res.status(401).end();
    });
  });
  return next();
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
