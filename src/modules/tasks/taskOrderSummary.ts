import Decimal from 'decimal.js'

type OrderSummaryInput = {
  amount: number | string
  status?: string
  paid?: boolean
  provider?: string
  transfer_id?: string | null
}

// Pure aggregation, kept separate from persistence so every money/status branch
// can be covered without opening a real payment or database connection.
export function summarizeTaskOrders(orders: OrderSummaryInput[]) {
  const total = {
    available: new Decimal(0),
    pending: new Decimal(0),
    failed: new Decimal(0),
    card: new Decimal(0),
    paypal: new Decimal(0),
    transferred: new Decimal(0)
  }

  orders.forEach((order) => {
    const amount = new Decimal(order.amount)
    if (order.status === 'open') {
      total.pending = Decimal.add(total.pending, amount)
    } else if (order.paid) {
      total.available = Decimal.add(total.available, amount)
      if (order.provider === 'paypal') {
        total.paypal = Decimal.add(total.paypal, amount)
      } else {
        total.card = Decimal.add(total.card, amount)
      }
      if (order.transfer_id) {
        total.transferred = Decimal.add(total.transferred, amount)
      }
    } else {
      total.failed = Decimal.add(total.failed, amount)
    }
  })

  return total
}
