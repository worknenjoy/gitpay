import Models from '../../models'

const models = Models as any

export async function getPaymentLinkType(name: string = 'default') {
  return models.PaymentLinkType.findOne({ where: { name } })
}

export default getPaymentLinkType
