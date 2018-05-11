'use strict'
const passport = require('passport');
const models = require('../../../loading/loading');
const userBuild = require('../../users').userBuilds;
const userSearch = require('../../users').userSearch;
const Promise = require('bluebird');


exports.register = (req, res) => {

    userBuild(req.body)
        .then((data) => {
            res.send(data);
        }).catch((error) => {
            console.log(error);
            res.send(false);
        });
}

exports.searchAll = (req, res) => {

    userSearch()
        .then((data) => {
            res.send(data);
        }).catch((error) => {
            console.log(error);
            res.send(false);
        });
}
