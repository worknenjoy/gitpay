'use strict';
const passport = require('passport');
const models = require('../../../loading/loading');
const taskBuild = require('../../tasks').taskBuilds;
const taskSearch = require('../../tasks').taskSearch;
const Promise = require('bluebird');


exports.createTask = (req, res) => {
  taskBuild(req.body)
    .then((data) => {
      res.send(true);
    }).catch((error) => {
    console.log(error);
    res.send(false);
  });
}

exports.listTasks = (req, res) => {
  taskSearch()
    .then((data) => {
        res.send(data);
    }).catch((error) => {
        console.log(error);
        res.send(false);
  });
}
