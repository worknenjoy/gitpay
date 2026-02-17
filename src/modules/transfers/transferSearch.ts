import { searchTransfers } from '../../queries/transfer/searchTransfers'

type TransferSearchParams = {
  userId?: number
  to?: number
}

export async function transferSearch(params: TransferSearchParams = {}) {
  return searchTransfers(params)
}
