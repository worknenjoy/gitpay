import { retrieveProduct as retrieveProductProvider } from '../../../../provider/stripe/payment-request'

export async function retrieveProduct(productId: string) {
  return retrieveProductProvider(productId)
}
