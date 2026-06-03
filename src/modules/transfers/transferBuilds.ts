import { transferBuildsService } from '../../services/transfers/transferBuildsService'

type TransferBuildsParams = {
  transfer_id?: string
  taskId?: number
  userId?: number
}

export async function transferBuilds(params: TransferBuildsParams) {
  return transferBuildsService(params)
}
