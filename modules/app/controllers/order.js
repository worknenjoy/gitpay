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
  const params = { ...req.body, ...{ userId: req.user.id } }
  orderBuild(params)
    .then(data => {
      res.send(data)
    }).catch(error => {
      console.log('error on createOrder', error)
      res.status(401).send(error)
    })
}

exports.cancelOrder = (req, res) => {
  const params = { ...req.body, ...{ userId: req.user.id } }
  orderCancel(params)
    .then(data => {
      res.send(data)
    }).catch(error => {
      res.status(401).send(error)
    })
}

exports.refundOrder = (req, res) => {
  const params = { ...req.params, ...{ userId: req.user.id } }
  orderRefund(params)
    .then(data => {
      res.send(data)
    }).catch(error => {
      res.status(401).send(error)
    })
}

exports.detailsOrder = (req, res) => {
  const params = { ...req.params, ...{ userId: req.user.id } }
  orderDetails(params)
    .then(data => {
      res.send(data)
    }).catch(error => {
      res.status(401).send(error)
    })
}

exports.listOrders = (req, res) => {
  const params = { ...req.params, ...{ userId: req.user.id } }
  orderSearch(params)
    .then(data => {
      res.send(data)
    }).catch(error => {
      res.send(false)
    })
}

exports.fetchOrders = (req, res) => {
  const params = { ...req.params, ...{ userId: req.user.id } }
  orderFetch(params)
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
  const params = { ...req.body, ...{ userId: req.user.id, id: req.params.id } }
  orderUpdate(params)
    .then(data => {
      res.send(data)
    }).catch(error => {
      res.status(401).send(error)
    })
}

exports.paymentOrder = (req, res) => {
  const params = { ...req.body, ...{ userId: req.user.id, id: req.params.id } }
  orderPayment(params)
    .then(data => {
      res.send(data)
    }).catch(error => {
      res.status(401).send(error)
    })
}

exports.transferOrder = (req, res) => {
  const params = { ...req.params, ...{ userId: req.user.id } }
  orderTransfer(params, req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      res.status(401).send(error)
    })
}
