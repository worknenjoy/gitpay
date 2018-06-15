'use strict';
const Tasks = require('../../tasks');
const Promise = require('bluebird');


exports.createTask = (req, res) => {
  Tasks.taskBuilds(req.body)
    .then((data) => {
      res.send(data);
    }).catch((error) => {
    console.log(error);
    res.send(error);
  });
}

exports.listTasks = (req, res) => {
  Tasks.taskSearch()
    .then((data) => {
        res.send(data);
    }).catch((error) => {
        console.log(error);
        res.send(false);
  });
}

exports.fetchTask = (req, res) => {
  Tasks.taskFetch(req.params)
    .then((data) => {
      res.send(data);
    }).catch((error) => {
    console.log(error);
    res.send(false);
  });
}

exports.updateTask = (req, res) => {
  Tasks.taskUpdate(req.body)
    .then((data) => {
      res.send(data);
    }).catch((error) => {
      res.status(400).send(error);
    });
}

exports.paymentTask = (req, res) => {
  Tasks.taskPayment(req.body)
    .then((data) => {
      res.send(data);
    }).catch((error) => {
      console.log('error on task controller', error);
      console.log('error raw', error.raw);
      res.send({error: error.raw});
    });
}

exports.syncTask = (req, res) => {
  Tasks.taskSync(req.params)
    .then((data) => {
      res.send(data);
    }).catch((error) => {
    console.log('error on task controller', error);
    console.log('error raw', error.raw);
    res.send({error: error.raw});
  });
}
