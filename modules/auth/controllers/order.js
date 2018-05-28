'use strict';
const passport = require('passport');
const models = require('../../../loading/loading');
const orderBuild = require('../../orders').orderBuilds;
const orderSearch = require('../../orders').orderSearch;
const orderFetch = require('../../orders').orderFetch;
const Promise = require('bluebird');


exports.createOrder = (req, res) => {
  orderBuild(req.body)
    .then((data) => {
      res.send(data);
    }).catch((error) => {
    console.log(error);
    res.send(false);
  });
}

exports.listOrders = (req, res) => {
  orderSearch()
    .then((data) => {
        res.send(data);
    }).catch((error) => {
        console.log(error);
        res.send(false);
  });
}

exports.fetchOrders = (req, res) => {
  orderFetch(req.params)
    .then((data) => {
      res.send(data);
    }).catch((error) => {
    console.log(error);
    res.send(false);
  });
}
