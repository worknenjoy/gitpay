const orderBuild = require('../../orders').orderBuilds
const orderSearch = require('../../orders').orderSearch
const orderFetch = require('../../orders').orderFetch
const orderUpdate = require('../../orders').orderUpdate
const orderAuthorize = require('../../orders').orderAuthorize
const orderPayment = require('../../orders').orderPayment
const orderCancel = require('../../orders').orderCancel
const orderDetails = require('../../orders').orderDetails
const orderTransfer = require('../../orders').orderTransfer
const orderRefund = require('../../orders').orderRefund

exports.createOrder = (req, res) => {
  orderBuild(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      console.log('error on createOrder', error)
      res.status(401).send(error)
    })
}

exports.cancelOrder = (req, res) => {
  orderCancel(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      res.status(401).send(error)
    })
}

exports.refundOrder = (req, res) => {
  orderRefund(req.params)
    .then(data => {
      res.send(data)
    }).catch(error => {
      res.status(401).send(error)
    })
}

exports.detailsOrder = (req, res) => {
  orderDetails(req.params)
    .then(data => {
      res.send(data)
    }).catch(error => {
      res.status(401).send(error)
    })
}

exports.listOrders = (req, res) => {
  orderSearch(req.query)
    .then(data => {
      res.send(data)
    }).catch(error => {
      res.send(false)
    })
}

exports.fetchOrders = (req, res) => {
  orderFetch(req.params)
    .then(data => {
      res.send(data)
    }).catch(error => {
      res.send(false)
    })
}

exports.authorizeOrder = (req, res) => {
  orderAuthorize(req.query)
    .then(data => {
      if (data.paid) {
        res.redirect(`${process.env.FRONTEND_HOST}/#/task/${data.TaskId}/order/${data.id}/status/success`)
        return
      }
      res.redirect(`${process.env.FRONTEND_HOST}/#/task/${data.TaskId}/order/${data.id}/status/error`)
    }).catch(error => {
      res.redirect(process.env.FRONTEND_HOST)
    })
}

exports.updateOrder = (req, res) => {
  orderUpdate(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      res.status(401).send(error)
    })
}

exports.paymentOrder = (req, res) => {
  orderPayment(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      res.status(401).send(error)
    })
}

exports.transferOrder = (req, res) => {
  orderTransfer(req.params, req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      res.status(401).send(error)
    })
}
