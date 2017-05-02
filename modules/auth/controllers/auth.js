'use strict'

const passport = require('passport');
const models = require('../../../loading/loading');

exports.register = (req, res) => {

    req.body.password = models.User.generateHash(req.body.password)

    models.User
        .build(
            req.body
        )
        .save()
        .then((data) => {
            res.send(true);
        }).catch((error) => {
            console.log(error);
            res.send(false);
        });
}