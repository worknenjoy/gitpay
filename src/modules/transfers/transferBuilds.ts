import { transferBuilds as transferBuildsMutation } from '../../mutations/transfer/transferBuilds'

type TransferBuildsParams = {
  transfer_id?: string
  taskId?: number
  userId?: number
}

export async function transferBuilds(params: TransferBuildsParams) {
  return transferBuildsMutation(params)
}
