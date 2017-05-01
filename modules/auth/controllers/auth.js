'use strict'

const passport = require('passport');
const models = require('../../../loading/loading');

exports.getUser = (req, res, next) => {
    console.log(req)
    passport.authenticate('local', (err, user, info) => {

        if (!user) {
            res.status(401);
            res.send({ 'reason': 'Invalid credentials' });
        } else {
            req.logIn(user, (err) => {
                if (err) {
                    res.status(500);
                    res.send({ 'error': 'Server error' });
                }
            });

            console.log(user)

            models.User.findOne({
                where: {
                    email: user.email
                }
            }).then((data) => {
                res.send(data)
            }).catch((err) => {
                console.log(err)
                res.send(err)
            })

        }
    })(req, res, next);
}