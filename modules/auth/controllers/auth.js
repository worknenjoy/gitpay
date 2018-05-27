'use strict'
const passport = require('passport');
const models = require('../../../loading/loading');
const user = require('../../users');
const Promise = require('bluebird');


exports.register = (req, res) => {

    user.userBuilds(req.body)
        .then((data) => {
            res.send(data);
        }).catch((error) => {
            console.log(error);
            res.send(false);
        });
}

exports.searchAll = (req, res) => {

    user.userSearch()
        .then((data) => {
            res.send(data);
        }).catch((error) => {
            console.log(error);
            res.send(false);
        });
}

exports.customer = (req, res) => {
  user.userCustomer(req.body)
    .then((data) => {
      res.send(data);
    }).catch((error) => {
    console.log(error);
    res.send(false);
  });
}

exports.account = (req, res) => {
  user.userAccount(req.params)
    .then((data) => {
      res.send(data);
    }).catch((error) => {
    console.log(error);
    res.send(false);
  });
}

exports.accountCreate = (req, res) => {
  user.userAccountCreate(req.body)
    .then((data) => {
      res.send(data);
    }).catch((error) => {
    console.log(error);
    res.send(false);
  });
}

exports.accountUpdate = (req, res) => {
  user.userAccountUpdate(req.body)
    .then((data) => {
      res.send(data);
    }).catch((error) => {
    console.log(error);
    res.send(false);
  });
}

exports.bankAccount = (req, res) => {
    user.userBankAccount(req.body)
    .then((data) => {
      res.send(data);
    }).catch((error) => {
    console.log(error);
    res.send(false);
  });
}
