const orderBuild = require('../../orders').orderBuilds
const orderSearch = require('../../orders').orderSearch
const orderFetch = require('../../orders').orderFetch
const orderUpdate = require('../../orders').orderUpdate

exports.createOrder = (req, res) => {
  orderBuild(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.listOrders = (req, res) => {
  orderSearch()
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
      //res.send(data)
      console.log('updateOrders controller', data)
      res.redirect(`${process.env.FRONTEND_HOST}/#/task/${data.TaskId}/successOrder`)
    }).catch(error => {
    // eslint-disable-next-line no-console
    console.log(error)
    res.status(401).send(error)
  })
}
