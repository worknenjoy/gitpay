import { listPaymentLinkLineItems as listPaymentLinkLineItemsProvider } from '../../../../provider/stripe/payment-request'

export async function listPaymentLinkLineItems(paymentLinkId: string, limit = 1) {
  return listPaymentLinkLineItemsProvider(paymentLinkId, limit)
}
