import Stripe from '../../../shared/stripe/stripe'
const stripe = Stripe()

export default async function orderFetchInvoice(sourceId: any) {
  const data = await stripe.invoices.retrieve(sourceId)

  return {
    stripe: {
      hosted_invoice_url: data.hosted_invoice_url,
      invoice_pdf: data.invoice_pdf
    }
  }
}
