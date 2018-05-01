'use strict';
const passport = require('passport');
const models = require('../../../loading/loading');
const taskBuild = require('../../tasks').taskBuilds;
const taskSearch = require('../../tasks').taskSearch;
const taskFetch = require('../../tasks').taskFetch;
const taskUpdate = require('../../tasks').taskUpdate;
const Promise = require('bluebird');


exports.createTask = (req, res) => {
  taskBuild(req.body)
    .then((data) => {
      res.send(data);
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

exports.fetchTask = (req, res) => {
  taskFetch(req.params)
    .then((data) => {
      res.send(data);
    }).catch((error) => {
    console.log(error);
    res.send(false);
  });
}

exports.updateTask = (req, res) => {
  taskUpdate(req.body)
    .then((data) => {
      res.send(data);
    }).catch((error) => {
    console.log('error on task controller', error);
    res.send(false);
  });
}
