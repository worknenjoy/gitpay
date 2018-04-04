'use strict'
const passport = require('passport');
const models = require('../../../loading/loading');
const taskBuild = require('../../tasks').taskBuild;
const taskSearch = require('../../tasks').taskSearch;
const Promise = require('bluebird');


exports.create = (req, res) => {
  taskBuild(req.body)
    .then((data) => {
      res.send(true);
    }).catch((error) => {
    console.log(error);
    res.send(false);
  });
}

exports.list = (req, res) => {
  taskSearch()
    .then((data) => {
        res.send(data);
    }).catch((error) => {
        console.log(error);
        res.send(false);
  });
}
