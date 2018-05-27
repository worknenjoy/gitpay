'use strict';
const Promise = require('bluebird');

exports.updateWebhook = (req, res) => {
  if(req.body.object == 'charge') {

    res.json(req.body);
  } else {
    res.send(false);
  }
}
