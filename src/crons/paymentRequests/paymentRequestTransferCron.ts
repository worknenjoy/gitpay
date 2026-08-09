import { processPendingPaymentRequestTransfers } from '../../services/paymentRequest/processPendingPaymentRequestTransfers'

const PaymentRequestTransferCron = {
  /**
   * Process Whop payment-request transfers waiting for available platform balance.
   * Intended to run daily.
   */
  processPendingTransfers: async () => {
    return processPendingPaymentRequestTransfers()
  }
}

module.exports = PaymentRequestTransferCron
export default PaymentRequestTransferCron
