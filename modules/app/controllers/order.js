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

exports.createOrder = async (req, res) => {
  try {
    const data = await orderBuild(req.body)
    res.send(data)
  }
  catch (error) {
    res.status(401).send(error)
  }
}

exports.cancelOrder = async (req, res) => {
  try {
    const data = await orderCancel(req.body)
    res.send(data)
  }
  catch (error) {
    res.status(401).send(error)
  }
}

exports.refundOrder = async (req, res) => {
  try {
    const data = await orderRefund(req.params)
    res.send(data)
  }
  catch (error) {
    res.status(401).send(error)
  }
}

exports.detailsOrder = async (req, res) => {
  try {
    const data = await orderDetails(req.params)
    res.send(data)
  }
  catch (error) {
    res.status(401).send(error)
  }
}

exports.listOrders = async (req, res) => {
  try {
    const data = await orderSearch(req.query)
    res.send(data)
  }
  catch (error) {
    res.send(false)
  }
}

exports.fetchOrders = async (req, res) => {
  try {
    const data = await orderFetch(req.params)
    res.send(data)
  }
  catch (error) {
    res.send(false)
  }
}

exports.authorizeOrder = async (req, res) => {
  try {
    const data = await orderAuthorize(req.query)
    if (data.paid) {
      res.redirect(`${process.env.FRONTEND_HOST}/#/task/${data.TaskId}/order/${data.id}/status/success`)
    }
    else {
      res.redirect(`${process.env.FRONTEND_HOST}/#/task/${data.TaskId}/order/${data.id}/status/error`)
    }
  }
  catch (error) {
    res.redirect(process.env.FRONTEND_HOST)
  }
}

exports.updateOrder = async (req, res) => {
  try {
    const data = await orderUpdate(req.body)
    res.send(data)
  }
  catch (error) {
    res.status(401).send(error)
  }
}

exports.paymentOrder = async (req, res) => {
  try {
    const data = await orderPayment(req.body)
    res.send(data)
  }
  catch (error) {
    res.status(401).send(error)
  }
}

exports.transferOrder = async (req, res) => {
  try {
    const data = await orderTransfer(req.params, req.body)
    res.send(data)
  }
  catch (error) {
    res.status(401).send(error)
  }
}
