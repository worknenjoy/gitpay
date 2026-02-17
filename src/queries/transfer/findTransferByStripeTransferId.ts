import Models from '../../models'

const models = Models as any

export const findTransferByStripeTransferId = async (
  stripeTransferId: string,
  options: any = {}
) => {
  return models.Transfer.findOne({
    where: {
      transfer_id: stripeTransferId
    },
    ...options
  })
}
