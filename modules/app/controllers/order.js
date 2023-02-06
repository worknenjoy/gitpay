const orderBuild = require('../../orders').orderBuilds
const orderSearch = require('../../orders').orderSearch
const orderFetch = require('../../orders').orderFetch
const orderUpdate = require('../../orders').orderUpdate
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
      // eslint-disable-next-line no-console
      console.log(error)
      res.status(401).send(error)
    })
}

exports.cancelOrder = (req, res) => {
  orderCancel(req.body)
    .then(data => {
      // eslint-disable-next-line no-console
      console.log('data send from controller on cancelOrder', data)
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error on cancelOrder', error)
      res.status(401).send(error)
    })
}

exports.refundOrder = (req, res) => {
  orderRefund(req.params)
    .then(data => {
      // eslint-disable-next-line no-console
      console.log('data send from controller on details Order controller', data)
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error on cancelDetails', error)
      res.status(401).send(error)
    })
}

exports.detailsOrder = (req, res) => {
  orderDetails(req.params)
    .then(data => {
      // eslint-disable-next-line no-console
      console.log('data send from controller on details Order controller', data)
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error on cancelDetails', error)
      res.status(401).send(error)
    })
}

exports.listOrders = (req, res) => {
  orderSearch(req.query)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.fetchOrders = (req, res) => {
  orderFetch(req.params)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.updateOrders = (req, res) => {
  orderUpdate(req.query)
    .then(data => {
      if (data.paid) {
        res.redirect(`${process.env.FRONTEND_HOST}/#/task/${data.TaskId}/order/${data.id}/status/success`)
        return
      }
      res.redirect(`${process.env.FRONTEND_HOST}/#/task/${data.TaskId}/order/${data.id}/status/error`)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('updateOrders error', error)
      res.redirect(process.env.FRONTEND_HOST)
    })
}

exports.paymentOrder = (req, res) => {
  orderPayment(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
    // eslint-disable-next-line no-console
      console.log(error)
      res.status(401).send(error)
    })
}

exports.transferOrder = (req, res) => {
  orderTransfer(req.params, req.body)
    .then(data => {
      // eslint-disable-next-line no-console
      console.log('data sent from transfer order', data)
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error on transfer order', error)
      res.status(401).send(error)
    })
}
