import { transferUpdate as transferUpdateMutation } from '../../mutations/transfer/transferUpdate'

type TransferUpdateParams = {
  id?: number
  userId?: number
}

export async function transferUpdate(params: TransferUpdateParams) {
  return transferUpdateMutation(params)
}
