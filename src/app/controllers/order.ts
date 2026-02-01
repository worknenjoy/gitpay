import {
  orderBuilds as orderBuild,
  orderSearch,
  orderFetch,
  orderUpdate,
  orderAuthorize,
  orderPayment,
  orderCancel,
  orderDetails,
  orderTransfer,
  orderRefund
} from '../../modules/orders'

export const createOrder = async (req: any, res: any) => {
  try {
    const params = { ...req.body, ...{ userId: req.user.id } }
    const data = await orderBuild(params)
    res.send(data)
  } catch (error: any) {
    console.log('error on createOrder', error)
    res.status(401).send(error)
  }
}

export const cancelOrder = async (req: any, res: any) => {
  try {
    const params = { ...req.body, ...{ userId: req.user.id } }
    const data = await orderCancel(params)
    res.send(data)
  } catch (error: any) {
    res.status(401).send(error)
  }
}

export const refundOrder = async (req: any, res: any) => {
  try {
    const params = { ...req.params, ...{ userId: req.user.id } }
    const data = await orderRefund(params)
    res.send(data)
  } catch (error: any) {
    res.status(401).send(error)
  }
}

export const detailsOrder = async (req: any, res: any) => {
  try {
    const params = { ...req.params, ...{ userId: req.user.id } }
    const data = await orderDetails(params)
    res.send(data)
  } catch (error: any) {
    res.status(401).send(error)
  }
}

export const listOrders = async (req: any, res: any) => {
  try {
    const params = { ...req.params, ...{ userId: req.user.id } }
    const data = await orderSearch(params)
    res.send(data)
  } catch (error: any) {
    console.log('error on listOrders', error)
    res.send(false)
  }
}

export const fetchOrders = async (req: any, res: any) => {
  try {
    const params = { ...req.params, ...{ userId: req.user.id } }
    const data = await orderFetch(params)
    res.send(data)
  } catch (error: any) {
    res.send(false)
  }
}

export const authorizeOrder = async (req: any, res: any) => {
  try {
    const data = await orderAuthorize(req.query)
    if (data.paid) {
      res.redirect(
        `${process.env.FRONTEND_HOST}/#/task/${data.TaskId}/order/${data.id}/status/success`
      )
      return
    }
    res.redirect(`${process.env.FRONTEND_HOST}/#/task/${data.TaskId}/order/${data.id}/status/error`)
  } catch (error: any) {
    res.redirect(process.env.FRONTEND_HOST)
  }
}

export const updateOrder = async (req: any, res: any) => {
  try {
    const params = { ...req.body, ...{ userId: req.user.id, id: req.params.id } }
    const data = await orderUpdate(params)
    res.send(data)
  } catch (error: any) {
    res.status(401).send(error)
  }
}

export const paymentOrder = async (req: any, res: any) => {
  try {
    const params = { ...req.body, ...{ userId: req.user.id, id: req.params.id } }
    const data = await orderPayment(params)
    res.send(data)
  } catch (error: any) {
    res.status(401).send(error)
  }
}

export const transferOrder = async (req: any, res: any) => {
  try {
    const params = { ...req.params, ...{ userId: req.user.id } }
    const data = await orderTransfer(params, req.body)
    res.send(data)
  } catch (error: any) {
    res.status(401).send(error)
  }
}
