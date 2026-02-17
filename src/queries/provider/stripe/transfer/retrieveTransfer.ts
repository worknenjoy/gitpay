import { retrieveTransfer as providerRetrieveTransfer } from '../../../../provider/stripe/transfer'

export const retrieveTransfer = async (transferId: string) => {
  return providerRetrieveTransfer(transferId)
}
